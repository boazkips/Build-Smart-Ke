import React from "react";
import Link from "next/link";

const features = [
  {
    id: 1,
    icon: "🪨",
    title: "Cement & Concrete",
    description: "Bamburi OPC, CEM II, ready-mix concrete from certified suppliers with reliable delivery schedules.",
    href: "/all-products?category=Cement",
    bg: "bg-gray-800",
    badge: "Most Ordered",
  },
  {
    id: 2,
    icon: "⚙️",
    title: "Steel & Structural Iron",
    description: "Y8–Y32 deformed bars, BRC mesh, H-beams, angle iron from certified steel yards across Kenya.",
    href: "/all-products?category=Steel",
    bg: "bg-blue-900",
    badge: "High Demand",
  },
  {
    id: 3,
    icon: "🏠",
    title: "Roofing & Tiles",
    description: "Mabati iron sheets, ECC tiles, clay tiles, PVC ridge caps — protect your investment with quality.",
    href: "/all-products?category=Roofing",
    bg: "bg-orange-800",
    badge: "New Arrivals",
  },
];

const FeaturedProduct = () => {
  return (
    <div className="mt-14">
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-semibold text-[#1e3a5f]">Top Categories</p>
        <div className="w-16 h-1 bg-orange-500 rounded mt-2"></div>
        <p className="text-gray-500 text-sm mt-2">Kenya's highest-demand construction materials</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ id, icon, title, description, href, bg, badge }) => (
          <Link key={id} href={href}>
            <div className={`${bg} text-white rounded-xl p-8 h-full relative overflow-hidden group cursor-pointer hover:opacity-90 transition`}>
              {/* Badge */}
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                {badge}
              </span>
              {/* Icon */}
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{description}</p>
              <div className="mt-6 flex items-center gap-1 text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">
                Shop now <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProduct;
