import React from "react";

const NewsLetter = () => {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl px-6 md:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-4">
      <div className="text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a5f]">
          Get the Best Prices First
        </h2>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">
          Subscribe for weekly price updates, new supplier listings, and exclusive deals on cement, steel, and more.
        </p>
      </div>
      <div className="flex items-center w-full max-w-md">
        <input
          className="flex-1 border border-gray-300 border-r-0 rounded-l-md h-11 px-4 outline-none text-sm text-gray-700 bg-white"
          type="email"
          placeholder="Enter your email address"
        />
        <button className="h-11 bg-[#1e3a5f] hover:bg-[#122640] text-white px-6 rounded-r-md text-sm font-medium transition whitespace-nowrap">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
