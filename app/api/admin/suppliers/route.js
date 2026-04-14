import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/lib/authAdmin";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Supplier from "@/models/Supplier";

// GET — list all suppliers (admin only)
export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) return NextResponse.json({ success: false, message: 'Not authorized' })

        await connectDB()
        const suppliers = await Supplier.find({}).sort({ joinDate: -1 })
        return NextResponse.json({ success: true, suppliers })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}

// PATCH — update supplier verification status (admin only)
export async function PATCH(request) {
    try {
        const { userId } = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if (!isAdmin) return NextResponse.json({ success: false, message: 'Not authorized' })

        const { supplierId, status, rejectionReason, isAnchorTenant } = await request.json()

        await connectDB()
        const update = { verificationStatus: status }
        if (rejectionReason) update.rejectionReason = rejectionReason
        if (isAnchorTenant !== undefined) update.isAnchorTenant = isAnchorTenant

        await Supplier.findByIdAndUpdate(supplierId, update)
        return NextResponse.json({ success: true, message: `Supplier ${status}` })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message })
    }
}
