import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: String, ref: 'address', required: true },
    status: { type: String, required: true, default: 'Order Placed' },
    // Payment fields
    paymentMethod: { type: String, enum: ['mpesa', 'paypal', 'cod'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    paymentRef: { type: String, default: '' },   // M-Pesa transaction ID or PayPal order ID
    date: { type: Number, required: true },
})

const Order = mongoose.models.order || mongoose.model('order', orderSchema)

export default Order
