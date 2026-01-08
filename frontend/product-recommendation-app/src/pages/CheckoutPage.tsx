import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        card: "",
        expiry: "",
        cvc: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.address.trim()) newErrors.address = "Shipping address is required";
        if (!formData.card.trim()) {
            newErrors.card = "Card number is required";
        } else if (formData.card.replace(/\s/g, "").length < 13) {
            newErrors.card = "Invalid card number";
        }
        if (!formData.expiry.trim()) newErrors.expiry = "Required";
        if (!formData.cvc.trim()) {
            newErrors.cvc = "Required";
        } else if (formData.cvc.length < 3) {
            newErrors.cvc = "Invalid CVC";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const token = await getToken();
            if (!token) throw new Error("Not authenticated");

            const orderPayload = {
                items: items,
                total_amount: totalPrice,
                shipping_address: formData.address,
                status: "processing"
            };

            await axios.post(`${import.meta.env.VITE_API_URL}/orders/`, orderPayload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
            clearCart();
            setTimeout(() => navigate("/"), 3000);
        } catch (err) {
            console.error("Checkout failed", err);
            // In a real app show toast
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0B1026] text-white">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center p-8 bg-[#151c36] border border-white/10 rounded-3xl max-w-md w-full mx-4 shadow-2xl"
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-emerald-500/10 p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-emerald-500" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Order Placed!</h2>
                    <p className="text-gray-400 mb-6">
                        Thank you for your purchase. You can view your order in the dashboard.
                    </p>
                    <p className="text-sm text-blue-400 animate-pulse">Redirecting to home...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1026] text-white pt-24 px-4 pb-20">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="bg-[#151c36] border border-white/10 rounded-2xl p-8 shadow-xl">
                    <div className="mb-8 border-b border-white/10 pb-6">
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-400">Total to pay</span>
                            <span className="font-bold text-emerald-400 text-2xl">
                                ₹{totalPrice.toLocaleString("en-IN")}
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">First Name</label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                />
                                {errors.firstName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Last Name</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                />
                                {errors.lastName && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            />
                            {errors.email && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Shipping Address</label>
                            <textarea
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none ${errors.address ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                            />
                            {errors.address && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.address}</p>}
                        </div>

                        <div className="space-y-2 pt-4">
                            <label className="text-sm font-medium text-gray-300">Card Details</label>
                            <div className="relative">
                                <input
                                    name="card"
                                    placeholder="0000 0000 0000 0000"
                                    value={formData.card}
                                    onChange={handleChange}
                                    className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 pl-12 focus:outline-none transition-colors ${errors.card ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                />
                                <div className="absolute left-4 top-3.5 text-gray-500 pointer-events-none text-xs">CARD</div>
                            </div>
                            {errors.card && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} /> {errors.card}</p>}

                            <div className="grid grid-cols-2 gap-6 mt-2">
                                <div>
                                    <input
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={formData.expiry}
                                        onChange={handleChange}
                                        className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors text-center ${errors.expiry ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                    />
                                    {errors.expiry && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.expiry}</p>}
                                </div>
                                <div>
                                    <input
                                        name="cvc"
                                        placeholder="CVC"
                                        maxLength={3}
                                        value={formData.cvc}
                                        onChange={handleChange}
                                        className={`w-full bg-[#0B1026] border rounded-xl px-4 py-3 focus:outline-none transition-colors text-center ${errors.cvc ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-blue-500'}`}
                                    />
                                    {errors.cvc && <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><AlertCircle size={12} /> {errors.cvc}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Place Order"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
