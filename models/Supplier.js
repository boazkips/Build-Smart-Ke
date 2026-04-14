import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
    _id: { type: String, required: true },              // Clerk userId
    companyName: { type: String, required: true },
    kraPin: { type: String, required: true },
    registrationCert: { type: String, default: '' },    // Cloudinary URL
    businessLicense: { type: String, default: '' },     // Cloudinary URL
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    physicalAddress: { type: String, default: '' },
    city: { type: String, default: '' },
    county: { type: String, default: '' },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    rejectionReason: { type: String, default: '' },
    isAnchorTenant: { type: Boolean, default: false },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    kpiScore: { type: Number, default: 0 },             // computed from delivery rate, returns, etc.
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    categories: { type: [String], default: [] },        // product categories they supply
    joinDate: { type: Number, default: Date.now }
}, { minimize: false })

const Supplier = mongoose.models.supplier || mongoose.model('supplier', supplierSchema)

export default Supplier
