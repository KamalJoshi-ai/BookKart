"use client";

import React from "react";
import Link from "next/link";
import { Star, Heart, ShoppingCart, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useGetProductsQuery } from "@/store/api";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slice/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";

export default function NewBooks() {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProductsQuery({ page: 1, limit: 12, sort: "newest" });
  const books = data?.products || [];

  const wishlist = useSelector((state: RootState) => state.wishlist?.items || []);

  const handleWishlistToggle = (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const isSaved = wishlist.some((item: any) => item.products?.includes(bookId));
    if (isSaved) {
      dispatch(removeFromWishlist(bookId));
      toast.success("Removed from Wishlist");
    } else {
      dispatch(addToWishlist(bookId));
      toast.success("Added to Wishlist");
    }
  };

  const handleAddToCart = (e: React.MouseEvent, book: any) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({
      _id: book._id,
      title: book.title,
      price: book.finalPrice || book.price,
      image: book.images?.[0],
      quantity: 1
    }));
    toast.success("Item added to Cart");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto my-6 px-4 py-12 text-center bg-white border border-gray-200">
        <div className="w-8 h-8 border-2 border-[#2874f0] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-6 px-2 sm:px-4">
      <div className="bg-white border border-gray-200 shadow-xs rounded-sm p-4 space-y-4">
        
        {/* Section Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              Latest Additions <span className="text-xs font-bold text-[#2874f0] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">Top Selection</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Handpicked used & refurbished books in immaculate condition</p>
          </div>

          <Link href="/books">
            <button className="bg-[#2874f0] text-white font-bold text-xs px-4 py-2 rounded-xs shadow-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1">
              VIEW ALL <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        {/* Flipkart Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.map((book: any) => {
            const price = book.finalPrice || book.price;
            const originalPrice = book.price > price ? book.price : Math.round(price * 1.4);
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            const img = book.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600";
            const isWishlisted = wishlist.some((item: any) => item.products?.includes(book._id));

            return (
              <Link 
                key={book._id}
                href={`/books/${book._id}`}
                className="group relative flex flex-col justify-between p-3 border border-gray-100 rounded-sm hover:shadow-lg transition bg-white"
              >
                {/* Image Stage */}
                <div className="relative w-full aspect-[3/4] mb-3 overflow-hidden flex items-center justify-center bg-gray-50 rounded-xs">
                  <img
                    src={img}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Wishlist Heart Top Right */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, book._id)}
                    className={`absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/90 shadow-xs hover:bg-white transition ${
                      isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  {/* Discount Badge Top Left */}
                  {discount > 0 && (
                    <span className="absolute top-1.5 left-1.5 bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-2xs">
                      {discount}% off
                    </span>
                  )}
                </div>

                {/* Details Stage */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 leading-tight group-hover:text-[#2874f0] transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{book.author || "Curated Book"}</p>
                  </div>



                  {/* Price Row */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-extrabold text-gray-900">₹{price}</span>
                        <span className="text-[11px] text-gray-400 line-through">₹{originalPrice}</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 block">
                        Free Delivery
                      </span>
                    </div>

                    {/* Quick Add Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, book)}
                      className="p-1.5 rounded-xs bg-gray-100 hover:bg-[#2874f0] text-gray-700 hover:text-white transition cursor-pointer"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}