

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"
import { 
  useCreateRazorpayPaymentMutation, 
  useCreateOrUpdateOrderMutation 
} from "@/store/api"
import {  resetCheckout } from "@/store/slice/checkoutSlice"
import { clearCart } from "@/store/slice/cartSlice"
import BookLoader from "@/lib/BookLoader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Loader2, Lock } from "lucide-react"

interface OrderData {
  items: any[]
  totalAmount: number
  shippingAddress: string
  user: {
    name: string
    email: string
    phoneNumber: string
  }
}

interface HandlePaymentProps {
  orderData: OrderData
  orderId?: string
}

const HandlePayment: React.FC<HandlePaymentProps> = ({ orderData, orderId }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation()
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation()
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const handlePayment = async () => {
    
    if (!orderId) {
      toast.error("No order found. please try again later")
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      console.log("Payment data:", orderData)

      // Step 1: Create Razorpay order
      const response = await createRazorpayPayment(orderId).unwrap()

      console.log("Razorpay response:", response)

      if (!response?.success || !response?.data?.order) {
        throw new Error("Failed to create razorpay order")
      }

      const razorpayOrder = response.data.order

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Book Kart",
        description: "Book Purchase",
        order_id: razorpayOrder.id,
        handler: async function (razorpayResponse: any) {
          try {
            console.log("Payment successful, updating order...")
            
            // Step 2: Verify payment and update order
            const result = await createOrUpdateOrder({
              updates: {
                orderId,
                paymentDetails: {
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature
                }
              }
            }).unwrap()

            if (result.success) {
              console.log("Order updated successfully")
              dispatch(clearCart())
              dispatch(resetCheckout())
              toast.success("Payment successful!")
              router.push(`/checkout/payment-success?orderId=${orderId}`)
            } else {
              throw new Error(result.message || "Failed to update order")
            }
          } catch (error: any) {
            console.error(" Error updating order:", error)
            toast.error(error?.message || "Payment successful, but failed to update order")
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            console.log(" Payment modal closed by user")
            toast.error("Payment cancelled")
            setIsProcessing(false)
          }
        }
      }

      console.log("🔄 Opening Razorpay modal...")
      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error: any) {
      console.error(" Payment initiation error:", error)
      const errorMessage = error?.data?.message || error?.message || "Failed to initiate payment"
      toast.error(errorMessage)
      setPaymentError(errorMessage)
      setIsProcessing(false)
    }
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <BookLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-slate-600">
            Secure payment powered by Razorpay
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200">
            <CardTitle className="text-slate-900">Order Summary</CardTitle>
            <CardDescription>Order ID: {orderId}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Order Items */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-semibold text-slate-900 mb-3">Items</h3>
                <div className="space-y-2">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm text-slate-700">
                      <span>{item.title || "Item"} x {item.quantity}</span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-semibold text-slate-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-slate-700">{orderData.shippingAddress}</p>
              </div>

              {/* Customer Details */}
              <div className="border-b border-slate-200 pb-4">
                <h3 className="font-semibold text-slate-900 mb-3">Customer Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name</span>
                    <span className="text-slate-900">{orderData.user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Email</span>
                    <span className="text-slate-900">{orderData.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Contact</span>
                    <span className="text-slate-900">{orderData.user.phoneNumber}</span>
                  </div>
                </div>
              </div>

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-slate-900">Total Amount</span>
                  <span className="text-3xl font-bold text-blue-600">
                    ₹{orderData.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {paymentError && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{paymentError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Method */}
        <Card className="mb-6 border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Payment Method
            </CardTitle>
            <CardDescription>
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-center text-slate-700 font-medium">
                💳 Razorpay Payment Gateway
              </p>
              <p className="text-center text-sm text-slate-500 mt-2">
                Accept all major credit cards, debit cards, and UPI
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 mr-2" />
                Pay ₹{orderData.totalAmount} Now
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full py-6 text-lg font-semibold"
          >
            Back to Cart
          </Button>
        </div>

        {/* Security Info */}
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">100% Secure</p>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  )
}

export default HandlePayment