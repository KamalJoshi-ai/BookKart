"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";

import { Heart, Loader2, Share, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import HowItWorks from "./howItWorks";

import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store/store";

import { addToCart } from "@/store/slice/cartSlice";

import toast from "react-hot-toast";

import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";

type Props = {
  product: any;
};

const BookDetailsClient = ({ product }: Props) => {
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(0);

  const [addToCartMutation, { isLoading: isAddToCart }] =
    useAddToCartMutation();

  const [addToWishlistMutation] = useAddToWishlistMutation();

  const [removeWishlistFromMutation] = useRemoveFromWishlistMutation();

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const wishlist = useSelector((state: RootState) => state.wishlist.items);

  const bookImages = product?.images || [];

  const isWishlisted = wishlist.some((item:any) =>
    item.products.includes(product._id),
  );

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const result = await addToCartMutation({
        productId: product._id,
        quantity: 1,
      }).unwrap();

      if (result.success && result.data) {
        dispatch(addToCart(result.data));
        toast.success(result.message || "Added to cart successfully");
      } 
      else {
        console.log(result?.message)
        throw new Error(result.message || "Login first");
      }
    } catch (error: any) {
     
      toast.error(error?.data?.message);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      return;
    }

    try {
      if (isWishlisted) {
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
          dispatch(removeFromWishlist(productId));

          toast.error("Failed to add to wishlist");
        }
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Check out this book: ${product.title}`,
          url: window.location.href,
        });
      } catch {
      }
    } else {
      navigator.clipboard.writeText(window.location.href);

      toast.success("Link copied!");
    }
  };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }

    return 0;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}

        <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>

          <span>/</span>

          <Link href="/books" className="text-blue-600 hover:underline">
            Books
          </Link>

          <span>/</span>

          <span className="text-gray-600">{product.category}</span>

          <span>/</span>

          <span className="font-medium text-gray-600">{product.title}</span>
        </nav>

        {/* Main Content */}

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Images */}

          <div className="w-full space-y-4 overflow-hidden">
            <div className="relative mx-auto h-50 w-full overflow-hidden rounded-xl border bg-white shadow-sm sm:h-[340px] md:h-[380px]">
              <Image
                src={bookImages[selectedImage]}
                alt={product.title}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />

              {calculateDiscount(product.price, product.finalPrice) > 0 && (
                <span className="absolute left-0 top-3 rounded-r-xl bg-orange-600 px-3 py-1 text-xs font-medium text-white sm:text-sm">
                  {calculateDiscount(product.price, product.finalPrice)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}

            <div className="flex justify-center gap-3 overflow-x-auto rounded-xl bg-orange-100/40 p-2 py-2">
              {bookImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square min-w-18 shrink-0 rounded-md border bg-white ${
                    selectedImage === index ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <Image
                    src={img}
                    alt="Book preview"
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}

          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  {product.title}
                </h1>

                <p className="text-sm text-gray-500">
                  Posted on {formatDate(product?.createdAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share className="mr-1 h-4 w-4" />
                  Share
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddToWishlist(product._id)}
                >
                  <Heart
                    className={`mr-1 h-4 w-4 ${
                      isWishlisted ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  Wishlist
                </Button>
              </div>
            </div>

            {/* Price */}

            <div className="space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-orange-600">
                  ₹{product.finalPrice}
                </span>

                {product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price}
                  </span>
                )}
              </div>

              {/* Cart Button */}

              <Button
                className={`w-full rounded-xl py-6 text-white sm:w-60 ${
                  !product.isAvailable
                    ? "bg-gray-400"
                    : "bg-blue-700 hover:bg-blue-800"
                }`}
                onClick={handleAddToCart}
                disabled={isAddToCart || !product.isAvailable}
              >
                {!product.isAvailable ? (
                  "Out of Stock"
                ) : isAddToCart ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                  </>
                )}
              </Button>

              <span className="ml-4 rounded-full bg-green-600 px-3 py-1 text-sm font-semibold text-white">
                {product?.quantity} left
              </span>
            </div>

            {/* Details Card */}

            <Card className="rounded-xl">
              <CardHeader>
                <CardTitle>Book Details</CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                <div>Author</div>
                <div>{product.author}</div>

                <div>Category</div>
                <div>{product.category}</div>

                <div>Subject</div>
                <div>{product.subject}</div>

                <div>Condition</div>
                <div>{product.condition}</div>

                <div>Edition</div>
                <div>{product.edition}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Description */}

        <div className="mt-10">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>

            <CardContent>
              <p className="leading-relaxed text-gray-700">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </div>

        <HowItWorks />
      </div>
    </div>
  );
};

export default BookDetailsClient;
