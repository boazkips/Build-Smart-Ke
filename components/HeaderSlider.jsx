import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
  const { router } = useAppContext()

  const sliderData = [
    {
      id: 1,
      tag: "Best Seller · Cement & Concrete",
      title: "Premium Cement Delivered to Your Construction Site",
      subtitle: "Bamburi, Mombasa Cement, ARM & more — compare prices from verified suppliers across Kenya.",
      cta1: "Shop Cement",
      cta2: "Compare Suppliers",
      href1: "/all-products?category=Cement",
      bg: "from-[#1e3a5f] to-[#2d5a8e]",
      emoji: "🏗️",
      stats: [{ label: "Suppliers", val: "50+" }, { label: "Brands", val: "8" }, { label: "Delivery", val: "24–48h" }],
    },
    {
      id: 2,
      tag: "High Demand · Steel & Iron",
      title: "Structural Steel Bars, Mesh & Iron Sheets",
      subtitle: "Y8 to Y32 deformed bars, BRC mesh, galvanised iron — from certified steel yards.",
      cta1: "Shop Steel",
      cta2: "Get a Quote",
      href1: "/all-products?category=Steel",
      bg: "from-[#7c2d12] to-[#ea580c]",
      emoji: "⚙️",
      stats: [{ label: "Grades", val: "10+" }, { label: "Suppliers", val: "30+" }, { label: "Min Order", val: "1 tonne" }],
    },
    {
      id: 3,
      tag: "Top Quality · Roofing & Tiles",
      title: "Roofing Sheets, Tiles & Finishing Materials",
      subtitle: "Mabati, ECC, clay tiles, ceramic tiles, marble — everything to complete your build.",
      cta1: "Shop Roofing",
      cta2: "Browse Tiles",
      href1: "/all-products?category=Roofing",
      bg: "from-[#14532d] to-[#16a34a]",
      emoji: "🏠",
      stats: [{ label: "Tile Types", val: "20+" }, { label: "Roofing", val: "15+" }, { label: "Warranty", val: "Up to 10yr" }],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const slide = sliderData[currentSlide];

  return (
    <div className="mt-4 rounded-xl overflow-hidden">
      <div
        className={`bg-gradient-to-r ${slide.bg} text-white transition-all duration-700`}
      >
        <div className="px-8 md:px-16 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text */}
          <div className="flex-1 space-y-4 max-w-xl">
            <span className="inline-block bg-white/20 text-xs font-medium px-3 py-1 rounded-full">
              {slide.tag}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="flex gap-3 pt-2 flex-wrap">
              <button
                onClick={() => router.push(slide.href1)}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-medium rounded transition"
              >
                {slide.cta1}
              </button>
              <button
                onClick={() => router.push('/all-products')}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded border border-white/30 transition"
              >
                {slide.cta2}
              </button>
            </div>
            {/* Stats row */}
            <div className="flex gap-6 pt-2">
              {slide.stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-bold">{s.val}</p>
                  <p className="text-white/60 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="text-[120px] md:text-[160px] select-none opacity-90">
            {slide.emoji}
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "w-6 bg-orange-500" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
