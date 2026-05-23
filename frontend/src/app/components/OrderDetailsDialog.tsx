import { Order } from "@/app/types/orderType"
import React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Image from "next/image"

interface OrderDetailsDialogProps {
  order: Order
}


const OrderDetailsDialog = ({ order }: OrderDetailsDialogProps) => {
   
const statuses = ["pending", "processing", "shipped", "delivered"]
const currentIndex = statuses.indexOf(order?.status)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
<DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
  <DialogHeader>
    <DialogTitle className="text-2xl font-bold text-purple-600">
      Order Details
    </DialogTitle>
  </DialogHeader>

  <div className="mt-6 space-y-6">

    {/* Order Info */}
    <div>
      <p className="text-sm text-gray-500">
        Order ID: {order?._id}
      </p>

      <p className="text-sm text-gray-500 mt-1 capitalize">
        Status: {order?.status}
      </p>
    </div>

    {/* Progress Tracker */}
    <div className="relative flex justify-between items-center">

      {/* Progress Line Background */}
      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200" />

      {/* Progress Line Filled */}
      <div
        className="absolute top-5 left-0 h-1 bg-green-500 transition-all"
        style={{
          width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
        }}
      />

      {statuses.map((status, index) => {
        const isCompleted = index < currentIndex
        const isActive = index === currentIndex

        return (
          <div key={status} className="flex flex-col items-center z-10">

            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
              ${
                isCompleted
                  ? "bg-green-500 text-white"
                  : isActive
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1}
            </div>

            <span className="text-xs mt-2 capitalize">
              {status}
            </span>

          </div>
        )
      })}

    </div>

    <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
  <h3 className="font-semibold text-lg text-blue-800 mb-2">Items</h3>

  <div className="space-y-4">
    {order?.items?.map((items, index) => (
      <div key={index} className="flex items-center space-x-4">

        <Image
          src={items.product?.images[0]}
          alt={items.product?.title}
          width={60}
          height={60}
          className="rounded-md"
        />

        <div>
          <p className="font-medium">
            {items.product?.title}
          </p>

          <div className="flex gap-2">
            <p className="font-medium">{items.product?.subject}</p>

            {order.items.map(item => item.product?.author).join(", ")}
          </div>
          <p className="text-sm text-gray-600">Quantity:{items.quantity}</p>
        </div>

      </div>
    ))}
  </div>
</div>


<div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
  <h3 className="font-serif text-lg text-green-800 mb-2">
    Shipping Address
  </h3>

  <p>{order.shippingAddress[0].addressLine1}</p>

  <p>
    {order.shippingAddress[0].city}, {order.shippingAddress[0].state} -{" "}
    {order.shippingAddress[0].pincode}
  </p>
</div>

<div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
  <h3 className="font-serif text-lg text-green-800 mb-2">
    Payment Details
  </h3>

  <p>
    Order ID: {order?.paymentDetails?.razorpay_order_id}
  </p>

  <p>
    Payment ID: {order?.paymentDetails?.razorpay_payment_id}
  </p>

  <p>
    Amount: ₹{order.totalAmount}
  </p>
</div>

  </div>
</DialogContent>
    </Dialog>
  )
}

export default OrderDetailsDialog