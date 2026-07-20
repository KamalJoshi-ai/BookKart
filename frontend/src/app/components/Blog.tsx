"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, Tag, Sparkles } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60",
    title: "Where and how to sell old books online in India?",
    description: "Get started with listing your used books online, pricing strategies, and receiving instant UPI payouts.",
    category: "SELLING GUIDE",
    readTime: "5 min read",
  },
  {
    id: 2,
    imageSrc: "https://cdn.pixabay.com/photo/2019/09/19/12/43/portrait-4489207_1280.jpg",
    title: "What to do with your old bookshelf collection?",
    description: "Discover smart ways to declutter your library, donate to students, or earn cash by reselling.",
    category: "BOOK CARE",
    readTime: "4 min read",
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60",
    title: "How BookKart makes used book buying simple",
    description: "Learn how BookKart's 12-point quality verification and zero-friction shipping saves you up to 70%.",
    category: "PLATFORM STORY",
    readTime: "3 min read",
  },
];

export default function BlogSection({
  onSelectArticle,
}: {
  onSelectArticle: (id: number) => void;
}) {
  return (
    <div className="max-w-7xl mx-auto my-6 px-2 sm:px-4">
      <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
        
        {/* Section Header */}
        <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#2874f0] text-xs font-bold px-3 py-1 rounded-full mb-1">
              <BookOpen className="w-3.5 h-3.5" /> BookKart Stories & Guides
            </div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Read from our Blog</h2>
            <p className="text-xs text-gray-500">Expert tips on reselling old books, decluttering your shelf, and finding rare titles</p>
          </div>
        </div>

        {/* Stories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onSelectArticle(post.id)}
              className="group flex flex-col justify-between border border-gray-200 hover:border-[#2874f0] rounded-sm overflow-hidden bg-white shadow-xs hover:shadow-md transition duration-300 cursor-pointer"
            >
              <div>
                {/* Thumbnail Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Category Pill Tag */}
                  <span className="absolute top-3 left-3 bg-[#2874f0] text-white font-extrabold text-[10px] px-2.5 py-1 rounded-2xs shadow-xs tracking-wider">
                    {post.category}
                  </span>

                  {/* Read Time Tag */}
                  <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white font-medium text-[10px] px-2 py-0.5 rounded-2xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-yellow-300" /> {post.readTime}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-gray-900 leading-snug group-hover:text-[#2874f0] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="px-5 pb-5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2874f0] group-hover:text-blue-700">
                <span>Read Full Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}