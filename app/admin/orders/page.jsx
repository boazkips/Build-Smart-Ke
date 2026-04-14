'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const AdminOrders = () => {
    const { getToken, user, currency } = useAppContext()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const fetchOrders = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/order/seller-orders', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) { setOrders(data.orders); setLoading(false) }
            else toast.error(data.message)
        } catch (err) { toast.error(err.message); setLoading(false) }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = await getToken()
            const { data } = await axios.patch('/api/order/update-status', { orderId, status }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success('Status updated')
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
            } else toast.error(data.message)
        } catch (err) { toast.error(err.message) }
    }

    useEffect(() => { if (user) fetchOrders() }, [user])

    const statuses = ['Order Placed', 'Processing', 'Dispatched', 'Delivered', 'Cancelled']
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

    const statusColor = (s) => {
        if (s === 'Delivered') return 'bg-green-100 text-green-700'
        if (s === 'Cancelled') return 'bg-red-100 text-red-600'
        if (s === 'Dispatched') return 'bg-blue-100 text-blue-700'
        if (s === 'Processing') return 'bg-purple-100 text-purple-700'
        return 'bg-amber-100 text-amber-700'
    }

    const paymentColor = (s) => {
        if (s === 'paid') return 'bg-green-100 text-green-700'
        if (s === 'failed') return 'bg-red-100 text-red-600'
        return 'bg-gray-100 text-gray-500'
    }

    if (loading) return <Loading />

    return (
        <div className="flex-1 p-4 md:p-8">
            <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-bold text-[#1e3a5f]">Order Management</h1>
                    <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setFilter('all')}
                        className={`text-xs px-3 py-1.5 rounded-full transition ${filter === 'all' ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                        All ({orders.length})
                    </button>
                    {statuses.map(s => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`text-xs px-3 py-1.5 rounded-full transition ${filter === s ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                            {s} ({orders.filter(o => o.status === s).length})
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm">
                    <p className="text-4xl mb-2">🛒</p>
                    <p className="text-sm">No orders found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Order ID</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Customer</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Items</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Amount</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Payment</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4 font-mono text-xs text-gray-500">
                                            #{order._id?.slice(-8)}
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <p className="font-medium text-gray-800">{order.address?.fullName}</p>
                                            <p className="text-xs text-gray-400">{order.address?.city}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="text-gray-700 max-w-[180px] truncate">
                                                {order.items?.map(i => i.product?.name || 'Product').join(', ')}
                                            </p>
                                            <p className="text-xs text-gray-400">{order.items?.length} item(s)</p>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-[#1e3a5f]">
                                            {currency}{order.amount}
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${paymentColor(order.paymentStatus)}`}>
                                                {order.paymentStatus || 'pending'}
                                            </span>
                                            {order.paymentMethod && (
                                                <p className="text-xs text-gray-400 mt-0.5 capitalize">{order.paymentMethod}</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={e => updateOrderStatus(order._id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-full border-0 font-medium outline-none cursor-pointer ${statusColor(order.status)}`}
                                            >
                                                {statuses.map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-gray-400">
                                            {new Date(order.date).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminOrders
