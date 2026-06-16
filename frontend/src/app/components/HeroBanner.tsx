
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

const bannerImages = [
  "/images/book1.jpg",
  "/images/book2.jpg",
  "/images/book3.jpg",
];

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[700px] overflow-hidden">
      {bannerImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={`Banner Image ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}
      <div className="relative container mx-auto h-full flex flex-col items-center justify-center text-white text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 z-10">
          Buy and Sell Old Books Online in India
        </h1>
        <div className="flex flex-col sm:flex-row gap-6">
          <Button
            size="lg"
            className="group bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <Link href="/books">
                <div className="text-left">
                  <div className="text-sm opacity-90">Start Shopping</div>
                  <div className="font-semibold">Buy used Books</div>
                </div>
              </Link>
            </div>
          </Button>

          <Button
            size="lg"
            className="group bg-linear-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-800 text-black px-8 py-6 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-black/20 p-2 rounded-lg group-hover:bg-black/30 transition-colors">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <Link href="/book-sell">
                <div className="text-left">
                  <div className="text-sm opacity-90">Start Selling</div>
                  <div className="font-semibold">Sell Old Books</div>
                </div>
              </Link>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}