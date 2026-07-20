"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

const articles = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=1200&auto=format&fit=crop&q=80",
    title: "Where and how to sell old books online in India?",
    description: "Get started with selling your used books online and earn money from your old books.",
    category: "SELLING GUIDE",
    readTime: "5 min read",
    date: "Jan 12, 2025",
    content: [
      {
        heading: "Why Sell Your Old Books Online?",
        body: "Every year, millions of books sit on shelves collecting dust. Selling them online not only declutters your space but also puts money back in your pocket — and gives those books a second life with someone who truly wants them.",
      },
      {
        heading: "Step 1 — Assess Your Books",
        body: "Before listing anything, go through your collection. Look for books in good condition — minimal highlighting, intact spines, no water damage. Textbooks, popular fiction, and non-fiction titles tend to sell fastest.",
      },
      {
        heading: "Step 2 — Choose BookKart Platform",
        body: "BookKart is ideal for used books in India, connecting you directly with local buyers with zero listing fees and instant UPI payouts.",
      },
      {
        heading: "Step 3 — Price It Right",
        body: "Check what similar books are selling for on the platform. A good rule of thumb: price used books at 30–50% of the original cover price.",
      },
    ],
  },
  {
    id: 2,
    imageSrc: "https://cdn.pixabay.com/photo/2019/09/19/12/43/portrait-4489207_1280.jpg",
    title: "What to do with your old bookshelf collection?",
    description: "Learn about different ways to make use of your old books and get value from them.",
    category: "BOOK CARE",
    readTime: "4 min read",
    date: "Jan 18, 2025",
    content: [
      {
        heading: "Don't Just Throw Them Away",
        body: "Old books have more value than you might think. Whether they're worn paperbacks or pristine hardcovers, there are many ways to give them a new purpose beyond your shelf.",
      },
      {
        heading: "Sell Them on BookKart",
        body: "The most straightforward option — sell your books on BookKart and earn cash. Even books you think no one wants might find a buyer.",
      },
      {
        heading: "Donate to Libraries or Schools",
        body: "Local schools, community libraries, and NGOs often welcome book donations. Children's books and educational materials are always in high demand.",
      },
    ],
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=1200&auto=format&fit=crop&q=80",
    title: "How BookKart makes used book buying simple",
    description: "Discover how BookKart helps you buy and sell used books online easily.",
    category: "PLATFORM STORY",
    readTime: "3 min read",
    date: "Jan 25, 2025",
    content: [
      {
        heading: "BookKart — India's Premier Book Marketplace",
        body: "BookKart is an online platform dedicated to buying and selling used books in India. Whether you're a student looking for affordable textbooks or a reader hunting for out-of-print titles.",
      },
      {
        heading: "How It Works for Buyers & Sellers",
        body: "Create a free account, list your books with photos and descriptions, set your price, and wait for buyers. Once a sale is made, ship the book or arrange local pickup.",
      },
    ],
  },
];

interface ReadMorePageProps {
  articleId?: number;
  onBack?: () => void;
  selectArticle: (id: number) => void;
}

export default function ReadMorePage({ articleId, onBack, selectArticle }: ReadMorePageProps) {
  const article = articles.find((a) => a.id === articleId) || articles[0];
  const otherArticles = articles.filter((a) => a.id !== article.id);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [articleId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Story link copied to clipboard!");
  };

  return (
    <main className="min-h-screen bg-[#f1f2f6] text-gray-900 font-sans pb-12">
      {/* Sticky Flipkart Top Bar */}
      <nav className="sticky top-0 z-50 bg-[#2874f0] text-white px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-bold text-xs bg-white/10 hover:bg-white/20 text-white rounded-xs px-4 py-2 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBookmarked(!bookmarked);
                toast.success(bookmarked ? "Removed from bookmarks" : "Bookmarked story");
              }}
              className={`p-2 rounded-xs border transition ${
                bookmarked ? "bg-yellow-400 text-gray-900 border-yellow-400 font-bold" : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* Hero Image Card */}
        <div className="relative w-full h-[360px] rounded-sm overflow-hidden border border-gray-200 bg-white shadow-xs">
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4">
            <span className="bg-[#2874f0] text-white text-[10px] font-extrabold px-3 py-1 rounded-2xs flex items-center gap-1 shadow-xs uppercase tracking-wider">
              <Tag className="w-3 h-3" /> {article.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-2 text-white">
            <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-yellow-300" /> {article.readTime}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
          </div>
        </div>

        {/* Article Content Container */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
          <p className="text-gray-700 text-sm font-semibold leading-relaxed border-b border-gray-100 pb-4">
            {article.description}
          </p>

          <div className="space-y-6">
            {article.content.map((section, i) => (
              <div key={i} className="space-y-2">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-[#2874f0] font-black text-xs flex items-center justify-center border border-blue-100">
                    {i + 1}
                  </span>
                  {section.heading}
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed pl-8">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#2874f0] text-white rounded-sm p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black">Ready to Declutter Your Library?</h3>
            <p className="text-xs text-blue-100 mt-1">Join thousands of readers buying and selling books on BookKart.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/books">
              <button className="bg-white text-[#2874f0] font-bold text-xs px-5 py-2.5 rounded-xs hover:bg-gray-100 transition cursor-pointer">
                BUY BOOKS
              </button>
            </Link>
            <Link href="/book-sell">
              <button className="bg-yellow-400 text-gray-900 font-bold text-xs px-5 py-2.5 rounded-xs hover:bg-yellow-300 transition cursor-pointer">
                SELL BOOKS
              </button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}