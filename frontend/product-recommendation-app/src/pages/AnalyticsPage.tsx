import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type Defaults,
  type ChartOptions
} from "chart.js";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, AlertCircle, TrendingUp, Package, PieChart } from "lucide-react";
import CinematicBackground from "../components/CinematicBackground";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Configure ChartJS Defaults for Dark Mode
const darkDefaults = {
  color: "#9ca3af", // text-gray-400
  borderColor: "rgba(255, 255, 255, 0.1)",
};
ChartJS.defaults.color = darkDefaults.color;
ChartJS.defaults.borderColor = darkDefaults.borderColor;

interface AnalyticsData {
  brand_counts: { [key: string]: number };
  category_counts: { [key: string]: number };
  total_products: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        if (!token) return;

        const url = `${import.meta.env.VITE_API_URL}/analytics/summary`;
        const res = await axios.get<AnalyticsData>(url, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setData(res.data);
      } catch (err: any) {
        console.error("Analytics fetch error:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-blue-400">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl bg-red-500/10 border border-red-500/20 p-6 backdrop-blur-md">
          <div className="flex items-center gap-3 text-red-400 mb-2">
            <AlertCircle className="h-6 w-6" />
            <h3 className="text-lg font-semibold">Error Loading Analytics</h3>
          </div>
          <p className="text-red-300/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Chart Data Preparation
  const brandChartData = {
    labels: Object.keys(data.brand_counts),
    datasets: [
      {
        label: "Product Count",
        data: Object.values(data.brand_counts),
        backgroundColor: "rgba(59, 130, 246, 0.6)", // Blue-500 with opacity
        borderColor: "#3b82f6",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "#60a5fa",
      },
    ],
  };

  const categoryChartData = {
    labels: Object.keys(data.category_counts),
    datasets: [
      {
        label: "Product Count",
        data: Object.values(data.category_counts),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",   // Blue
          "rgba(168, 85, 247, 0.7)",   // Purple
          "rgba(236, 72, 153, 0.7)",   // Pink
          "rgba(16, 185, 129, 0.7)",   // Emerald
          "rgba(245, 158, 11, 0.7)",   // Amber
          "rgba(99, 102, 241, 0.7)",   // Indigo
        ],
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        hoverOffset: 10
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f3f4f6",
        bodyColor: "#d1d5db",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9ca3af" }
      },
      x: {
        grid: { display: false },
        ticks: { color: "#9ca3af" }
      }
    }
  };

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: "#e5e7eb",
          font: { size: 12 },
          padding: 20,
          usePointStyle: true,
        }
      }
    },
    layout: {
      padding: 20
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-gray-100 selection:bg-blue-500/40 pb-20">
      <CinematicBackground />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Real-time insights into product inventory and categorization.</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Total Products Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151c36]/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Total Products</p>
                <h3 className="text-3xl font-bold text-white">{data.total_products}</h3>
              </div>
            </div>
          </div>

          {/* Brands Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151c36]/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-purple-500/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Active Brands</p>
                <h3 className="text-3xl font-bold text-white">{Object.keys(data.brand_counts).length}</h3>
              </div>
            </div>
          </div>

          {/* Categories Card */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#151c36]/80 p-6 shadow-xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <PieChart className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-400">Categories</p>
                <h3 className="text-3xl font-bold text-white">{Object.keys(data.category_counts).length}</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Bar Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-[#151c36]/60 p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Top Brands</h3>
              <span className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Distribution</span>
            </div>
            <div className="h-[350px]">
              <Bar data={brandChartData} options={barOptions} />
            </div>
          </motion.div>

          {/* Pie Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/10 bg-[#151c36]/60 p-8 shadow-2xl backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Category Split</h3>
              <span className="text-xs font-medium text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">Segments</span>
            </div>
            <div className="h-[350px] flex items-center justify-center">
              <div className="w-full max-w-sm">
                <Pie data={categoryChartData} options={pieOptions} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}