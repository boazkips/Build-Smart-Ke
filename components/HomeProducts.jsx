import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const CATEGORIES = [
  { label: "Cement", icon: "🪨", color: "bg-gray-100 text-gray-700" },
  { label: "Steel", icon: "⚙️", color: "bg-blue-50 text-blue-700" },
  { label: "Roofing", icon: "🏠", color: "bg-red-50 text-red-700" },
  { label: "Tiles", icon: "🔲", color: "bg-purple-50 text-purple-700" },
  { label: "Plumbing", icon: "🚿", color: "bg-cyan-50 text-cyan-700" },
  { label: "Timber", icon: "🪵", color: "bg-amber-50 text-amber-700" },
  { label: "Electrical", icon: "⚡", color: "bg-yellow-50 text-yellow-700" },
  { label: "Tools", icon: "🔧", color: "bg-green-50 text-green-700" },
  { label: "Paint", icon: "🎨", color: "bg-pink-50 text-pink-700" },
  { label: "Accessories", icon: "📦", color: "bg-orange-50 text-orange-700" },
];

const HomeProducts = () => {
  const { products, router } = useAppContext()

  return (
    <div className="pt-12">
      {/* Category grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-2xl font-semibold text-[#1e3a5f]">Shop by Category</p>
            <div className="w-16 h-1 bg-orange-500 rounded mt-1"></div>
          </div>
          <button
            onClick={() => router.push('/all-products')}
            className="text-sm text-orange-600 hover:underline font-medium"
          >
            View All →
          </button>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => router.push(`/all-products?category=${cat.label}`)}
              className={`category-card flex flex-col items-center gap-1.5 p-3 rounded-xl ${cat.color} border border-transparent hover:border-current`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-2xl font-semibold text-[#1e3a5f]">Featured Products</p>
          <div className="w-16 h-1 bg-orange-500 rounded mt-1"></div>
        </div>
        <button
          onClick={() => router.push('/all-products')}
          className="text-sm text-orange-600 hover:underline font-medium"
        >
          See All Products →
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-14">
        {products.slice(0, 10).map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
