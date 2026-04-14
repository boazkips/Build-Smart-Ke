import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: "user" },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: Array, required: true },
    category: { type: String, required: true },
    // Construction-specific fields
    unit: { type: String, default: 'piece' },          // bag, tonne, m², piece, litre, roll, sheet
    stock: { type: Number, default: 0 },
    brand: { type: String, default: '' },
    minimumOrderQty: { type: Number, default: 1 },
    leadTimeDays: { type: Number, default: 1 },
    specifications: { type: Map, of: String, default: {} },
    comparisonGroupId: { type: String, default: '' },   // links same product across suppliers
    date: { type: Number, required: true }
})

const Product = mongoose.models.product || mongoose.model('product', productSchema)

export default Product
