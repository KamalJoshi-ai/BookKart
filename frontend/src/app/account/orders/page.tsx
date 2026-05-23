"use client";
import { useGetOrdersQuery } from "@/store/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
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
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { data, isLoading, isError } = useGetOrdersQuery();
  const orders = data?.data || [];
 

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-orange-100">
            Track your orders and delivery status
          </p>
        </div>
        <div className="space-y-4">
         {Array.from({ length: 6 }).map((_, i) => (
  <div
    key={i}
    className={`h-24 rounded-lg animate-pulse bg-gray-100 ${i % 2 === 0 ? "w-full" : "w-3/4"}`}
  />
))}

        </div>
      </div>
    );
  }

  if (isError || orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-2">My Orders</h1>
          <p className="text-orange-100">
            Track your orders and delivery status
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <Package className="w-16 h-16 text-gray-300" />
            <p className="text-xl font-semibold text-gray-500">No orders yet</p>
            <p className="text-gray-400">
              Your orders will appear here once you make a purchase
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">My Orders</h1>
        <p className="text-orange-100">Track your orders and delivery status</p>
      </div>

      {/* Orders List */}
      <Accordion type="single" collapsible className="space-y-4">
        {orders.map((order: any) => {
          const address = order.shippingAddress?.[0];

          // Overall order tracking — shipped/delivered pe dikhao
          const showTracking =
            (order.status === "shipped" || order.status === "delivered") &&
            order.trackingNumber;

          return (
            <AccordionItem
              key={order._id}
              value={order._id}
              className="border rounded-lg shadow-sm overflow-hidden"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                <div className="flex flex-1 items-center justify-between pr-4">
                  {/* Left — Order ID + Date */}
                  <div className="text-left">
                    <p className="font-bold text-gray-800">
                      Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), "dd MMM yyyy")}
                    </p>
                  </div>

                  {/* Right — Items count + Amount */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {order.items.length} item
                      {order.items.length > 1 ? "s" : ""}
                    </span>
                    <p className="font-bold text-gray-800">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 bg-gray-100/80">
                <div className="space-y-4 pt-2">
                  {/* Books — har item ka apna status */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Books Ordered:
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item: any) => {
                        const itemStatus =
                          statusConfig[item.status] ?? statusConfig.pending;
                        const ItemStatusIcon = itemStatus.icon;
                        return (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 bg-white p-3 rounded-lg border"
                          >
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-14 h-14 object-cover rounded-md"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {item.product?.title ?? "Book"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.product?.author} •{" "}
                                {item.product?.condition}
                              </p>
                            </div>
                            {/* Item ka status badge */}
                            <span
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${itemStatus.color}`}
                            >
                              <ItemStatusIcon className="w-3 h-3" />
                              {itemStatus.label}
                            </span>
                            <p className="font-bold text-gray-800">
                              ₹{item.price}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tracking Info */}
                  {showTracking && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Tracking Information
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Tracking Number :</span>
                        <span className="font-bold text-purple-700">
                          {order.trackingNumber}
                        </span>
                        {order.courierName && (
                          <>
                            <span className="text-gray-500">Courier</span>
                            <span className="font-medium text-gray-800">
                              {order.courierName}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Shipping Address */}
                  {address && (
                    <div className="bg-white border rounded-lg p-4">
                      <p className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Shipping Address
                      </p>
                      <p className="text-sm text-gray-700">
                        {[
                          address.street,
                          address.city,
                          address.state,
                          address.country,
                          address.pincode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Payment Info */}
                  <div className="flex items-center justify-between text-sm bg-white border rounded-lg p-4">
                    <div>
                      <span className="text-gray-500">Payment Method: </span>
                      <span className="font-medium capitalize">
                        {order.paymentMethod}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Payment Status: </span>
                      <span
                        className={`font-medium capitalize ${order.paymentStatus === "complete" ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
        
      </Accordion>
    </div>
  );
}
