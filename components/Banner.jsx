import React from "react";
import Link from "next/link";

const Banner = () => {
  return (
    <div className="my-14 rounded-xl overflow-hidden bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white">
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-10 gap-8">
        {/* Left text */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <p className="text-orange-400 text-sm font-medium uppercase tracking-wide">
            For Suppliers & Contractors
          </p>
          <h2 className="text-2xl md:text-3xl font-bold leading-snug">
            Grow Your Business on<br />Build Smart Ke
          </h2>
          <p className="text-white/70 text-sm max-w-sm">
            Join Kenya's fastest-growing construction marketplace. List your products, reach thousands of builders, and get paid securely via M-Pesa or PayPal.
          </p>
          <div className="flex gap-3 pt-2 flex-wrap justify-center md:justify-start">
            <Link href="/seller/onboarding">
              <button className="px-6 py-2.5 bg-orange-500 hover:bg-orange-400 text-white font-medium rounded transition">
                Become a Supplier
              </button>
            </Link>
            <Link href="/all-products">
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded border border-white/30 transition">
                Browse Products
              </button>
            </Link>
          </div>
        </div>

        {/* Right stats */}
        <div className="grid grid-cols-2 gap-4 shrink-0">
          {[
            { val: "500+", label: "Products Listed" },
            { val: "50+", label: "Verified Suppliers" },
            { val: "1,200+", label: "Orders Fulfilled" },
            { val: "47", label: "Counties Reached" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/10 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-orange-400">{stat.val}</p>
              <p className="text-white/70 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
