import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import axios from "axios";

// PesaPal v3 API — https://developer.pesapal.com/how-to-integrate/e-commerce/api-30-json/api-reference
const PESAPAL_BASE = process.env.PESAPAL_ENV === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3';   // sandbox

// Step 1: Get OAuth token
const getPesapalToken = async () => {
    const { data } = await axios.post(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
    }, {
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    });
    if (!data.token) throw new Error('Failed to obtain PesaPal token');
    return data.token;
};

// Step 2 (once per deployment or periodically): Register IPN URL
// This only needs to be done once. Called here lazily on first payment.
const registerIPN = async (token) => {
    const callbackUrl = `${process.env.PESAPAL_CALLBACK_URL}/api/payment/pesapal/ipn`;
    const { data } = await axios.post(`${PESAPAL_BASE}/api/URLSetup/RegisterIPN`, {
        url: callbackUrl,
        ipn_notification_type: 'POST',
    }, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        }
    });
    return data.ipn_id;
};

// POST /api/payment/pesapal — initiate payment & return hosted checkout URL
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' });

        const { orderId, amount, description } = await request.json();
        if (!orderId || !amount) {
            return NextResponse.json({ success: false, message: 'orderId and amount are required' });
        }

        await connectDB();

        const order = await Order.findById(orderId);
        if (!order) return NextResponse.json({ success: false, message: 'Order not found' });

        const token = await getPesapalToken();
        const ipnId = await registerIPN(token);

        // Step 3: Submit order to PesaPal
        const callbackUrl = `${process.env.PESAPAL_CALLBACK_URL}/order-placed?orderId=${orderId}`;

        const orderPayload = {
            id: orderId,                     // your internal order ID
            currency: 'KES',
            amount: Number(amount),
            description: description || `Build Smart Ke Order`,
            callback_url: callbackUrl,
            notification_id: ipnId,
            billing_address: {
                email_address: '',           // optional; populated if you have user email
                phone_number: '',
                country_code: 'KE',
            }
        };

        const { data: submitData } = await axios.post(
            `${PESAPAL_BASE}/api/Transactions/SubmitOrderRequest`,
            orderPayload,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            }
        );

        if (!submitData.redirect_url) {
            return NextResponse.json({
                success: false,
                message: submitData.error?.message || 'PesaPal did not return a redirect URL'
            });
        }

        // Store PesaPal order tracking ID for IPN matching
        await Order.findByIdAndUpdate(orderId, {
            paymentMethod: 'pesapal',
            paymentRef: submitData.order_tracking_id,
            paymentStatus: 'pending',
        });

        return NextResponse.json({
            success: true,
            redirectUrl: submitData.redirect_url,
            orderTrackingId: submitData.order_tracking_id,
        });

    } catch (error) {
        console.error('PesaPal error:', error.response?.data || error.message);
        return NextResponse.json({ success: false, message: error.message });
    }
}
