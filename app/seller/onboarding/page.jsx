'use client'
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const COUNTIES = [
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika',
    'Malindi', 'Kitale', 'Garissa', 'Kakamega', 'Nyeri', 'Meru',
    'Machakos', 'Kericho', 'Embu', 'Other'
];

const CATEGORIES = [
    'Cement', 'Steel', 'Roofing', 'Tiles', 'Plumbing',
    'Timber', 'Electrical', 'Tools', 'Paint', 'Accessories'
];

const SupplierOnboarding = () => {
    const { getToken, user, router } = useAppContext()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        companyName: '',
        kraPin: '',
        phoneNumber: '',
        email: '',
        physicalAddress: '',
        city: '',
        county: 'Nairobi',
        categories: [],
        registrationCert: null,
        businessLicense: null,
    })

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))
    const setFile = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.files[0] }))
    const toggleCategory = (cat) => setForm(prev => ({
        ...prev,
        categories: prev.categories.includes(cat)
            ? prev.categories.filter(c => c !== cat)
            : [...prev.categories, cat]
    }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!user) return toast.error('Please sign in first')
        if (form.categories.length === 0) return toast.error('Select at least one product category')

        setLoading(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => {
                if (k === 'categories') fd.append(k, JSON.stringify(v))
                else if (v instanceof File) fd.append(k, v)
                else if (v) fd.append(k, v)
            })

            const token = await getToken()
            const { data } = await axios.post('/api/supplier/register', fd, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success('Application submitted! We will verify within 2–3 business days.')
                setStep(4)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (step === 4) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="bg-white rounded-xl shadow-sm p-10 max-w-md text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Application Submitted!</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Thank you for applying to be a Build Smart Ke supplier. Our team will verify your documents within <strong>2–3 business days</strong> and notify you via email.
                    </p>
                    <div className="mt-6 space-y-2">
                        <button onClick={() => router.push('/seller')}
                            className="w-full py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium">
                            Go to Supplier Portal
                        </button>
                        <button onClick={() => router.push('/')}
                            className="w-full py-2.5 border border-gray-300 text-gray-600 rounded-lg text-sm">
                            Back to Store
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-6 md:p-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-[#1e3a5f]">Become a Build Smart Ke Supplier</h1>
                    <p className="text-gray-500 text-sm mt-1">Complete your supplier profile to start selling construction materials</p>

                    {/* Progress */}
                    <div className="flex items-center gap-2 mt-5">
                        {[1, 2, 3].map(s => (
                            <React.Fragment key={s}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
                                    step >= s ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
                                }`}>{s}</div>
                                {s < 3 && <div className={`flex-1 h-1 rounded transition ${step > s ? 'bg-[#1e3a5f]' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                        ))}
                        <span className="text-xs text-gray-500 ml-2">Step {step} of 3</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                    {step === 1 && (
                        <>
                            <h2 className="font-semibold text-gray-800">Company Information</h2>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Company Name *</label>
                                <input value={form.companyName} onChange={set('companyName')} required
                                    placeholder="e.g. Nairobi Steel Suppliers Ltd"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">KRA PIN *</label>
                                <input value={form.kraPin} onChange={set('kraPin')} required
                                    placeholder="e.g. P000000000A"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                                    <input value={form.phoneNumber} onChange={set('phoneNumber')} required
                                        placeholder="+254 7XX XXX XXX"
                                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Business Email *</label>
                                    <input value={form.email} onChange={set('email')} required type="email"
                                        placeholder="company@example.com"
                                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Physical Address *</label>
                                <input value={form.physicalAddress} onChange={set('physicalAddress')} required
                                    placeholder="Street, building, floor"
                                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">City/Town *</label>
                                    <input value={form.city} onChange={set('city')} required placeholder="e.g. Nairobi"
                                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">County *</label>
                                    <select value={form.county} onChange={set('county')} required
                                        className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]">
                                        {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="button" onClick={() => setStep(2)}
                                className="w-full py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#122640] transition">
                                Continue →
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="font-semibold text-gray-800">Product Categories</h2>
                            <p className="text-sm text-gray-500">Select all categories you supply</p>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES.map(cat => (
                                    <label key={cat} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                                        form.categories.includes(cat)
                                            ? 'border-[#1e3a5f] bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}>
                                        <input type="checkbox" className="accent-[#1e3a5f]"
                                            checked={form.categories.includes(cat)}
                                            onChange={() => toggleCategory(cat)} />
                                        <span className="text-sm font-medium">{cat}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition">
                                    ← Back
                                </button>
                                <button type="button" onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#122640] transition">
                                    Continue →
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="font-semibold text-gray-800">Verification Documents</h2>
                            <p className="text-sm text-gray-500">Upload official documents for supplier verification</p>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Business Registration Certificate *
                                </label>
                                <p className="text-xs text-gray-400 mb-2">PDF or image, max 5MB</p>
                                <input type="file" accept=".pdf,image/*" onChange={setFile('registrationCert')} required
                                    className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 file:mr-3 file:text-xs file:bg-[#1e3a5f] file:text-white file:px-3 file:py-1 file:rounded file:border-none file:cursor-pointer" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    Business Permit / Trading License
                                </label>
                                <p className="text-xs text-gray-400 mb-2">PDF or image, max 5MB</p>
                                <input type="file" accept=".pdf,image/*" onChange={setFile('businessLicense')}
                                    className="w-full border border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 file:mr-3 file:text-xs file:bg-gray-600 file:text-white file:px-3 file:py-1 file:rounded file:border-none file:cursor-pointer" />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                                <strong>Note:</strong> Our team will review your application within 2–3 business days. You will receive an email once verified. Only verified suppliers can list products.
                            </div>

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(2)}
                                    className="flex-1 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition">
                                    ← Back
                                </button>
                                <button type="submit" disabled={loading}
                                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white rounded-lg font-medium transition">
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    )
}

export default SupplierOnboarding
