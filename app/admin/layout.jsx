'use client'
import AdminNavbar from '@/components/admin/Navbar'
import AdminSidebar from '@/components/admin/Sidebar'
import React from 'react'

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavbar />
            <div className='flex w-full'>
                <AdminSidebar />
                {children}
            </div>
        </div>
    )
}

export default AdminLayout
