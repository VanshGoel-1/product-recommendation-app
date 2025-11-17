// File: src/pages/AnalyticsPage.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
// 1. Import useAuth
import { useAuth } from "@clerk/clerk-react";

// Register the components we need from Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define the shape of our API data
interface AnalyticsData {
  brand_counts: { [key: string]: number };
  category_counts: { [key: string]: number };
  total_products: number;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 2. Get the getToken function from Clerk
  const { getToken } = useAuth();

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      setLoading(true);
      setError("");
      setData(null);

      try {
        // 3. Get token for the analytics request
        const token = await getToken();

        const url = `${import.meta.env.VITE_API_URL}/analytics/summary`;
        console.log("Attempting to fetch analytics from:", url);

        // 4. Add Authorization header
        const res = await axios.get<AnalyticsData>(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Analytics data received:", res.data);
        setData(res.data);

      } catch (err: any) {
        setError("Failed to fetch analytics data. Please check the console.");
        console.error("--- ERROR FETCHING ANALYTICS ---", err);
        if (err.response) {
          console.error("Error data:", err.response.data);
          console.error("Error status:", err.response.status);
        } else {
          console.error("Error message:", err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [getToken]); // 5. Add getToken to dependency array

  // --- UI Logic (unchanged) ---

  if (loading) {
     return (
        <div className="flex justify-center items-center h-64 p-4">
             <p className="text-lg text-gray-600">Loading analytics...</p>
        </div>
     );
  }

  if (error) {
     return (
         <div className="rounded-md bg-red-50 p-4 m-4">
             <div className="flex">
                 <div className="flex-shrink-0">
                     <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94l-1.72-1.72z" clipRule="evenodd" />
                     </svg>
                 </div>
                 <div className="ml-3">
                     <h3 className="text-sm font-medium text-red-800">Error Loading Analytics</h3>
                     <div className="mt-2 text-sm text-red-700">
                         <p>{error}</p>
                     </div>
                 </div>
             </div>
         </div>
     );
  }

  if (!data) {
     return <div className="p-4 text-center text-gray-500">No analytics data available.</div>;
  }

  // --- Prepare Chart Data (unchanged) ---
  const brandChartData = {
    labels: Object.keys(data.brand_counts),
    datasets: [
      {
        label: "Product Count",
        data: Object.values(data.brand_counts),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
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
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#C9CBCF", "#E7E9ED", "#7CFFB2", "#FF6B6B"
        ],
         hoverOffset: 4
      },
    ],
  };

  const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: false,
          },
        },
  };

  // --- Render Page Content (unchanged) ---
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Data Analytics</h1>
      <div className="mb-8 p-4 bg-white rounded-lg shadow border border-gray-200 inline-block">
         <h2 className="text-xl font-semibold text-gray-700">Total Products Analyzed:
             <span className="ml-2 text-indigo-600">{data.total_products}</span>
         </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
            Top 10 Brands by Product Count
          </h3>
          <div className="relative h-72">
            <Bar data={brandChartData} options={chartOptions}/>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-center mb-4 text-gray-700">
            Top 10 Categories by Product Count
          </h3>
          <div className="relative h-72 w-full max-w-sm mx-auto">
            <Pie data={categoryChartData} options={{...chartOptions, maintainAspectRatio: true}}/>
          </div>
        </div>
      </div>
    </div>
  );
}