import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

export async function PATCH(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' })
        }

        const { productId, stock } = await request.json()

        await connectDB()
        const product = await Product.findOne({ _id: productId, userId })

        if (!product) {
            return NextResponse.json({ success: false, message: 'Product not found' })
        }

        product.stock = Number(stock)
        await product.save()

        return NextResponse.json({ success: true, message: 'Stock updated' })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
