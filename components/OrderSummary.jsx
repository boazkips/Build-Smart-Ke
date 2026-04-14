import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
    { id: 'mpesa',    label: 'M-Pesa',           icon: '📱', desc: 'Lipa Na M-Pesa STK Push' },
    { id: 'pesapal',  label: 'PesaPal',           icon: '💳', desc: 'Card, M-Pesa & more via PesaPal' },
    { id: 'cod',      label: 'Cash on Delivery',  icon: '💵', desc: 'Pay when delivered to site' },
];

const OrderSummary = () => {
    const { currency, router, getCartCount, getCartAmount, getToken, user, cartItems, setCartItems } = useAppContext()
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userAddresses, setUserAddresses] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUserAddresses = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/user/get-address', { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
                setUserAddresses(data.addresses)
                if (data.addresses.length > 0) setSelectedAddress(data.addresses[0])
            } else { toast.error(data.message) }
        } catch (err) { toast.error(err.message) }
    }

    const createOrder = async () => {
        if (!user) return toast('Please login to place order', { icon: '⚠️' })
        if (!selectedAddress) return toast.error('Please select a delivery address')

        let cartItemsArray = Object.keys(cartItems)
            .map(key => ({ product: key, quantity: cartItems[key] }))
            .filter(item => item.quantity > 0)

        if (cartItemsArray.length === 0) return toast.error('Your cart is empty')

        if (paymentMethod === 'mpesa' && !mpesaPhone.trim()) {
            return toast.error('Please enter your M-Pesa phone number')
        }

        setLoading(true)
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/order/create', {
                address: selectedAddress._id,
                items: cartItemsArray,
                paymentMethod,
            }, { headers: { Authorization: `Bearer ${token}` } })

            if (!data.success) { toast.error(data.message); setLoading(false); return }

            // Handle payment method
            if (paymentMethod === 'mpesa') {
                const totalAmount = getCartAmount() + Math.floor(getCartAmount() * 0.02)
                const mpesaRes = await axios.post('/api/payment/mpesa', {
                    orderId: data.orderId,
                    phone: mpesaPhone,
                    amount: totalAmount,
                }, { headers: { Authorization: `Bearer ${token}` } })

                if (mpesaRes.data.success) {
                    toast.success(mpesaRes.data.message)
                } else {
                    toast.error(mpesaRes.data.message || 'M-Pesa request failed')
                }
            } else if (paymentMethod === 'pesapal') {
                const pesapalRes = await axios.post('/api/payment/pesapal', {
                    orderId: data.orderId,
                    amount: getCartAmount() + Math.floor(getCartAmount() * 0.02),
                    description: `Build Smart Ke Order #${data.orderId?.slice(-8)}`,
                }, { headers: { Authorization: `Bearer ${token}` } })

                if (pesapalRes.data.success && pesapalRes.data.redirectUrl) {
                    toast.success('Redirecting to PesaPal...')
                    window.location.href = pesapalRes.data.redirectUrl
                    return
                } else {
                    toast.error(pesapalRes.data.message || 'PesaPal initiation failed')
                    setLoading(false)
                    return
                }
            } else {
                toast.success('Order placed! Pay on delivery.')
            }

            setCartItems({})
            router.push('/order-placed')
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { if (user) fetchUserAddresses() }, [user])

    const subtotal = getCartAmount()
    const tax = Math.floor(subtotal * 0.02)
    const total = subtotal + tax

    return (
        <div className="w-full md:w-[380px] shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-5">
                <h2 className="text-lg font-semibold text-[#1e3a5f]">Order Summary</h2>

                {/* Address select */}
                <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-2">Delivery Address</label>
                    <div className="relative border border-gray-200 rounded-lg">
                        <button
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 flex justify-between items-center"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <span className="truncate">
                                {selectedAddress
                                    ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}`
                                    : 'Select address'}
                            </span>
                            <span className="ml-2 text-gray-400">{isDropdownOpen ? '▲' : '▼'}</span>
                        </button>
                        {isDropdownOpen && (
                            <ul className="absolute w-full bg-white border border-gray-200 shadow-md rounded-b-lg z-10">
                                {userAddresses.map((addr, i) => (
                                    <li key={i}
                                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                        onClick={() => { setSelectedAddress(addr); setIsDropdownOpen(false) }}>
                                        {addr.fullName}, {addr.area}, {addr.city}
                                    </li>
                                ))}
                                <li onClick={() => router.push('/add-address')}
                                    className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-center text-sm text-orange-500 font-medium">
                                    + Add New Address
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Payment method */}
                <div>
                    <label className="text-xs font-semibold uppercase text-gray-500 block mb-2">Payment Method</label>
                    <div className="space-y-2">
                        {PAYMENT_METHODS.map(method => (
                            <label key={method.id}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                    paymentMethod === method.id
                                        ? 'border-[#1e3a5f] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input type="radio" name="payment" value={method.id}
                                    checked={paymentMethod === method.id}
                                    onChange={() => setPaymentMethod(method.id)}
                                    className="accent-[#1e3a5f]" />
                                <span className="text-lg">{method.icon}</span>
                                <div>
                                    <p className="text-sm font-medium">{method.label}</p>
                                    <p className="text-xs text-gray-400">{method.desc}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    {paymentMethod === 'mpesa' && (
                        <div className="mt-3">
                            <label className="text-xs text-gray-600 font-medium">M-Pesa Phone Number</label>
                            <input
                                type="tel"
                                value={mpesaPhone}
                                onChange={e => setMpesaPhone(e.target.value)}
                                placeholder="+254 7XX XXX XXX"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]"
                            />
                            <p className="text-xs text-gray-400 mt-1">You will receive an STK push on this number</p>
                        </div>
                    )}
                </div>

                <hr className="border-gray-100" />

                {/* Price breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal ({getCartCount()} items)</span>
                        <span>{currency}{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Delivery</span>
                        <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>VAT (2%)</span>
                        <span>{currency}{tax}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base text-[#1e3a5f] pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span>{currency}{total}</span>
                    </div>
                </div>

                <button
                    onClick={createOrder}
                    disabled={loading}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-lg transition text-sm"
                >
                    {loading ? 'Processing...' : `Place Order · ${currency}${total}`}
                </button>

                <p className="text-xs text-gray-400 text-center">
                    🔒 Secure checkout · Verified suppliers · Kenya-based support
                </p>
            </div>
        </div>
    );
};

export default OrderSummary;
