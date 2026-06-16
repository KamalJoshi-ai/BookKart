"use client";

import { useGetSellerStatsQuery } from "@/store/api";
import { BookOpen, ShoppingBag, IndianRupee, LayoutDashboard } from "lucide-react";
import InfiniteSkeleton from "../earnings/infinteskeleton";

const statCards = [
  {
    label: "Total Books",
    key: "totalBooks",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    bg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Total Orders",
    key: "totalOrders",
    icon: ShoppingBag,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    label: "Total Earnings",
    key: "totalEarnings",
    icon: IndianRupee,
    color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    prefix: "₹",
  },
  {
    label: "Active Listings",
    key: "activeListings",
    icon: LayoutDashboard,
    color: "from-pink-500 to-rose-500",
    bg: "bg-pink-50",
    iconColor: "text-pink-600",
  },
];

const orderStatCards = [
  { label: "Pending", key: "pendingOrders", color: "text-orange-500" },
  { label: "Shipped", key: "shippedOrders", color: "text-blue-500" },
  { label: "Delivered", key: "deliveredOrders", color: "text-green-500" },
];

export default function SellerDashboard() {
  const { data, isLoading, isError } = useGetSellerStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return  <InfiniteSkeleton/>
    
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">Failed to load stats. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Heading */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Your seller dashboard at a glance</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, key, icon: Icon, bg, iconColor, prefix }) => (
          <div
            key={key}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm"
          >
            <div className={`${bg} p-3 rounded-lg`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-semibold text-gray-900">
                {prefix ?? ""}{stats?.[key] ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Breakdown */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h2 className="text-base font-medium text-gray-900 mb-4">Order Breakdown</h2>
        <div className="grid grid-cols-3 gap-4">
          {orderStatCards.map(({ label, key, color }) => (
            <div key={key} className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
              <p className={`text-2xl font-semibold ${color}`}>
                {stats?.[key] ?? 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}