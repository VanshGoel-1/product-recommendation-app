import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function CartPage() {
    const { items, removeFromCart, totalPrice } = useCart();
    const navigate = useNavigate();

    if (items.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#0B1026] text-white px-4">
                <div className="bg-white/5 p-8 rounded-full mb-6">
                    <ShoppingBag size={48} className="text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                <Link
                    to="/search"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-lg shadow-blue-500/25"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1026] text-white pt-24 px-4 sm:px-6 lg:px-8 pb-20">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-blue-500" />
                    Shopping Cart ({items.length} items)
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                    {/* Cart Items List */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-4 p-4 bg-[#151c36] border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                            >
                                <div className="h-24 w-24 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden">
                                    <img
                                        src={item.images?.[0] || "https://via.placeholder.com/100"}
                                        alt={item.title || "Product"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg line-clamp-1">{item.title}</h3>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-400">{item.brand}</p>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="text-sm text-gray-400">
                                            Qty: {item.quantity}
                                        </div>
                                        <div className="text-lg font-bold text-emerald-400">
                                            ₹{(item.price ? item.price * 90 : 0).toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-[#151c36] border border-white/10 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">
                                Order Summary
                            </h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-8">
                                <span>Total</span>
                                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
                            </div>

                            <button
                                onClick={() => navigate("/checkout")}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
