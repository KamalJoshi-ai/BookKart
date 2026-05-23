"use client";

import { useState } from "react";
import {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/api";
import toast from "react-hot-toast";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STATUS_OPTIONS = ["processing","shipped", "delivered", "cancelled"];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  shipped: {
    label: "Shipped",
    color: "bg-blue-100 text-blue-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    icon: Package,
  },
  processing: {
  label: "Processing",
  color: "bg-yellow-100 text-yellow-700",
  icon: Clock,
},
};

export default function SellerOrdersPage() {
  const { data, isLoading, isError } = useGetSellerOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] =
    useUpdateOrderStatusMutation();

  const orders = data?.data?.orders ?? [];
  
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderUpdates, setOrderUpdates] = useState<Record<string,{ status: string; trackingNumber: string; courierName: string }>>({});

  const getOrderUpdate = (orderId: string, currentStatus: string) => {
    const update = orderUpdates[orderId];
    return {
      status: update?.status || currentStatus, 
      trackingNumber: update?.trackingNumber ?? "",
      courierName: update?.courierName ?? "",
    };
  };
  const handleUpdateChange = (
    orderId: string,
    field: string,
    value: string,
  ) => {
    setOrderUpdates((prev) => ({
      ...prev,
      [orderId]: { ...getOrderUpdate(orderId, ""), [field]: value },
    }));
  };

  const handleUpdateSubmit = async (orderId: string, currentStatus: string) => {
    const update = getOrderUpdate(orderId, currentStatus);
  
    try {
      await updateOrderStatus({
        orderId,
        status: update.status,
        trackingNumber: update.trackingNumber,
        courierName: update.courierName,
      }).unwrap();

      toast.success("Order updated successfully!");
      setExpandedOrder(null);
    } catch {
      toast.error("Failed to update order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">
          Failed to load orders. Please try again.
        </p>
      </div>
    );
  }

  
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <Package className="w-10 h-10 text-gray-300" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      )}

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {orders.map((order: any) => {
          const isExpanded = expandedOrder === order._id;
          const update = getOrderUpdate(order._id, order.status);
          const StatusIcon = statusConfig[order.status]?.icon ?? Package;

          return (
            <div
              key={order._id}
              className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Order Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${statusConfig[order.status]?.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig[order.status]?.label}
                  </span>
                  <span className="text-sm font-semibold text-violet-600">
                    ₹{order.totalAmount}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Order Detail — Expanded */}
              {isExpanded && (
                <div className="border-t border-gray-100 p-4 flex flex-col gap-4">
                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                      <span className="text-violet-600 text-sm font-semibold">
                        {order.user?.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="flex flex-col gap-2">
                    {order.items.map((item: any) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                      >
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product?.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${statusConfig[item.status]?.color}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress?.[0] && (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                      <p className="font-medium text-gray-800 mb-1">
                        Shipping Address
                      </p>
                      <p>
                        {order.shippingAddress[0].street},{" "}
                        {order.shippingAddress[0].city}
                      </p>
                      <p>
                        {order.shippingAddress[0].state} -{" "}
                        {order.shippingAddress[0].pincode}
                      </p>
                    </div>
                  )}

                  {/* Update Status */}
                  <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Update Order
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Status */}
                      <select
                        value={update.status}
                        onChange={(e) =>
                          handleUpdateChange(
                            order._id,
                            "status",
                            e.target.value,
                          )
                        }
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>  
                        ))}
                      </select>

                      {/* Tracking Number */}
                      <Input
                        placeholder="Tracking number"
                        value={update.trackingNumber}
                        onChange={(e) =>
                          handleUpdateChange(
                            order._id,
                            "trackingNumber",
                            e.target.value,
                          )
                        }
                        className="text-sm"
                      />

                      {/* Courier Name */}
                      <Input
                        placeholder="Courier name (e.g. Delhivery)"
                        value={update.courierName}
                        onChange={(e) =>
                          handleUpdateChange(
                            order._id,
                            "courierName",
                            e.target.value,
                          )
                        }
                        className="text-sm"
                      />
                    </div>
{(order.courierName || order.trackingNumber) && (
  <div className="p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
    <p className="font-medium text-gray-900 mb-2">
      Shipping Details :
    </p>

    {order.courierName && (
      <p>
        <span className="font-medium">Courier:</span>{" "}
        {order.courierName}
      </p>
    )}

    {order.trackingNumber && (
      <p>
        <span className="font-medium">Tracking Number:</span>{" "}
        {order.trackingNumber}
      </p>
    )}
  </div>
)}
                    <Button
                      onClick={() =>
                        handleUpdateSubmit(order._id, order.status)
                      }
                      disabled={isUpdating}
                      className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700"
                    >
                      {isUpdating ? "Updating..." : "Update Order"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
