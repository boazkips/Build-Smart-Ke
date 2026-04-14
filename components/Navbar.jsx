"use client"
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const BSLogo = ({ className = "h-10 w-auto" }) => (
  <Image src="/buildsmart-logo.jpeg" alt="Build Smart Kenya" width={160} height={48} className={className} priority />
);

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()
  const [menuOpen, setMenuOpen] = useState(false)

  const categories = [
    { label: 'Cement', href: '/all-products?category=Cement' },
    { label: 'Steel & Iron', href: '/all-products?category=Steel' },
    { label: 'Roofing', href: '/all-products?category=Roofing' },
    { label: 'Tiles', href: '/all-products?category=Tiles' },
    { label: 'Plumbing', href: '/all-products?category=Plumbing' },
    { label: 'Timber', href: '/all-products?category=Timber' },
    { label: 'Electrical', href: '/all-products?category=Electrical' },
    { label: 'Tools', href: '/all-products?category=Tools' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top bar */}
      <div className="bg-[#1e3a5f] text-white text-xs py-1.5 px-6 md:px-16 lg:px-32 flex justify-between items-center">
        <span>🇰🇪 Delivering across Kenya — Nairobi, Mombasa, Kisumu & more</span>
        <span className="hidden md:block">📞 +254 700 000 000 &nbsp;|&nbsp; Mon–Sat 7am–6pm</span>
      </div>

      {/* Main nav */}
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-200">
        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex items-center shrink-0">
          <BSLogo className="h-10 w-auto" />
        </button>

        {/* Search bar — desktop */}
        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <div className="flex w-full border-2 border-[#1e3a5f] rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search cement, steel, roofing, tiles..."
              className="flex-1 px-4 py-2 text-sm outline-none text-gray-700"
            />
            <button className="bg-[#1e3a5f] text-white px-5 py-2 text-sm font-medium hover:bg-[#122640] transition">
              Search
            </button>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {isSeller && (
            <button
              onClick={() => router.push('/seller')}
              className="hidden md:block text-xs border border-[#1e3a5f] text-[#1e3a5f] px-4 py-1.5 rounded-full hover:bg-[#1e3a5f] hover:text-white transition"
            >
              Supplier Portal
            </button>
          )}
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
              </UserButton.MenuItems>
              <UserButton.MenuItems>
                <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
              </UserButton.MenuItems>
              {isSeller && (
                <UserButton.MenuItems>
                  <UserButton.Action label="Supplier Portal" labelIcon={<BoxIcon />} onClick={() => router.push('/seller')} />
                </UserButton.MenuItems>
              )}
            </UserButton>
          ) : (
            <button
              onClick={openSignIn}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#1e3a5f] transition"
            >
              <Image src={assets.user_icon} alt="user icon" width={20} height={20} />
              <span className="hidden sm:block">Sign In</span>
            </button>
          )}

          {/* Cart icon */}
          <button onClick={() => router.push('/cart')} className="relative">
            <Image src={assets.cart_icon} alt="cart" width={22} height={22} />
          </button>
        </div>
      </nav>

      {/* Category nav bar */}
      <div className="bg-[#1e3a5f] text-white px-6 md:px-16 lg:px-32 hidden md:flex items-center gap-6 py-2 text-sm overflow-x-auto">
        <Link href="/all-products" className="whitespace-nowrap font-medium hover:text-orange-400 transition shrink-0">
          All Products
        </Link>
        <span className="text-white/30">|</span>
        {categories.map((cat) => (
          <Link key={cat.label} href={cat.href} className="whitespace-nowrap hover:text-orange-400 transition shrink-0">
            {cat.label}
          </Link>
        ))}
        <Link href="/seller/onboarding" className="whitespace-nowrap ml-auto text-orange-400 font-medium hover:text-orange-300 transition shrink-0">
          Become a Supplier →
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
