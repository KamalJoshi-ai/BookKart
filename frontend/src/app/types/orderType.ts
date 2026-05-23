export interface OrderItem {
  product: Product
  quantity: number
}
export interface Product {
  _id: string
  title: string
  author: string
  subject: string
  images: string[]
}
export interface PaymentDetails {
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
}
export interface Address {
  _id: string
  addressLine1: string
  addressLine2?: string | null
  phoneNumber: string
  city: string
  state: string
  pincode: string
}
export interface Order {
  _id: string
  user: string

  items: OrderItem[]

  totalAmount: number

  shippingAddress: Address[]

  paymentStatus: "pending" | "complete" | "failed"

  paymentMethod: string

  paymentDetails?: PaymentDetails
status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";

  createdAt: string
  updatedAt: string
}