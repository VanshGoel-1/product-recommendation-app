// File: src/pages/ChatPage.tsx

import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
// 1. Import useAuth
import { useAuth } from "@clerk/clerk-react";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // 2. Get the getToken function from Clerk
  const { getToken } = useAuth();

  // Fetch brands when the component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        // 3. Get token for the brands request
        const token = await getToken();
        
        const url = `${import.meta.env.VITE_API_URL}/filters/brands`;
        // 4. Add Authorization header
        const res = await axios.get<string[]>(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBrands(['', ...res.data]);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
        setBrands(['']);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, [getToken]); // 5. Add getToken to dependency array

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    const url = `${import.meta.env.VITE_API_URL}/recommend/search`;

    const payload = {
      query,
      top_k: 5,
      ...(brandFilter && { brand_filter: brandFilter }),
      ...(minPrice && !isNaN(parseFloat(minPrice)) && { min_price: parseFloat(minPrice) }),
      ...(maxPrice && !isNaN(parseFloat(maxPrice)) && { max_price: parseFloat(maxPrice) }),
    };

    try {
      // 3. Get token for the search request
      const token = await getToken();

      // 4. Add Authorization header
      const res = await axios.post<Product[]>(url, payload, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
      setResults(res.data);
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.detail || "Invalid filter input.");
      } else {
        setError("Failed to get results. Please try again.");
      }
      console.error(
        "Error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setBrandFilter('');
    setMinPrice('');
    setMaxPrice('');
    // Note: handleSearch is not called here automatically
    // You could trigger it by uncommenting the line below
    // if (query.trim()) { handleSearch(); }
  };

  return (
    // The rest of your UI code (unchanged)
    <div className="relative isolate min-h-screen bg-gray-50 pb-20">
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#9DD3EE] to-[#6EC5F6] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}} />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 relative z-10">
        <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Discover Products with AI
        </h1>
        <p className="mb-10 text-center text-lg text-gray-600 max-w-2xl mx-auto">
          Find exactly what you need with intelligent search and filtering options.
        </p>
        <div className="mb-6 flex space-x-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'a comfy red chair for home office'"
            className="flex-grow rounded-xl border border-gray-300 p-3 text-lg shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            aria-label="Search products"
          />
          <button
            onClick={handleSearch}
            className="flex w-32 items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-lg font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 ease-in-out"
            disabled={loading || !query.trim()}
          >
            {loading ? (
              <svg className="h-6 w-6 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-5 w-5">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>
        <div className="mb-10 flex flex-wrap items-end justify-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <p className="w-full text-center text-lg font-semibold text-gray-800 mb-4 sm:hidden">Filter Your Search</p>
          <div className="flex-grow max-w-[12rem] md:max-w-none">
            <label htmlFor="brand" className="mb-2 block text-sm font-medium text-gray-700">Brand</label>
            <select
              id="brand"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              disabled={loadingBrands}
              className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-base shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 appearance-none transition duration-200 ease-in-out"
              aria-label="Filter by brand"
            >
              {loadingBrands ? (
                <option>Loading brands...</option>
              ) : (
                brands.map((brandName) => (
                  <option key={brandName || 'all'} value={brandName}>
                    {brandName || 'All Brands'}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex-grow max-w-[8rem] md:max-w-none">
            <label htmlFor="minPrice" className="mb-2 block text-sm font-medium text-gray-700">Min Price ($)</label>
            <input
              id="minPrice"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="50"
              min="0"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-base shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
              aria-label="Minimum price"
            />
          </div>
          <div className="flex-grow max-w-[8rem] md:max-w-none">
            <label htmlFor="maxPrice" className="mb-2 block text-sm font-medium text-gray-700">Max Price ($)</label>
            <input
              id="maxPrice"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="200"
              min="0"
              className="w-full rounded-lg border border-gray-300 p-2.5 text-base shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200 ease-in-out"
              aria-label="Maximum price"
            />
          </div>
          {(brandFilter || minPrice || maxPrice) && (
               <button
                   onClick={clearFilters}
                   className="flex-shrink-0 mt-8 sm:mt-0 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ease-in-out"
                   title="Clear all filters"
               >
                   Clear Filters
               </button>
          )}
        </div>
        <div className="mt-12">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error during search:</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!loading && results.length === 0 && !error && (
            <div className="text-center py-12 rounded-lg bg-white border border-gray-200 shadow-sm">
              <p className="text-xl font-medium text-gray-600">No products found for your query.</p>
              <p className="mt-2 text-md text-gray-500">Try adjusting your search terms or filters.</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}
            {!loading &&
              results.length > 0 &&
              !error &&
              results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#9DD3EE] to-[#6EC5F6] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
      </div>
    </div>
  );
}