import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Supplier from "@/models/Supplier";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFile = (buffer) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'buildsmart-supplier-docs' },
        (error, result) => error ? reject(error) : resolve(result)
    )
    stream.end(buffer)
})

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        if (!userId) return NextResponse.json({ success: false, message: 'Not authenticated' })

        const formData = await request.formData()

        const companyName = formData.get('companyName')
        const kraPin = formData.get('kraPin')
        const phoneNumber = formData.get('phoneNumber')
        const email = formData.get('email')
        const physicalAddress = formData.get('physicalAddress')
        const city = formData.get('city')
        const county = formData.get('county')
        const categoriesRaw = formData.get('categories') || '[]'
        let categories = []
        try { categories = JSON.parse(categoriesRaw) } catch (_) {}

        await connectDB()

        // Check if already registered
        const existing = await Supplier.findById(userId)
        if (existing) {
            return NextResponse.json({ success: false, message: 'Supplier application already submitted' })
        }

        // Upload documents to Cloudinary
        let registrationCertUrl = ''
        let businessLicenseUrl = ''

        const certFile = formData.get('registrationCert')
        if (certFile && certFile.size > 0) {
            const buf = Buffer.from(await certFile.arrayBuffer())
            const result = await uploadFile(buf)
            registrationCertUrl = result.secure_url
        }

        const licenseFile = formData.get('businessLicense')
        if (licenseFile && licenseFile.size > 0) {
            const buf = Buffer.from(await licenseFile.arrayBuffer())
            const result = await uploadFile(buf)
            businessLicenseUrl = result.secure_url
        }

        await Supplier.create({
            _id: userId,
            companyName, kraPin, phoneNumber, email,
            physicalAddress, city, county, categories,
            registrationCert: registrationCertUrl,
            businessLicense: businessLicenseUrl,
            verificationStatus: 'pending',
            joinDate: Date.now()
        })

        return NextResponse.json({ success: true, message: 'Application submitted successfully' })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, message: error.message })
    }
}
