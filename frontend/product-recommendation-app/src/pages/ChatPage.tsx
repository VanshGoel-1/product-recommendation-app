import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, ChevronRight, SlidersHorizontal, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import SkeletonCard from "../components/SkeletonCard";
import CinematicBackground from "../components/CinematicBackground";

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [brandFilter, setBrandFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  // Expanded Card State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { getToken } = useAuth();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedProduct]);

  // Fetch Brands
  useEffect(() => {
    const fetchBrands = async () => {
      setLoadingBrands(true);
      try {
        const token = await getToken();
        if (!token) return;

        const url = `${import.meta.env.VITE_API_URL}/filters/brands`;
        const res = await axios.get<string[]>(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Backend returns list of strings
        setBrands(["", ...res.data]);
      } catch (err) {
        console.error("Failed to fetch brands", err);
        setBrands([""]);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, [getToken]);

  const handleSearch = async (overrideQuery?: string) => {
    const searchQuery = overrideQuery !== undefined ? overrideQuery : query;
    if (!searchQuery.trim()) return;

    if (overrideQuery) setQuery(overrideQuery);

    // Trigger transition state immediately
    setHasSearched(true);
    setLoading(true);
    setError("");
    setResults([]);

    const payload = {
      query: searchQuery,
      top_k: 8,
      ...(brandFilter && { brand_filter: brandFilter }),
      ...(minPrice && !isNaN(parseFloat(minPrice)) && { min_price: parseFloat(minPrice) }),
      ...(maxPrice && !isNaN(parseFloat(maxPrice)) && { max_price: parseFloat(maxPrice) }),
    };

    try {
      const token = await getToken();
      if (!token) {
        setError("Session expired. Please refresh.");
        return;
      }

      const url = `${import.meta.env.VITE_API_URL}/recommend/search`;
      const res = await axios.post<Product[]>(url, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setResults(res.data);
    } catch (err: any) {
      setError("Failed to fetch results. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setBrandFilter("");
    setMinPrice("");
    setMaxPrice("");
  };

  const examplePrompts = [
    "Minimal wooden desk under $300",
    "Ergonomic chair for home office",
    "Modern sofa, neutral colors",
  ];

  return (
    <div className="relative min-h-screen font-sans text-gray-100 bg-[#0B1026] selection:bg-blue-500/40">
      <CinematicBackground dimmed={hasSearched} />

      {/* EXPANDED PRODUCT OVERLAY */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Expanded Card */}
            <motion.div
              layoutId={`card-container-${selectedProduct.id}`}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-[#0B1026] shadow-2xl ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-[300px] md:h-full bg-black">
                  <motion.img
                    layoutId={`card-image-${selectedProduct.id}`}
                    src={selectedProduct.images?.[0] || "https://via.placeholder.com/300"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-transparent to-transparent opacity-60 md:hidden" />

                  {/* Close Button Mobile */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white backdrop-blur-md md:hidden"
                  >
                    <ChevronRight className="h-6 w-6 rotate-180" />
                  </button>
                </div>

                {/* Content Section */}
                <div className="flex flex-col p-8 md:p-10">
                  <div className="mb-4 flex items-start justify-between">
                    <motion.h2
                      layoutId={`card-title-${selectedProduct.id}`}
                      className="text-3xl font-bold leading-tight text-white mb-2"
                    >
                      {selectedProduct.title}
                    </motion.h2>

                    {/* Desktop Close/Back Buttons */}
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="hidden md:flex flex-col items-center justify-center gap-1 rounded-xl bg-white/5 p-3 text-xs text-white/50 hover:bg-white/10 transition-colors"
                    >
                      <span className="font-bold">ESC</span>
                    </button>
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    {selectedProduct.brand && (
                      <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 border border-blue-500/30">
                        {selectedProduct.brand}
                      </span>
                    )}
                    {selectedProduct.categories && selectedProduct.categories.split(",").map((cat, i) => (
                      <span key={i} className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 border border-white/10">
                        {cat.trim()}
                      </span>
                    ))}
                  </div>

                  <p className="text-lg text-gray-300 leading-relaxed mb-8">
                    {selectedProduct.generated_description}
                  </p>

                  <div className="mt-auto space-y-6 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price</p>
                        <p className="text-4xl font-bold text-emerald-400">
                          ${selectedProduct.price?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setSelectedProduct(null)}
                          className="rounded-xl border border-white/10 px-6 py-3 font-medium text-white hover:bg-white/5 transition-colors"
                        >
                          Back to Search
                        </button>
                        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-colors">
                          View Deal <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* HERO / SEARCH SECTION */}
        <motion.div
          layout
          className={`relative z-20 flex flex-col justify-center transition-all duration-700 ${hasSearched ? "pt-6 pb-6 min-h-[0px]" : "min-h-[85vh] pt-0"}`}
        >
          {/* Header */}
          <motion.div layout className="text-center mb-8">
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-xl">
                  Discover Products <br /> With AI
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
                  Describe what you want naturally. Our AI understands intent, not just keywords.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Search Bar */}
          <motion.div
            layout
            className={`mx-auto w-full transition-all duration-500 ${hasSearched ? "max-w-6xl flex items-center gap-4" : "max-w-2xl"}`}
          >
            <div className="relative flex-1 group">
              {/* Glow behind search bar */}
              <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur transition duration-500 group-hover:opacity-40 ${hasSearched ? "hidden" : "block"}`} />

              <div className="relative flex items-center bg-[#151c36] border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20">
                <Search className="ml-4 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={hasSearched ? "Refine your search..." : "Try 'a sleek coffee maker'..."}
                  className="w-full bg-transparent px-4 py-4 text-lg text-white placeholder-gray-500 focus:outline-none"
                  autoFocus
                />
                <div className="pr-2">
                  <button
                    onClick={() => handleSearch()}
                    disabled={loading || !query.trim()}
                    className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 font-medium text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
                  </button>
                </div>
              </div>
            </div>

            {/* Example Prompts */}
            {!hasSearched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-wrap justify-center gap-3"
              >
                {examplePrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSearch(prompt)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-[#1e2746] px-5 py-2.5 text-sm text-gray-200 shadow-lg transition-all hover:bg-[#252f50] hover:border-white/20 hover:-translate-y-0.5"
                  >
                    <Sparkles className="h-3 w-3 text-blue-400" />
                    {prompt}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* RESULTS */}
        <AnimatePresence>
          {hasSearched && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]"
            >
              {/* FILTERS */}
              <div className="order-first lg:order-none">
                <div className="sticky top-24 space-y-6 rounded-2xl border border-white/10 bg-[#151c36] p-6 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                      <SlidersHorizontal className="h-4 w-4 text-blue-400" />
                      Filters
                    </h3>
                    {(brandFilter || minPrice || maxPrice) && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-medium text-blue-400 hover:text-blue-300"
                      >
                        Reset All
                      </button>
                    )}
                  </div>

                  {/* Brand Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Brand</label>
                    <div className="relative">
                      <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        className="w-full appearance-none rounded-xl bg-[#0B1026] border border-white/10 py-3 pl-4 pr-10 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                      >
                        {loadingBrands ? <option>Loading...</option> : (
                          <>
                            <option value="">All Brands</option>
                            {brands.filter(b => b).map(b => (
                              <option key={b} value={b} className="bg-[#0B1026]">{b}</option>
                            ))}
                          </>
                        )}
                      </select>
                      <ChevronRight className="absolute right-3 top-3.5 h-4 w-4 rotate-90 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Price Limit</label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-xl bg-[#0B1026] border border-white/10 py-3 px-4 text-sm text-gray-200 focus:border-blue-500 focus:outline-none placeholder-gray-600"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full rounded-xl bg-[#0B1026] border border-white/10 py-3 px-4 text-sm text-gray-200 focus:border-blue-500 focus:outline-none placeholder-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* GRID */}
              <div className="min-h-[500px]">
                {error && (
                  <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
                    <span className="font-bold mr-2">Error:</span> {error}
                  </div>
                )}

                {!loading && results.length === 0 && !error && (
                  <div className="flex h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#151c36] text-center p-8">
                    <div className="mb-6 rounded-full bg-white/5 p-6">
                      <Search className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                    <p className="text-gray-400 max-w-md">
                      Try removing some filters or searching for something simpler like "blue shoes".
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {loading && Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                  {!loading && results.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}