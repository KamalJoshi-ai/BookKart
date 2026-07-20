"use client";

import React from "react";
import { useGetSellerStatsQuery } from "@/store/api";
import { BookOpen, ShoppingBag, IndianRupee, LayoutDashboard } from "lucide-react";
import InfiniteSkeleton from "../earnings/infinteskeleton";

const statCards = [
  {
    label: "Total Books",
    key: "totalBooks",
    icon: BookOpen,
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    valColor: "text-emerald-600",
  },
  {
    label: "Total Orders",
    key: "totalOrders",
    icon: ShoppingBag,
    bg: "bg-amber-50 text-amber-600 border-amber-100",
    valColor: "text-amber-600",
  },
  {
    label: "Total Earnings",
    key: "totalEarnings",
    icon: IndianRupee,
    bg: "bg-[#2874f0]/10 text-[#2874f0] border-blue-100",
    valColor: "text-[#2874f0]",
    prefix: "₹",
  },
  {
    label: "Active Listings",
    key: "activeListings",
    icon: LayoutDashboard,
    bg: "bg-purple-50 text-purple-600 border-purple-100",
    valColor: "text-purple-600",
  },
];

const orderStatCards = [
  { label: "Pending", key: "pendingOrders", color: "text-amber-600 bg-amber-50 border-amber-200" },
  { label: "Shipped", key: "shippedOrders", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "Delivered", key: "deliveredOrders", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
];

export default function SellerDashboard() {
  const { data, isLoading, isError } = useGetSellerStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return <InfiniteSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-xs">
        <p className="text-red-500 text-xs font-bold">Failed to load stats. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Heading Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Overview</h1>
        <p className="text-xs text-gray-500 mt-0.5">Your seller performance dashboard and store analytics</p>
      </div>

      {/* Stat Cards Grid matching Image 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, key, icon: Icon, bg, valColor, prefix }) => (
          <div
            key={key}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 shadow-xs"
          >
            <div className={`w-12 h-12 rounded-lg ${bg} border flex items-center justify-center shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">{label}</p>
              <p className={`text-2xl font-black ${valColor} mt-0.5`}>
                {prefix ?? ""}{stats?.[key] ?? 0}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Order Breakdown Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">Order Breakdown</h2>
        
        <div className="grid grid-cols-3 gap-4">
          {orderStatCards.map(({ label, key, color }) => (
            <div 
              key={key} 
              className={`flex flex-col items-center justify-center p-5 rounded-lg border text-center ${color}`}
            >
              <p className="text-3xl font-black">
                {stats?.[key] ?? 0}
              </p>
              <p className="text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}