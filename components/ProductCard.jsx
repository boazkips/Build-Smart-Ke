import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency, router } = useAppContext()

    const inStock = product.stock === undefined || product.stock > 0

    return (
        <div
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 w-full cursor-pointer bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group"
        >
            {/* Image */}
            <div className="relative bg-gray-50 w-full h-48 flex items-center justify-center overflow-hidden">
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition duration-300 object-cover w-full h-full"
                    width={400}
                    height={400}
                />
                {/* Stock badge */}
                <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                    inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {/* Wishlist */}
                <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition">
                    <Image className="h-3 w-3" src={assets.heart_icon} alt="wishlist" />
                </button>
            </div>

            {/* Info */}
            <div className="p-3 w-full">
                {/* Category & unit */}
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[#1e3a5f] font-medium bg-blue-50 px-2 py-0.5 rounded">
                        {product.category}
                    </span>
                    {product.unit && (
                        <span className="text-xs text-gray-400">per {product.unit}</span>
                    )}
                </div>

                {/* Name */}
                <p className="text-sm font-semibold text-gray-800 truncate w-full">{product.name}</p>

                {/* Brand / description */}
                {product.brand ? (
                    <p className="text-xs text-gray-500 truncate">{product.brand}</p>
                ) : (
                    <p className="text-xs text-gray-400 truncate max-sm:hidden">{product.description}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Image
                            key={i}
                            className="h-3 w-3"
                            src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                            alt="star"
                        />
                    ))}
                    <span className="text-xs text-gray-400">(4.0)</span>
                </div>

                {/* Price row */}
                <div className="flex items-center justify-between mt-2">
                    <div>
                        <span className="text-base font-bold text-[#1e3a5f]">
                            {currency}{product.offerPrice}
                        </span>
                        {product.price > product.offerPrice && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                                {currency}{product.price}
                            </span>
                        )}
                    </div>
                    <button
                        className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded transition max-sm:hidden"
                        onClick={(e) => { e.stopPropagation(); router.push('/product/' + product._id) }}
                    >
                        View
                    </button>
                </div>

                {/* Lead time */}
                {product.leadTimeDays && (
                    <p className="text-xs text-gray-400 mt-1">
                        🚚 Delivery in {product.leadTimeDays} day{product.leadTimeDays > 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    )
}

export default ProductCard
