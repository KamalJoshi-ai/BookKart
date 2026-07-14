
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag, Search, ShieldCheck, Truck, Sparkles } from "lucide-react";

const bannerImages = [
  "/images/book1.jpg",
  "/images/book2.jpg",
  "/images/book3.jpg",
];

export default function HeroBanner() {
  const [currentImage, setCurrentImage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/books?search=${searchQuery.trim()}`);
    } else {
      router.push(`/books`);
    }
  };

  return (
    <section className="relative h-[650px] md:h-[700px] overflow-hidden flex items-center justify-center">
      {/* Background Images Slider */}
      {bannerImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=" "
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
          {/* Multi-layered dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/55 to-slate-900/90" />
        </div>
      ))}

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-md animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>India's Marketplace for Used Books</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
          Buy and Sell <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
            Used Books
          </span>{" "}
          Online in India
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
          Give books a second life! Buy pre-loved books at discount prices or easily list and sell yours to readers nationwide.
        </p>

        {/* Glassmorphic Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full lg:hidden max-w-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2.5 rounded-2xl flex items-center shadow-2xl mb-8 transition-all focus-within:border-yellow-500/50 focus-within:ring-2 focus-within:ring-yellow-500/10"
        >
          <div className="flex items-center px-3 text-slate-300 shrink-0">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search books by title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-sm md:text-base focus:outline-none focus:ring-0 pr-4"
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-yellow-500/10 text-sm"
          >
            Search
          </button>
        </form>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center mb-10">
          <Link href="/books" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full group bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-2xl transition-all duration-300 shadow-lg shadow-blue-600/15 hover:shadow-blue-500/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-3">
                <ShoppingBag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-75 font-normal">Start Shopping</div>
                  <div className="font-bold text-sm">Buy Used Books</div>
                </div>
              </div>
            </Button>
          </Link>

          <Link href="/book-sell" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full group bg-yellow-500 hover:bg-yellow-400 text-slate-950 px-8 py-6 rounded-2xl transition-all duration-300 shadow-lg shadow-yellow-500/15 hover:shadow-yellow-400/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-center gap-3">
                <Tag className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="text-xs opacity-75 font-normal">Make Extra Cash</div>
                  <div className="font-bold text-sm">Sell Used Books</div>
                </div>
              </div>
            </Button>
          </Link>
        </div>

        {/* Mini Trust Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 pt-4 border-t border-white/10 w-full max-w-2xl text-[11px] md:text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure Transactions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-sky-400" />
            <span>Doorstep Shipping</span>
          </div>
          
        </div>

      </div>
    </section>
  );
}
