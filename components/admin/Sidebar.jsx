'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { name: 'Overview',    path: '/admin',                  icon: '📊' },
    { name: 'Suppliers',   path: '/admin/suppliers',        icon: '🏢' },
    { name: 'Products',    path: '/admin/products',         icon: '📦' },
    { name: 'Orders',      path: '/admin/orders',           icon: '🛒' },
    { name: 'Users',       path: '/admin/users',            icon: '👥' },
];

const AdminSidebar = () => {
    const pathname = usePathname()
    return (
        <div className='md:w-56 w-14 border-r min-h-screen border-gray-200 bg-white py-4 flex flex-col gap-1'>
            {menuItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                    <Link href={item.path} key={item.name} passHref>
                        <div className={`flex items-center py-3 px-4 gap-3 cursor-pointer transition ${
                            isActive
                                ? 'border-r-4 border-orange-500 bg-orange-50 text-orange-600'
                                : 'hover:bg-gray-50 text-gray-600 border-r-4 border-transparent'
                        }`}>
                            <span className="text-xl">{item.icon}</span>
                            <p className='md:block hidden text-sm font-medium'>{item.name}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default AdminSidebar;
