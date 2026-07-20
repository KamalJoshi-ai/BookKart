"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Zap, Star } from "lucide-react";
import { useGetProductsQuery } from "@/store/api";

export default function DealsOfTheDay() {
  const { data } = useGetProductsQuery({ page: 1, limit: 6, sort: "price-low" });
  const books = data?.products || [];

  // Countdown timer simulation (14h 22m 10s)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-4 px-2 sm:px-4">
      <div className="bg-white border border-gray-200 shadow-xs rounded-sm overflow-hidden">
        
        {/* Flipkart Deals Header Strip */}
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Deals of the Day</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-2xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#2874f0]" />
              <span className="font-bold text-[#2874f0]">
                {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s Left
              </span>
            </div>
          </div>

          <Link href="/books?sort=price-low">
            <button className="bg-[#2874f0] text-white font-bold text-xs px-5 py-2 rounded-xs shadow-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1 self-start sm:self-auto">
              VIEW ALL <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Horizontal Offers Carousel Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.slice(0, 6).map((book: any, idx: number) => {
            const price = book.finalPrice || book.price;
            const originalPrice = book.price > price ? book.price : price * 1.5;
            const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
            const img = book.images?.[0] || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600";

            return (
              <Link 
                key={book._id || idx}
                href={`/books/${book._id}`}
                className="group flex flex-col items-center p-3 border border-gray-100 rounded-sm hover:shadow-md transition text-center bg-white"
              >
                <div className="relative w-full aspect-[3/4] mb-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={img}
                    alt={book.title}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-1 left-1 bg-red-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-2xs">
                    {discount > 0 ? `${discount}% OFF` : "DEAL"}
                  </span>
                </div>

                <h3 className="font-semibold text-xs text-gray-800 line-clamp-1 group-hover:text-[#2874f0] transition-colors">
                  {book.title}
                </h3>
                <span className="text-xs font-bold text-emerald-700 mt-1">
                  Min. 40% Off
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5 truncate">
                  {book.category || "Top Seller"}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-bold text-gray-900 mt-1">
                  <span>₹{price}</span>
                  <span className="text-gray-400 line-through text-[10px]">₹{Math.round(originalPrice)}</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </div>
  );
}
