import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import axios from "axios";

// M-Pesa Daraja API — STK Push (Lipa Na M-Pesa Online)
const getMpesaToken = async () => {
    const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');
    const { data } = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        { headers: { Authorization: `Basic ${auth}` } }
    );
    return data.access_token;
};

const formatPhone = (phone) => {
    // Normalize to 254XXXXXXXXX format
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    if (cleaned.startsWith('0')) return '254' + cleaned.slice(1);
    if (cleaned.startsWith('254')) return cleaned;
    return '254' + cleaned;
};

// POST /api/payment/mpesa — initiate STK Push
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { orderId, phone, amount } = await request.json();

        if (!orderId || !phone || !amount) {
            return NextResponse.json({ success: false, message: 'Missing required fields' });
        }

        const { MPESA_SHORTCODE, MPESA_PASSKEY, MPESA_CALLBACK_URL } = process.env;

        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`).toString('base64');

        const token = await getMpesaToken();

        const stkPayload = {
            BusinessShortCode: MPESA_SHORTCODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.ceil(amount),
            PartyA: formatPhone(phone),
            PartyB: MPESA_SHORTCODE,
            PhoneNumber: formatPhone(phone),
            CallBackURL: `${MPESA_CALLBACK_URL}/api/payment/mpesa/callback`,
            AccountReference: `BSK-${orderId.slice(-8)}`,
            TransactionDesc: `Build Smart Ke Order #${orderId.slice(-8)}`,
        };

        const { data } = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.ResponseCode === '0') {
            // Store CheckoutRequestID for callback matching
            await connectDB();
            await Order.findByIdAndUpdate(orderId, {
                paymentMethod: 'mpesa',
                paymentRef: data.CheckoutRequestID,
                paymentStatus: 'pending'
            });

            return NextResponse.json({
                success: true,
                message: 'M-Pesa prompt sent to your phone. Complete payment to confirm order.',
                checkoutRequestId: data.CheckoutRequestID
            });
        } else {
            return NextResponse.json({ success: false, message: data.ResponseDescription || 'M-Pesa request failed' });
        }

    } catch (error) {
        console.error('M-Pesa STK Push error:', error.response?.data || error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
