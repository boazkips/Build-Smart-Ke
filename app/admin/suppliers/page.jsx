'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const SuppliersAdmin = () => {
    const { getToken, user } = useAppContext()
    const [suppliers, setSuppliers] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [actionLoading, setActionLoading] = useState({})

    const fetchSuppliers = async () => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/admin/suppliers', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) { setSuppliers(data.suppliers); setLoading(false) }
            else { toast.error(data.message); setLoading(false) }
        } catch (err) { toast.error(err.message); setLoading(false) }
    }

    const updateStatus = async (supplierId, status, reason = '') => {
        setActionLoading(prev => ({ ...prev, [supplierId]: true }))
        try {
            const token = await getToken()
            const { data } = await axios.patch('/api/admin/suppliers', {
                supplierId, status, rejectionReason: reason
            }, { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                toast.success(`Supplier ${status}`)
                setSuppliers(prev => prev.map(s =>
                    s._id === supplierId ? { ...s, verificationStatus: status } : s
                ))
            } else {
                toast.error(data.message)
            }
        } catch (err) { toast.error(err.message) }
        finally { setActionLoading(prev => ({ ...prev, [supplierId]: false })) }
    }

    const handleReject = async (supplierId) => {
        const reason = window.prompt('Enter rejection reason (sent to supplier):')
        if (reason !== null) await updateStatus(supplierId, 'rejected', reason)
    }

    useEffect(() => { if (user) fetchSuppliers() }, [user])

    const filtered = filter === 'all' ? suppliers : suppliers.filter(s => s.verificationStatus === filter)

    const badge = (status) => {
        if (status === 'verified') return 'bg-green-100 text-green-700'
        if (status === 'rejected') return 'bg-red-100 text-red-600'
        return 'bg-amber-100 text-amber-700'
    }

    if (loading) return <Loading />

    return (
        <div className="flex-1 p-4 md:p-8">
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#1e3a5f]">Supplier Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Verify supplier applications and manage accounts</p>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'verified', 'rejected'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`text-xs px-3 py-1.5 rounded-full capitalize transition ${
                                filter === f ? 'bg-[#1e3a5f] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}>
                            {f} {f !== 'all' && `(${suppliers.filter(s => s.verificationStatus === f).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm">
                    <p className="text-4xl mb-2">🏢</p>
                    <p className="text-sm">No {filter === 'all' ? '' : filter} supplier applications</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(supplier => (
                        <div key={supplier._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="font-semibold text-gray-800">{supplier.companyName}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${badge(supplier.verificationStatus)}`}>
                                            {supplier.verificationStatus}
                                        </span>
                                        {supplier.isAnchorTenant && (
                                            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                                Anchor Tenant
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500">
                                        <span>📍 {supplier.county}</span>
                                        <span>📞 {supplier.phoneNumber}</span>
                                        <span>✉️ {supplier.email}</span>
                                        <span>🪪 KRA: {supplier.kraPin}</span>
                                    </div>
                                    {supplier.categories?.length > 0 && (
                                        <div className="flex gap-1 flex-wrap mt-2">
                                            {supplier.categories.map(cat => (
                                                <span key={cat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {supplier.verificationStatus === 'rejected' && supplier.rejectionReason && (
                                        <p className="text-xs text-red-500 mt-2">
                                            Rejection reason: {supplier.rejectionReason}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0 flex-wrap">
                                    {/* Document links */}
                                    {supplier.registrationCert && (
                                        <a href={supplier.registrationCert} target="_blank" rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition">
                                            Reg. Cert
                                        </a>
                                    )}
                                    {supplier.businessLicense && (
                                        <a href={supplier.businessLicense} target="_blank" rel="noopener noreferrer"
                                            className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 transition">
                                            License
                                        </a>
                                    )}
                                    {/* Actions */}
                                    {supplier.verificationStatus !== 'verified' && (
                                        <button
                                            onClick={() => updateStatus(supplier._id, 'verified')}
                                            disabled={actionLoading[supplier._id]}
                                            className="text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition disabled:opacity-60"
                                        >
                                            {actionLoading[supplier._id] ? '...' : 'Verify'}
                                        </button>
                                    )}
                                    {supplier.verificationStatus !== 'rejected' && (
                                        <button
                                            onClick={() => handleReject(supplier._id)}
                                            disabled={actionLoading[supplier._id]}
                                            className="text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition disabled:opacity-60"
                                        >
                                            Reject
                                        </button>
                                    )}
                                    {!supplier.isAnchorTenant && supplier.verificationStatus === 'verified' && (
                                        <button
                                            onClick={() => updateStatus(supplier._id, 'verified')}
                                            className="text-xs px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded hover:bg-purple-100 transition"
                                        >
                                            Mark Anchor
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default SuppliersAdmin
