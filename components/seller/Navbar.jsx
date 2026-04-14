'use client'
import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'

const SellerNavbar = () => {
    const { router } = useAppContext()

    return (
        <div className="flex items-center justify-between bg-[#1e3a5f] text-white px-6 md:px-10 py-2 shadow-md">
            <button onClick={() => router.push('/')} className="flex items-center gap-3">
                <div className="bg-white rounded px-1 py-0.5">
                    <Image src="/buildsmart-logo.jpeg" alt="Build Smart Kenya" width={120} height={36} className="h-9 w-auto" />
                </div>
                <span className="text-white/70 text-xs hidden sm:block">Supplier Portal</span>
            </button>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/')}
                    className="text-xs text-white/70 hover:text-white transition hidden sm:block"
                >
                    View Store →
                </button>
                <UserButton />
            </div>
        </div>
    )
}

export default SellerNavbar
