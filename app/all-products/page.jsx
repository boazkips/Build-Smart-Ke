'use client'
import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

const CATEGORIES = [
    'Cement', 'Steel', 'Roofing', 'Tiles', 'Plumbing',
    'Timber', 'Electrical', 'Tools', 'Paint', 'Accessories'
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Best Rated', value: 'rating' },
];

const AllProducts = () => {
    const { products } = useAppContext();
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || '';

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [maxPrice, setMaxPrice] = useState('');

    const filtered = useMemo(() => {
        let list = [...products];
        if (selectedCategory) {
            list = list.filter(p => p.category?.toLowerCase() === selectedCategory.toLowerCase());
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.brand?.toLowerCase().includes(q)
            );
        }
        if (maxPrice) {
            list = list.filter(p => p.offerPrice <= Number(maxPrice));
        }
        if (sortBy === 'price_asc') list.sort((a, b) => a.offerPrice - b.offerPrice);
        else if (sortBy === 'price_desc') list.sort((a, b) => b.offerPrice - a.offerPrice);
        else if (sortBy === 'newest') list.sort((a, b) => b.date - a.date);
        return list;
    }, [products, selectedCategory, search, sortBy, maxPrice]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-[#1e3a5f] text-white px-6 md:px-16 lg:px-32 py-8">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        {selectedCategory ? `${selectedCategory} Products` : 'All Construction Materials'}
                    </h1>
                    <p className="text-white/70 text-sm mt-1">
                        {filtered.length} product{filtered.length !== 1 ? 's' : ''} from verified Kenyan suppliers
                    </p>
                    {/* Search */}
                    <div className="mt-4 flex max-w-xl">
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            type="text"
                            placeholder="Search products, brands..."
                            className="flex-1 px-4 py-2.5 text-gray-800 rounded-l outline-none text-sm"
                        />
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-r text-sm font-medium transition">
                            Search
                        </button>
                    </div>
                </div>

                <div className="px-6 md:px-16 lg:px-32 py-8 flex flex-col md:flex-row gap-8">
                    {/* Sidebar filters */}
                    <aside className="md:w-56 shrink-0 space-y-6">
                        {/* Category */}
                        <div>
                            <h3 className="font-semibold text-[#1e3a5f] mb-3">Category</h3>
                            <div className="space-y-1.5">
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    className={`w-full text-left text-sm px-3 py-1.5 rounded transition ${
                                        !selectedCategory
                                            ? 'bg-[#1e3a5f] text-white'
                                            : 'hover:bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    All Categories
                                </button>
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                                        className={`w-full text-left text-sm px-3 py-1.5 rounded transition ${
                                            selectedCategory === cat
                                                ? 'bg-[#1e3a5f] text-white'
                                                : 'hover:bg-gray-100 text-gray-600'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price filter */}
                        <div>
                            <h3 className="font-semibold text-[#1e3a5f] mb-3">Max Price (KES)</h3>
                            <input
                                type="number"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                placeholder="e.g. 5000"
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none"
                            />
                            {maxPrice && (
                                <button
                                    onClick={() => setMaxPrice('')}
                                    className="text-xs text-orange-600 mt-1 hover:underline"
                                >
                                    Clear filter
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        {/* Sort bar */}
                        <div className="flex items-center justify-between mb-5">
                            <p className="text-sm text-gray-500">
                                Showing <strong>{filtered.length}</strong> products
                            </p>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none text-gray-600"
                            >
                                {SORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-5xl mb-4">🏗️</p>
                                <p className="text-lg font-medium text-gray-600">No products found</p>
                                <p className="text-sm mt-1">Try adjusting your filters or search term</p>
                                <button
                                    onClick={() => { setSelectedCategory(''); setSearch(''); setMaxPrice(''); }}
                                    className="mt-4 text-orange-600 hover:underline text-sm"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {filtered.map((product, index) => (
                                    <ProductCard key={index} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
