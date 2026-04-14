import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import axios from "axios";

const PESAPAL_BASE = process.env.PESAPAL_ENV === 'production'
    ? 'https://pay.pesapal.com/v3'
    : 'https://cybqa.pesapal.com/pesapalv3';

// POST /api/payment/pesapal/ipn — PesaPal sends payment notification here
export async function POST(request) {
    try {
        const body = await request.json();
        const { orderTrackingId, orderMerchantReference, orderNotificationType } = body;

        if (!orderTrackingId) {
            return NextResponse.json({ orderNotificationType, orderTrackingId, orderMerchantReference, status: '200' });
        }

        // Get token and verify transaction status with PesaPal
        const authRes = await axios.post(`${PESAPAL_BASE}/api/Auth/RequestToken`, {
            consumer_key: process.env.PESAPAL_CONSUMER_KEY,
            consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
        }, { headers: { Accept: 'application/json', 'Content-Type': 'application/json' } });

        const token = authRes.data.token;

        const { data: txData } = await axios.get(
            `${PESAPAL_BASE}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
            { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }
        );

        await connectDB();

        // txData.payment_status_description: 'Completed' | 'Failed' | 'Invalid' | 'Reversed'
        const isPaid = txData.payment_status_description === 'Completed';
        const isFailed = ['Failed', 'Invalid', 'Reversed'].includes(txData.payment_status_description);

        if (isPaid) {
            await Order.findOneAndUpdate(
                { paymentRef: orderTrackingId },
                {
                    paymentStatus: 'paid',
                    paymentRef: txData.confirmation_code || orderTrackingId,
                    status: 'Processing'
                }
            );
        } else if (isFailed) {
            await Order.findOneAndUpdate(
                { paymentRef: orderTrackingId },
                { paymentStatus: 'failed' }
            );
        }

        // PesaPal requires this exact response format
        return NextResponse.json({
            orderNotificationType,
            orderTrackingId,
            orderMerchantReference,
            status: '200'
        });

    } catch (error) {
        console.error('PesaPal IPN error:', error.message);
        return NextResponse.json({ status: '500', message: error.message });
    }
}

// GET — PesaPal sometimes does a GET to verify the IPN endpoint
export async function GET() {
    return NextResponse.json({ status: '200', message: 'Build Smart Ke PesaPal IPN endpoint active' });
}
