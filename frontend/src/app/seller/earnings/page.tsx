"use client";

import { useGetSellerStatsQuery, useGetSellerOrdersQuery } from "@/store/api";
import {
  IndianRupee,
  TrendingUp,
  ShoppingBag,
  CheckCircle,
} from "lucide-react";
import InfiniteSkeleton from "./infinteskeleton";
export default function SellerEarningsPage() {
  const { data: statsData, isLoading: statsLoading } = useGetSellerStatsQuery();
  const { data: ordersData, isLoading: ordersLoading } =
    useGetSellerOrdersQuery();

  const stats = statsData?.data;
  const orders = ordersData?.data?.orders ?? [];
  // Sirf delivered orders — confirmed earnings
  const deliveredOrders = orders.filter((o: any) => o.status === "delivered");
if (statsLoading || ordersLoading) {
return <InfiniteSkeleton/>
}


  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Earnings</h1>
        <p className="text-sm text-gray-500 mt-1">Your revenue overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="bg-violet-50 p-3 rounded-lg">
            <IndianRupee className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Earnings</p>
            <p className="text-xl font-semibold text-gray-900">
              ₹{stats?.totalEarnings ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Delivered Orders</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats?.deliveredOrders ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <div className="bg-orange-50 p-3 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-xl font-semibold text-gray-900">
              {stats?.totalOrders ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Delivered Orders Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-900">
            Completed Orders
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Orders that have been delivered
          </p>
        </div>

        {deliveredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2">
            <TrendingUp className="w-8 h-8 text-gray-300" />
            <p className="text-sm text-gray-500">No completed orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">
                    Books
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {deliveredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {order.user?.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {order.items
                        .map((item: any) => item.product?.title)
                        .join(", ")}
                    </td>
                    
                    <td className="px-4 py-3 font-semibold text-violet-600">
                      ₹{order.totalAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
