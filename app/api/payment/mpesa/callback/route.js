import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";

// POST /api/payment/mpesa/callback — Safaricom sends payment result here
export async function POST(request) {
    try {
        const body = await request.json();
        const callback = body?.Body?.stkCallback;

        if (!callback) {
            return NextResponse.json({ success: false, message: 'Invalid callback payload' });
        }

        const { CheckoutRequestID, ResultCode, ResultDesc } = callback;
        await connectDB();

        if (ResultCode === 0) {
            // Payment successful — extract M-Pesa transaction ID
            const mpesaCode = callback.CallbackMetadata?.Item?.find(i => i.Name === 'MpesaReceiptNumber')?.Value || '';
            await Order.findOneAndUpdate(
                { paymentRef: CheckoutRequestID },
                { paymentStatus: 'paid', paymentRef: mpesaCode }
            );
        } else {
            // Payment failed or cancelled
            await Order.findOneAndUpdate(
                { paymentRef: CheckoutRequestID },
                { paymentStatus: 'failed' }
            );
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    } catch (error) {
        console.error('M-Pesa callback error:', error.message);
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Error' });
    }
}
