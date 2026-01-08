import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { Package, Calendar, MapPin, User, Loader2 } from "lucide-react";

interface Order {
    id: number;
    items: string; // JSON string
    total_amount: number;
    status: string;
    created_at: string;
    shipping_address: string;
}

export default function DashboardPage() {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await getToken();
                if (!token) return;

                const res = await axios.get<Order[]>(`${import.meta.env.VITE_API_URL}/orders/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchOrders();
    }, [user, getToken]);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0B1026] text-white pt-24 px-4 pb-20">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
                <p className="text-gray-400 mb-10">Manage your account and view order history</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#151c36] border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
                            <div className="flex flex-col items-center">
                                <img
                                    src={user.imageUrl}
                                    alt={user.fullName || "User"}
                                    className="w-24 h-24 rounded-full border-4 border-blue-500/20 mb-4"
                                />
                                <h2 className="text-xl font-bold">{user.fullName}</h2>
                                <p className="text-gray-400 text-sm mb-6">{user.primaryEmailAddress?.emailAddress}</p>

                                <div className="w-full space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#0B1026] border border-white/5">
                                        <User className="text-blue-400" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">Member Since</p>
                                            <p className="text-sm font-medium">{new Date(user.createdAt!).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {/* Placeholder for more stats */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <Package className="text-blue-400" />
                            <h2 className="text-2xl font-bold">Order History</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center p-10">
                                <Loader2 className="animate-spin text-blue-500" size={32} />
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-[#151c36] border border-white/10 rounded-3xl p-10 text-center">
                                <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                                <p className="text-gray-400">Looks like you haven't bought anything yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => {
                                    const items = JSON.parse(order.items);
                                    return (
                                        <div key={order.id} className="bg-[#151c36] border border-white/10 rounded-3xl overflow-hidden shadow-lg transition-all hover:bg-[#1a2342]">
                                            <div className="p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-blue-500/10 p-3 rounded-full">
                                                        <Package className="text-blue-400" size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Order #{order.id}</p>
                                                        <p className="text-sm font-medium text-white flex items-center gap-1">
                                                            <Calendar size={12} className="text-gray-500" />
                                                            {new Date(order.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'pending' || order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="text-xl font-bold text-white">
                                                        ₹{order.total_amount.toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-[#0B1026]/50">
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                                        <MapPin size={14} /> Shipping to:
                                                    </p>
                                                    <p className="text-sm text-white pl-6">{order.shipping_address}</p>
                                                </div>

                                                <div className="space-y-3">
                                                    {Array.isArray(items) && items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-4 p-2 rounded-xl bg-[#0B1026] border border-white/5">
                                                            <img src={item.images?.[0] || "https://via.placeholder.com/50"} alt={item.title} className="w-12 h-12 rounded-lg object-cover" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                                                <p className="text-xs text-gray-400">{item.brand}</p>
                                                            </div>
                                                            <p className="text-sm font-bold text-emerald-400">
                                                                ₹{(item.price * 90).toLocaleString("en-IN")}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
