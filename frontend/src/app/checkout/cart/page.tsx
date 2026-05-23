"use client";

import NoData from "@/app/components/NoData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useGetOrderByIdQuery,
  useCreateRazorpayPaymentMutation,
} from "@/store/api";
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
import { clearCart, setCart } from "@/store/slice/cartSlice";
import { toggleLoginDialog } from "@/store/slice/user-slice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";
import {
  resetCheckout,
  setCheckoutStep,
  setOrderId,
} from "@/store/slice/checkoutSlice";

import { RootState } from "@/store/store";
import {
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  Shield,
  ShoppingCart,
  Trash2Icon,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import { Address } from "@/app/types/Adrress";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CheckoutAddress from "@/app/components/CheckoutAddress";
import BookLoader from "@/lib/BookLoader";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);

  const { orderId, step } = useSelector((state: RootState) => state.checkout);

  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  /* ================= API HOOKS ================= */
  const {
  data: cartData,
  isLoading: isCartLoading,
} = useGetCartQuery(user._id, {
  skip: !user?._id,
});
  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addToWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistFromMutation] = useRemoveFromWishlistMutation();
  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const [createRazorpayPayment] = useCreateRazorpayPaymentMutation();

  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId!,
    { skip: !orderId },
  );

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  /* ================= CART ================= */

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeCartMutation(productId).unwrap();

      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item from cart");
    }
  };

  /* ================= WISHLIST ================= */

  const handleAddToWishlist = async (productId: string) => {
    const isWishlist = wishlist.some((item) =>
      item.products.includes(productId),
    );

    try {
      if (isWishlist) {
        dispatch(removeFromWishlist(productId));
        try {
          const result = await removeWishlistFromMutation(productId).unwrap();
          toast.success(result.message);
        } catch {
          dispatch(addToWishlist(productId));
          toast.error("Failed to remove from wishlist");
        }
      } else {
        dispatch(addToWishlist(productId));
        try {
          const result = await addToWishlistMutation(productId).unwrap();
          toast.success(result.message);
        } catch {
          dispatch(addToWishlist(productId)); // rollback
          toast.error("Failed to remove from wishlist");
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* ================= ADDRESS ================= */

  const handleSelectedAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
    dispatch(setCheckoutStep("payment"));
  };

  /* ================= CHECKOUT ================= */
  const handleProceedCheckout = async () => {
    if (step === "cart") {
      // Just move to next step, no API call
      dispatch(setCheckoutStep("address"));
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {

    setIsProcessing(true);

    try {
      const orderResult = await createOrUpdateOrder({
        totalAmount: finalAmount,
        shippingAddress: selectedAddress,
        paymentMethod: "razorpay",
      }).unwrap();
 

      if (!orderResult.success) {
        toast.error("Failed to create order");
        return;
      }

      const orderId = orderResult.data._id;

      // Step 2 - Create Razorpay payment
      const paymentData = await createRazorpayPayment({ orderId }).unwrap();
     
      const razorpayOrder = paymentData.data.order;

      // Step 3 - Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Book Kart",
        description: "Book Purchase",
        order_id: razorpayOrder.id,

        // Step 4 - Handle successful payment
        handler: async (response: RazorpayResponse) => {
          try {
            const result = await createOrUpdateOrder({
              orderId,
              paymentDetails: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            }).unwrap();

            if (result.success) {
              dispatch(clearCart());
              dispatch(resetCheckout());
              toast.success("Payment successful");
              router.push(`/checkout/payment-success/${orderId}`);
            }
          } catch {
            toast.error(
              "Payment successful but order update failed. Contact support.",
            );
          }
        },

        prefill: {
          name: orderData?.data?.user?.name,
          email: orderData?.data?.user?.email,
          contact: orderData?.data?.user?.phoneNumber,
        },

        theme: {
          color: "#3399cc",
        },
      };

      // Step 5 - Open Razorpay modal
      const razorpay = new window.Razorpay(options);

      // Step 6 - Handle payment failure
      razorpay.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });

      razorpay.open();
    } catch {
      toast.error("Payment initiation failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  /* ================= TOTALS ================= */

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0,
  );

  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  const totalDiscount = totalOriginalAmount - totalAmount;

  const totalShipping = cart.items.reduce(
    (total, item) => total + Number(item.product.shippingCharge),
    0,
  );

  const finalAmount = parseFloat((totalAmount + totalShipping).toFixed(2));

  /* ================= LOADING ================= */

  if (isCartLoading || isOrderLoading) return <BookLoader />;

  /* ================= USER CHECK ================= */

  if (!user) {
    return (
      <NoData
        message="Please log in to access your cart."
        description="Login required."
        buttonText="Login"
        imageUrl="/images/login.jpg"
        onClick={() => dispatch(toggleLoginDialog())}
      />  
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your cart is empty"
        description="Add books to continue"
        buttonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Top Title */}
        <div className="mb-6 text-gray-700 font-medium">
          {cart.items.length} {cart.items.length === 1 ? "item" : "items"} in
          your cart
        </div>

        {/* Checkout Steps */}
        <div className="flex items-center gap-4 mb-10 text-sm">
          <div className="flex items-center gap-2 text-gray-500">
            <span
              className={` p-2 rounded-full ${step === "cart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              <ShoppingCart />
            </span>
            Cart
          </div>

          <ChevronRight />

          <div className="flex items-center gap-2 text-gray-500">
            <span
              className={` p-2 rounded-full ${step === "address" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              <MapPin />
            </span>
            Address
          </div>

          <ChevronRight />

          <div className="flex items-center gap-2 text-gray-500">
            <span
              className={` p-2 rounded-full ${step === "payment" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              <CreditCard />
            </span>
            Payment
          </div>
        </div>

        {selectedAddress && (
          <Card className="mt-6 mb-6 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Delivery Address</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-1">
                <p>{selectedAddress?.state}</p>

                {selectedAddress?.addressLine1 && (
                  <p>{selectedAddress.addressLine1}</p>
                )}

                <p>
                  {selectedAddress.city}, {selectedAddress.state}{" "}
                  {selectedAddress.pincode}
                </p>

                <p>Phone: {selectedAddress.phoneNumber}</p>
              </div>

              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setShowAddressDialog(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Change Address
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="md:col-span-2 bg-white border rounded-xl shadow-sm p-6">
            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Order Summary</h2>
              <p className="text-sm text-gray-500">Review your items</p>
            </div>

            {/* Cart Items */}
            <div className="space-y-6">
              {cart.items.map((item) => (
                <Card
                  key={item._id}
                  className="border rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-5">
                    {/* Book Image */}
                    <div className="relative w-full sm:w-28 h-44 sm:h-36 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item?.product?.images?.[0]}
                        alt={item?.product?.title}
                        fill
                        className="object-cover cursor-pointer"
                        onClick={() =>
                          router.push(`/books/${item.product._id}`)
                        }
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col justify-between flex-1">
                      {/* Title + Quantity */}
                      <div>
                        <h3 className="font-semibold text-lg leading-snug">
                          {item?.product?.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item?.quantity}
                        </p>

                        {/* Price */}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="line-through text-gray-400 text-sm">
                            ₹{item?.product?.price}
                          </span>

                          <span className="text-lg font-semibold text-gray-900">
                            ₹{item?.product?.finalPrice}
                          </span>
                        </div>

                        {/* Shipping */}
                        <p className="text-sm text-green-600 mt-1">
                          Shipping: ₹{item?.product?.shippingCharge}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveItem(item?.product?._id)}
                        >
                          <Trash2Icon /> Remove
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleAddToWishlist(item?.product?._id)
                          }
                        >
                          <Heart
                            className={`h-4 w-4 mr-1 ${wishlist.some((w) => w.products.includes(item?.product?._id)) ? "fill-red-500" : ""}`}
                          />
                          <span className="hidden sm:inline">Wishlist</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Price Details */}
          <div className="border rounded-xl p-6 shadow-lg bg-white h-fit">
            <h3 className="font-semibold mb-4">Price Details</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>Price ({cart.items.length})</span>
              <span>₹{totalOriginalAmount}</span>
            </div>

            <div className="flex justify-between text-sm text-green-600 mb-2">
              <span>Discount</span>
              <span>- ₹{totalDiscount}</span>
            </div>

            <div className="flex justify-between text-sm mb-4">
              <span>Delivery Charges</span>
              <span className="text-yellow-600">+ ₹{totalShipping}</span>
            </div>

            <hr className="mb-4" />

            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>

            {/* Buttons */}
            <button
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg mb-3 hover:bg-blue-700 transition"
              disabled={isProcessing}
              onClick={handleProceedCheckout}
            >
              {isProcessing ? (
                "Processing..."
              ) : step === "payment" ? (
                <>
                  <CreditCard className="h-5 w-5" />
                  Continue To Pay
                </>
              ) : (
                <>
                  <ChevronRight className="h-5 w-5" />
                  {step === "cart"
                    ? "Proceed to Checkout"
                    : "Proceed to Payment"}
                </>
              )}
            </button>

            {step != "cart" && (
              <button
                className="w-full border py-3 rounded-lg text-gray-600"
                onClick={() =>
                  dispatch(
                    setCheckoutStep(step == "address" ? "cart" : "address"),
                  )
                }
              >
                Go Back {}
              </button>
            )}

            <p className="  gap-2 flex justify-center items-center text-gray-600 text-center mt-4">
              <Shield className="h-4 w-4  " />
              <span className="text-sm">Safe and Secure Payments</span>
            </p>
          </div>
        </div>

        <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Select Shipping Address</DialogTitle>
            </DialogHeader>

            <CheckoutAddress
              onAddressSelect={handleSelectedAddress}
              selectedAddressId={selectedAddress?._id}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Page;


// for razorpay script tag
// Page Load

// As soon as the browser encounters that <script> tag, it fetches the JavaScript file from Razorpay’s CDN (checkout.js).

// Script Execution

// The file is parsed and executed immediately.

// This registers the Razorpay Checkout object (window.Razorpay) globally in your page.

// Your Code Usage

// You don’t see anything happen right away.

// The script just makes Razorpay’s checkout functions available.

// When you later call:

// js
// var rzp = new Razorpay(options);
// rzp.open();
// → that’s when the Razorpay payment popup actually appears.