'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import Footer from "@/components/seller/Footer";

const StockManagement = () => {
    const { getToken, user, currency } = useAppContext()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState({})

    const fetchProducts = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/product/seller-list', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) { setProducts(data.products); setLoading(false) }
            else toast.error(data.message)
        } catch (err) { toast.error(err.message) }
    }

    const updateStock = async (productId, newStock) => {
        setUpdating(prev => ({ ...prev, [productId]: true }))
        try {
            const token = await getToken()
            const { data } = await axios.patch('/api/product/update-stock', {
                productId, stock: Number(newStock)
            }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setProducts(prev => prev.map(p => p._id === productId ? { ...p, stock: Number(newStock) } : p))
                toast.success('Stock updated')
            } else {
                toast.error(data.message)
            }
        } catch (err) { toast.error(err.message) }
        finally { setUpdating(prev => ({ ...prev, [productId]: false })) }
    }

    useEffect(() => { if (user) fetchProducts() }, [user])

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between bg-gray-50">
            {loading ? <Loading /> : (
                <div className="p-4 md:p-8">
                    <div className="mb-6">
                        <h1 className="text-xl font-semibold text-[#1e3a5f]">Stock Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Update your product stock levels in real time</p>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500">Total Products</p>
                            <p className="text-2xl font-bold text-[#1e3a5f] mt-1">{products.length}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500">In Stock</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {products.filter(p => (p.stock || 0) > 0).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                            <p className="text-xs text-gray-500">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-500 mt-1">
                                {products.filter(p => (p.stock || 0) === 0).length}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Product</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Unit</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Price</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Stock Qty</th>
                                    <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map(product => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800 truncate max-w-[180px]">{product.name}</p>
                                            {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell text-gray-500">{product.category}</td>
                                        <td className="px-5 py-4 hidden md:table-cell text-gray-500">{product.unit || 'unit'}</td>
                                        <td className="px-5 py-4 font-medium text-[#1e3a5f]">{currency}{product.offerPrice}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    defaultValue={product.stock || 0}
                                                    min="0"
                                                    onBlur={(e) => {
                                                        const val = Number(e.target.value)
                                                        if (val !== (product.stock || 0)) updateStock(product._id, val)
                                                    }}
                                                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-[#1e3a5f]"
                                                />
                                                {updating[product._id] && (
                                                    <span className="text-xs text-gray-400">saving...</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                (product.stock || 0) > 10
                                                    ? 'bg-green-100 text-green-700'
                                                    : (product.stock || 0) > 0
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-red-100 text-red-600'
                                            }`}>
                                                {(product.stock || 0) > 10 ? 'In Stock' : (product.stock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    )
}

export default StockManagement
