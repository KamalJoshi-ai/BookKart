"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "BIG BOOK SALE",
    subtitle: "Up to 80% Off on Used Fiction, Tech & Exam Books",
    bgGradient: "from-blue-600 via-indigo-600 to-blue-800",
    badge: "BIG BILLION DEALS ⚡",
    buttonText: "SHOP NOW",
    href: "/books",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800"
  },
  {
    id: 2,
    title: "UNDER ₹199 CLEARANCE",
    subtitle: "Thousand+ Best Sellers Available at Unbeatable Prices",
    bgGradient: "from-amber-500 via-orange-600 to-red-600",
    badge: "LIMITED STOCK ⏱️",
    buttonText: "EXPLORE DEALS",
    href: "/books?sort=price-low",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800"
  },
  {
    id: 3,
    title: "SELL OLD BOOKS & EARN CASH",
    subtitle: "Instant UPI Payout + Free Doorstep Pickup Across 500+ Cities",
    bgGradient: "from-emerald-600 via-[#2874f0] to-blue-700",
    badge: "SELLER HUB 💰",
    buttonText: "LIST A BOOK",
    href: "/book-sell",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800"
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative max-w-7xl mx-auto my-3 px-2 sm:px-4">
      <div className="relative h-[240px] sm:h-[320px] rounded-sm overflow-hidden shadow-sm">
        
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-r ${banner.bgGradient} flex items-center justify-between p-6 sm:p-12 text-white ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Banner Left Content */}
            <div className="max-w-xl space-y-3">
              <span className="bg-yellow-400 text-gray-900 text-[10px] sm:text-xs font-black px-3 py-1 rounded-xs uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                <Tag className="w-3 h-3 fill-gray-900" /> {banner.badge}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {banner.title}
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-md line-clamp-2">
                {banner.subtitle}
              </p>
              <div className="pt-2">
                <Link href={banner.href}>
                  <button className="bg-white text-[#2874f0] font-black text-xs sm:text-sm px-6 py-2.5 rounded-xs shadow-md hover:bg-gray-100 transition cursor-pointer flex items-center gap-2">
                    {banner.buttonText} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Banner Right Image Visual */}
            <div className="hidden md:block relative w-48 h-60 shrink-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover rounded-md shadow-2xl border-2 border-white/20 transform rotate-3 hover:rotate-0 transition-transform"
              />
            </div>
          </div>
        ))}

        {/* Carousel Nav Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md rounded-r-md transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md rounded-l-md transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
