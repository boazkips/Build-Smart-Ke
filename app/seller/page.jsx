'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const CATEGORIES = [
    'Cement', 'Steel', 'Roofing', 'Tiles', 'Plumbing',
    'Timber', 'Electrical', 'Tools', 'Paint', 'Accessories'
];

const UNITS = [
    { value: 'bag', label: 'Bag' },
    { value: 'tonne', label: 'Tonne' },
    { value: 'm²', label: 'Square Metre (m²)' },
    { value: 'piece', label: 'Piece' },
    { value: 'litre', label: 'Litre' },
    { value: 'roll', label: 'Roll' },
    { value: 'sheet', label: 'Sheet' },
    { value: 'kg', label: 'Kilogram (kg)' },
    { value: 'metre', label: 'Metre (m)' },
    { value: 'tin', label: 'Tin' },
];

const AddProduct = () => {
    const { getToken } = useAppContext()

    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Cement');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [unit, setUnit] = useState('bag');
    const [stock, setStock] = useState('');
    const [brand, setBrand] = useState('');
    const [minimumOrderQty, setMinimumOrderQty] = useState('1');
    const [leadTimeDays, setLeadTimeDays] = useState('1');
    const [specKey, setSpecKey] = useState('');
    const [specVal, setSpecVal] = useState('');
    const [specifications, setSpecifications] = useState({});

    const addSpec = () => {
        if (specKey.trim() && specVal.trim()) {
            setSpecifications(prev => ({ ...prev, [specKey.trim()]: specVal.trim() }));
            setSpecKey(''); setSpecVal('');
        }
    };

    const removeSpec = (key) => {
        setSpecifications(prev => { const n = { ...prev }; delete n[key]; return n; });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('price', price)
        formData.append('offerPrice', offerPrice)
        formData.append('unit', unit)
        formData.append('stock', stock)
        formData.append('brand', brand)
        formData.append('minimumOrderQty', minimumOrderQty)
        formData.append('leadTimeDays', leadTimeDays)
        formData.append('specifications', JSON.stringify(specifications))

        for (let i = 0; i < files.length; i++) {
            if (files[i]) formData.append('images', files[i])
        }

        try {
            const token = await getToken()
            const { data } = await axios.post('/api/product/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                toast.success(data.message)
                setFiles([]); setName(''); setDescription('');
                setCategory('Cement'); setPrice(''); setOfferPrice('');
                setUnit('bag'); setStock(''); setBrand('');
                setMinimumOrderQty('1'); setLeadTimeDays('1');
                setSpecifications({});
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message)
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            <div className="md:p-8 p-4 max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-xl font-semibold text-[#1e3a5f]">Add New Product</h1>
                    <p className="text-sm text-gray-500 mt-1">List a construction material for sale on Build Smart Ke</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                    {/* Images */}
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Product Images <span className="text-gray-400">(up to 4)</span></p>
                        <div className="flex flex-wrap gap-3">
                            {[...Array(4)].map((_, index) => (
                                <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                                    <input
                                        onChange={(e) => {
                                            const updated = [...files];
                                            updated[index] = e.target.files[0];
                                            setFiles(updated);
                                        }}
                                        type="file" id={`image${index}`} accept="image/*" hidden
                                    />
                                    <div className={`w-24 h-24 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden ${
                                        files[index] ? 'border-[#1e3a5f]' : 'border-gray-300 hover:border-gray-400'
                                    }`}>
                                        {files[index] ? (
                                            <Image src={URL.createObjectURL(files[index])} alt="" width={96} height={96} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-2xl">+</span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Basic info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-sm font-medium text-gray-700">Product Name *</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                placeholder="e.g. Bamburi OPC Cement 50kg"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Brand</label>
                            <input type="text" value={brand} onChange={e => setBrand(e.target.value)}
                                placeholder="e.g. Bamburi, Mombasa Cement"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} required
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Product Description *</label>
                        <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} required
                            placeholder="Describe the product — grade, standards, usage..."
                            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-[#1e3a5f]" />
                    </div>

                    {/* Pricing & unit */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Unit *</label>
                            <select value={unit} onChange={e => setUnit(e.target.value)} required
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]">
                                {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Price (KES) *</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0"
                                placeholder="0"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Offer Price (KES) *</label>
                            <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} required min="0"
                                placeholder="0"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Stock Qty *</label>
                            <input type="number" value={stock} onChange={e => setStock(e.target.value)} required min="0"
                                placeholder="0"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Min. Order Qty *</label>
                            <input type="number" value={minimumOrderQty} onChange={e => setMinimumOrderQty(e.target.value)} required min="1"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Lead Time (days) *</label>
                            <input type="number" value={leadTimeDays} onChange={e => setLeadTimeDays(e.target.value)} required min="1"
                                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
                        </div>
                    </div>

                    {/* Specifications */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Specifications</label>
                        <p className="text-xs text-gray-400 mb-2">Add technical specs, e.g. Grade → 42.5N, Thickness → 3mm</p>
                        <div className="flex gap-2 mb-3">
                            <input value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="Property"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]" />
                            <input value={specVal} onChange={e => setSpecVal(e.target.value)} placeholder="Value"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1e3a5f]" />
                            <button type="button" onClick={addSpec}
                                className="px-4 py-2 bg-[#1e3a5f] text-white text-sm rounded-lg hover:bg-[#122640] transition">
                                Add
                            </button>
                        </div>
                        {Object.keys(specifications).length > 0 && (
                            <div className="space-y-1">
                                {Object.entries(specifications).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between bg-gray-50 rounded px-3 py-1.5 text-sm">
                                        <span><strong>{k}:</strong> {v}</span>
                                        <button type="button" onClick={() => removeSpec(k)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit"
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
                        List Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
