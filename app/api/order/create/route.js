import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address, items, paymentMethod = 'cod' } = await request.json();

        if (!address || !items || items.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid order data' });
        }

        await connectDB()

        // Calculate total from DB prices (don't trust client-side amounts)
        const amount = await items.reduce(async (accPromise, item) => {
            const acc = await accPromise
            const product = await Product.findById(item.product);
            if (!product) return acc
            return acc + product.offerPrice * item.quantity;
        }, Promise.resolve(0))

        const finalAmount = amount + Math.floor(amount * 0.02) // 2% VAT

        // Dispatch order creation event to Inngest
        const result = await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: finalAmount,
                paymentMethod,
                date: Date.now()
            }
        })

        // Clear user cart
        const user = await User.findById(userId)
        if (user) { user.cartItems = {}; await user.save() }

        return NextResponse.json({
            success: true,
            message: 'Order created',
            orderId: result?.ids?.[0] || 'pending'
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}
