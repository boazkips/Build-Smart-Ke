'use client'
import React from 'react'
import { UserButton } from '@clerk/nextjs'
import { useAppContext } from '@/context/AppContext'

const AdminNavbar = () => {
    const { router } = useAppContext()
    return (
        <div className="flex items-center justify-between bg-[#122640] text-white px-6 md:px-10 py-3 shadow-lg">
            <button onClick={() => router.push('/')} className="flex items-center gap-2">
                <div className="bg-white text-[#1e3a5f] font-bold text-base px-2.5 py-1 rounded">
                    Build<span className="text-orange-500">Smart</span>
                </div>
                <span className="text-white/60 text-xs hidden sm:block">Admin Dashboard</span>
            </button>
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/')}
                    className="text-xs text-white/70 hover:text-white transition hidden sm:block">
                    View Store →
                </button>
                <UserButton />
            </div>
        </div>
    )
}

export default AdminNavbar
