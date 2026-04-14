import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/lib/authAdmin";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import Supplier from "@/models/Supplier";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) return NextResponse.json({ success: false, message: 'Not authorized' })

        await connectDB()

        const [orders, products, users, suppliers, pendingSuppliers] = await Promise.all([
            Order.find({}).sort({ date: -1 }).limit(10).populate('address'),
            Product.countDocuments(),
            User.countDocuments(),
            Supplier.countDocuments({ verificationStatus: 'verified' }),
            Supplier.countDocuments({ verificationStatus: 'pending' }),
        ])

        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0)

        return NextResponse.json({
            success: true,
            stats: {
                totalOrders: await Order.countDocuments(),
                totalRevenue,
                totalProducts: products,
                totalSuppliers: suppliers,
                pendingVerification: pendingSuppliers,
                totalUsers: users,
                recentOrders: orders.slice(0, 8)
            }
        })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
