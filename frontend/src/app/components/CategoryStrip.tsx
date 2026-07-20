"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Code, 
  TrendingUp, 
  Tag, 
  Store, 
  ShieldCheck 
} from "lucide-react";

const categories = [
  { name: "Top Offers", icon: <Tag className="w-5 h-5 text-amber-500" />, href: "/books?sort=newest" },
  { name: "Fiction & Novels", icon: <BookOpen className="w-5 h-5 text-blue-500" />, href: "/books?category=fiction" },
  { name: "Exams & Academics", icon: <GraduationCap className="w-5 h-5 text-emerald-500" />, href: "/books?category=exam" },
  { name: "Tech & Coding", icon: <Code className="w-5 h-5 text-violet-500" />, href: "/books?category=tech" },
  { name: "Best Sellers", icon: <TrendingUp className="w-5 h-5 text-red-500" />, href: "/books" },
  { name: "Used Book Clearance", icon: <Tag className="w-5 h-5 text-amber-500" />, href: "/books" },
  { name: "Sell Old Books", icon: <Store className="w-5 h-5 text-blue-600" />, href: "/book-sell" },
  { name: "BookKart Assured", icon: <ShieldCheck className="w-5 h-5 text-cyan-600" />, href: "/how-it-works" },
];

export default function CategoryStrip() {
  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-max gap-8 px-2">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform shadow-xs">
                {cat.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
