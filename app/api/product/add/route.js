import { v2 as cloudinary } from "cloudinary";
import { getAuth } from '@clerk/nextjs/server'
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const isSeller = await authSeller(userId)

        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' })
        }

        const formData = await request.formData()

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        // Construction-specific fields
        const unit = formData.get('unit') || 'piece';
        const stock = formData.get('stock') || 0;
        const brand = formData.get('brand') || '';
        const minimumOrderQty = formData.get('minimumOrderQty') || 1;
        const leadTimeDays = formData.get('leadTimeDays') || 1;
        const specificationsRaw = formData.get('specifications') || '{}';

        let specifications = {};
        try { specifications = JSON.parse(specificationsRaw) } catch (_) {}

        const files = formData.getAll('images').filter(Boolean);
        if (!files || files.length === 0) {
            return NextResponse.json({ success: false, message: 'At least one image is required' })
        }

        const uploadResults = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto', folder: 'buildsmart-products' },
                        (error, result) => error ? reject(error) : resolve(result)
                    )
                    stream.end(buffer)
                })
            })
        )

        const image = uploadResults.map(r => r.secure_url)

        await connectDB()
        const newProduct = await Product.create({
            userId,
            name, description, category,
            price: Number(price),
            offerPrice: Number(offerPrice),
            image,
            unit,
            stock: Number(stock),
            brand,
            minimumOrderQty: Number(minimumOrderQty),
            leadTimeDays: Number(leadTimeDays),
            specifications,
            date: Date.now()
        })

        return NextResponse.json({ success: true, message: 'Product listed successfully', newProduct })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}
