import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#1e3a5f] text-white mt-16">
      {/* Trust bar */}
      <div className="border-b border-white/10 px-6 md:px-16 lg:px-32 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm">
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">✅</span>
            <p className="font-medium">Verified Suppliers</p>
            <p className="text-white/60 text-xs">KRA-registered suppliers only</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🚚</span>
            <p className="font-medium">Nationwide Delivery</p>
            <p className="text-white/60 text-xs">Delivered to your site</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">📱</span>
            <p className="font-medium">M-Pesa & PayPal</p>
            <p className="text-white/60 text-xs">Secure, familiar payment</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-2xl">🏗️</span>
            <p className="font-medium">Compare Prices</p>
            <p className="text-white/60 text-xs">Same product, multiple suppliers</p>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 px-6 md:px-16 lg:px-32 py-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-[#1e3a5f] font-bold text-lg px-3 py-1.5 rounded">
              Build<span className="text-orange-500">Smart</span>
            </div>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-4">
            Kenya's trusted marketplace for construction materials. Connecting builders, contractors, and developers with verified local suppliers.
          </p>
          <div className="flex gap-3">
            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded transition">
              <span className="text-sm">𝕏</span>
            </a>
            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded transition">
              <span className="text-sm">in</span>
            </a>
            <a href="#" className="bg-white/10 hover:bg-white/20 p-2 rounded transition">
              <span className="text-sm">f</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-4 text-orange-400">Product Categories</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {['Cement', 'Steel & Iron', 'Roofing', 'Tiles & Finishing', 'Plumbing', 'Timber & Wood', 'Electrical', 'Tools & Equipment'].map(cat => (
              <li key={cat}>
                <Link href={`/all-products?category=${cat.split(' ')[0]}`} className="hover:text-white transition">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4 text-orange-400">Company</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/" className="hover:text-white transition">About Build Smart Ke</Link></li>
            <li><Link href="/" className="hover:text-white transition">How It Works</Link></li>
            <li><Link href="/seller/onboarding" className="hover:text-white transition">Become a Supplier</Link></li>
            <li><Link href="/" className="hover:text-white transition">Supplier Verification</Link></li>
            <li><Link href="/" className="hover:text-white transition">Careers</Link></li>
            <li><Link href="/" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:text-white transition">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-4 text-orange-400">Get In Touch</h3>
          <div className="space-y-3 text-sm text-white/70">
            <p>📍 Westlands, Nairobi, Kenya</p>
            <p>📞 +254 700 000 000</p>
            <p>✉️ hello@buildsmart.co.ke</p>
            <p>🕐 Mon–Sat: 7:00 AM – 6:00 PM</p>
          </div>
          <div className="mt-5">
            <p className="text-xs text-white/50 mb-2">Accepted Payments</p>
            <div className="flex gap-2">
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">M-Pesa</span>
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">PayPal</span>
              <span className="bg-white/10 text-white text-xs px-2 py-1 rounded font-medium">COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 md:px-16 lg:px-32 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 gap-2">
        <p>© 2025 Build Smart Ke. All rights reserved.</p>
        <p>Built for Kenya's construction industry 🇰🇪</p>
      </div>
    </footer>
  );
};

export default Footer;
