'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const StatCard = ({ label, value, icon, color, sub }) => (
    <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
                {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
            </div>
            <span className="text-3xl">{icon}</span>
        </div>
    </div>
)

const AdminOverview = () => {
    const { getToken, user, currency } = useAppContext()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/stats', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) { setStats(data.stats); setLoading(false) }
            else toast.error(data.message)
        } catch (err) {
            // Show demo data if API not ready
            setStats({
                totalOrders: 0, totalRevenue: 0, totalProducts: 0,
                totalSuppliers: 0, pendingVerification: 0, totalUsers: 0,
                recentOrders: []
            })
            setLoading(false)
        }
    }

    useEffect(() => { if (user) fetchStats() }, [user])

    if (loading) return <Loading />

    return (
        <div className="flex-1 p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1e3a5f]">Admin Overview</h1>
                <p className="text-sm text-gray-500 mt-1">Build Smart Ke platform metrics</p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <StatCard label="Total Orders" value={stats.totalOrders} icon="🛒" color="text-[#1e3a5f]" sub="All time" />
                <StatCard label="Revenue (KES)" value={`${currency}${(stats.totalRevenue || 0).toLocaleString()}`} icon="💰" color="text-green-600" sub="All time" />
                <StatCard label="Products Listed" value={stats.totalProducts} icon="📦" color="text-blue-600" />
                <StatCard label="Verified Suppliers" value={stats.totalSuppliers} icon="🏢" color="text-purple-600" />
                <StatCard label="Pending Verification" value={stats.pendingVerification} icon="⏳" color="text-amber-600" sub="Requires action" />
                <StatCard label="Registered Users" value={stats.totalUsers} icon="👥" color="text-gray-700" />
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-800">Recent Orders</h2>
                    <button
                        onClick={() => window.location.href = '/admin/orders'}
                        className="text-xs text-orange-600 hover:underline"
                    >
                        View All →
                    </button>
                </div>
                {stats.recentOrders?.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                        <p className="text-4xl mb-2">🛒</p>
                        <p className="text-sm">No orders yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {(stats.recentOrders || []).map((order, i) => (
                            <div key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                                <div>
                                    <p className="font-medium text-gray-800">Order #{order._id?.slice(-8)}</p>
                                    <p className="text-gray-400 text-xs">{new Date(order.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[#1e3a5f]">{currency}{order.amount}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        order.status === 'Order Placed' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                    }`}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminOverview
