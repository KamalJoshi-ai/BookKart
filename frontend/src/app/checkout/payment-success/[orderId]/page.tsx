"use client"

import { useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import confetti from "canvas-confetti"
import { motion } from "framer-motion"
import { CheckCircle, Package, Calendar } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BookLoader from "@/lib/BookLoader"
import { RootState } from "@/store/store"
import { useGetOrderByIdQuery } from "@/store/api"

const Page = () => {

  const router = useRouter()
  const dispatch = useDispatch()
 
const params = useParams()
const orderIdFromUrl = params.orderId as string
  // fallback from redux
  const reduxOrderId = useSelector(
    (state: RootState) => state.checkout.orderId
  )

  const orderId = orderIdFromUrl || reduxOrderId

  const { data: orderData, isLoading } =
    useGetOrderByIdQuery(orderId || "", { skip: !orderId })

  /* ================= CONFETTI ================= */

  useEffect(() => {

    if (!orderId) {
      router.push("/checkout/cart")
      return
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    })

  }, [orderId, router])

  /* ================= LOADING ================= */

  if (isLoading) {
    return <BookLoader />
  }

  const order = orderData?.data

  /* ================= UI ================= */

  return (

    <div className="min-h-screen/90 flex items-center justify-center bg-gray-200 p-6">

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >

        <Card className="shadow-2xl bg-white bg-opacity-90 backdrop-blur-sm">

          {/* ================= HEADER ================= */}

          <CardHeader className="text-center border-b pb-6">

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>

            <CardTitle className="text-3xl font-bold text-green-700">
              Payment Successful 
            </CardTitle>

            <p className="text-gray-600 mt-2">
              Thank you for your purchase. Your order has been confirmed.
            </p>

          </CardHeader>

          {/* ================= CONTENT ================= */}

     <CardContent className="p-6 max-w-4xl mx-auto">
  <h3 className="font-semibold text-base md:text-lg text-gray-700 mb-3 pl-1">
    Order Details
  </h3>

  {/* Two-column responsive grid */}
  <div className="grid md:grid-cols-2 gap-6">
    {/* Left column */}
    <div className="bg-blue-50 p-4 rounded-lg space-y-2 h-full">
      <p className="text-sm text-gray-600">
        Order ID:
        <span className="font-medium text-blue-700 ml-2">{order?._id}</span>
      </p>
      <p className="text-sm text-gray-600">
        Date:
        <span className="font-medium text-blue-700 ml-2">
          {new Date(order?.createdAt).toLocaleDateString()}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Total Amount:
        <span className="font-medium text-blue-700 ml-2">
          ₹{order?.totalAmount.toFixed(2)}
        </span>
      </p>
      <p className="text-sm text-gray-600">
        Items:
        <span className="font-medium text-blue-700 ml-2">
          {order?.items?.length}
        </span>
      </p>
    </div>

    {/* Right column */}
    <div className="bg-green-50 p-4 rounded-lg h-full flex flex-col justify-between">
      <div>
        <h4 className="font-semibold text-green-700 mb-2">Order Status</h4>
        <div className="flex items-center text-green-600">
          <Package className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">
            {order?.status?.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  </div>
</CardContent>

        </Card>

      </motion.div>

    </div>
  )
}

export default Page