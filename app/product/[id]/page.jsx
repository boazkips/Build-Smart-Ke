"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
    const { id } = useParams();
    const { products, currency, router, addToCart, user } = useAppContext()
    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const product = products.find(p => p._id === id);
        setProductData(product);
    }, [id, products.length])

    if (!productData) return <Loading />

    const discount = productData.price > productData.offerPrice
        ? Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)
        : 0;

    const specs = productData.specifications
        ? (productData.specifications instanceof Map
            ? Object.fromEntries(productData.specifications)
            : productData.specifications)
        : {};

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Breadcrumb */}
                <div className="px-6 md:px-16 lg:px-32 py-3 text-sm text-gray-500 flex gap-2">
                    <button onClick={() => router.push('/')} className="hover:text-[#1e3a5f]">Home</button>
                    <span>/</span>
                    <button onClick={() => router.push('/all-products')} className="hover:text-[#1e3a5f]">Products</button>
                    <span>/</span>
                    <button onClick={() => router.push(`/all-products?category=${productData.category}`)} className="hover:text-[#1e3a5f]">
                        {productData.category}
                    </button>
                    <span>/</span>
                    <span className="text-gray-700 truncate max-w-[200px]">{productData.name}</span>
                </div>

                <div className="px-6 md:px-16 lg:px-32 py-6 space-y-10">
                    {/* Main product section */}
                    <div className="bg-white rounded-xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-sm">
                        {/* Images */}
                        <div>
                            <div className="rounded-lg overflow-hidden bg-gray-100 mb-4 aspect-square flex items-center justify-center">
                                <Image
                                    src={mainImage || productData.image[0]}
                                    alt={productData.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                    width={600}
                                    height={600}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {productData.image.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setMainImage(img)}
                                        className={`cursor-pointer rounded-lg overflow-hidden bg-gray-100 border-2 transition ${
                                            (mainImage || productData.image[0]) === img
                                                ? 'border-[#1e3a5f]'
                                                : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <Image src={img} alt="" className="w-full h-auto object-contain mix-blend-multiply" width={200} height={200} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col gap-4">
                            {/* Category & verification */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="bg-blue-50 text-[#1e3a5f] text-xs font-medium px-3 py-1 rounded-full">
                                    {productData.category}
                                </span>
                                <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                                    ✅ Verified Supplier
                                </span>
                                {discount > 0 && (
                                    <span className="bg-red-50 text-red-600 text-xs font-medium px-3 py-1 rounded-full">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{productData.name}</h1>

                            {/* Brand */}
                            {productData.brand && (
                                <p className="text-sm text-gray-500">Brand: <span className="font-medium text-gray-700">{productData.brand}</span></p>
                            )}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Image key={i} className="h-4 w-4" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">(4.0) · 24 reviews</span>
                            </div>

                            {/* Price */}
                            <div className="flex items-end gap-3 border-t border-b border-gray-100 py-4">
                                <p className="text-3xl font-bold text-[#1e3a5f]">
                                    {currency}{productData.offerPrice}
                                </p>
                                {productData.unit && (
                                    <span className="text-gray-400 text-sm mb-1">per {productData.unit}</span>
                                )}
                                {productData.price > productData.offerPrice && (
                                    <p className="text-gray-400 line-through text-lg mb-0.5">{currency}{productData.price}</p>
                                )}
                            </div>

                            {/* Key info grid */}
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 text-xs">Availability</p>
                                    <p className={`font-medium mt-0.5 ${productData.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        {productData.stock > 0 ? `In Stock (${productData.stock} ${productData.unit || 'units'})` : 'Out of Stock'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 text-xs">Lead Time</p>
                                    <p className="font-medium text-gray-700 mt-0.5">
                                        {productData.leadTimeDays ? `${productData.leadTimeDays} day${productData.leadTimeDays > 1 ? 's' : ''}` : '1–3 days'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 text-xs">Min. Order</p>
                                    <p className="font-medium text-gray-700 mt-0.5">
                                        {productData.minimumOrderQty || 1} {productData.unit || 'unit'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-gray-500 text-xs">Category</p>
                                    <p className="font-medium text-gray-700 mt-0.5">{productData.category}</p>
                                </div>
                            </div>

                            {/* Specifications */}
                            {Object.keys(specs).length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Specifications</p>
                                    <table className="table-auto border-collapse w-full text-sm">
                                        <tbody>
                                            {Object.entries(specs).map(([key, val]) => (
                                                <tr key={key} className="border-t border-gray-100">
                                                    <td className="py-1.5 pr-4 text-gray-500 font-medium w-1/2">{key}</td>
                                                    <td className="py-1.5 text-gray-700">{val}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    onClick={() => addToCart(productData._id)}
                                    className="flex-1 py-3 border-2 border-[#1e3a5f] text-[#1e3a5f] font-semibold rounded hover:bg-[#1e3a5f] hover:text-white transition"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => { addToCart(productData._id); if (user) router.push('/cart') }}
                                    className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded transition"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Payment methods */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                                <span>Pay via:</span>
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">M-Pesa</span>
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">PayPal</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">COD</span>
                            </div>
                        </div>
                    </div>

                    {/* Description tab */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="flex border-b border-gray-100">
                            {['description', 'delivery'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 text-sm font-medium capitalize transition ${
                                        activeTab === tab
                                            ? 'border-b-2 border-orange-500 text-orange-600'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    {tab === 'description' ? 'Product Description' : 'Delivery & Returns'}
                                </button>
                            ))}
                        </div>
                        <div className="p-6 text-sm text-gray-600 leading-relaxed">
                            {activeTab === 'description' ? (
                                <p>{productData.description}</p>
                            ) : (
                                <div className="space-y-3">
                                    <p>🚚 <strong>Delivery:</strong> Nationwide delivery within {productData.leadTimeDays || 2}–{(productData.leadTimeDays || 2) + 2} business days after order confirmation.</p>
                                    <p>📍 <strong>Coverage:</strong> All 47 counties in Kenya. Delivery charges apply based on location and order size.</p>
                                    <p>🔄 <strong>Returns:</strong> Returns accepted within 7 days for damaged or incorrect items. Contact support with photos.</p>
                                    <p>📞 <strong>Support:</strong> +254 700 000 000 · hello@buildsmart.co.ke</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related products */}
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <p className="text-xl font-semibold text-[#1e3a5f]">Related Products</p>
                                <div className="w-12 h-1 bg-orange-500 rounded mt-1"></div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
                            {products
                                .filter(p => p._id !== productData._id && p.category === productData.category)
                                .slice(0, 5)
                                .map((product, index) => <ProductCard key={index} product={product} />)
                            }
                            {products.filter(p => p._id !== productData._id && p.category === productData.category).length === 0 &&
                                products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;
