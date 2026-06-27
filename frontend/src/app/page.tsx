// app/page.tsx (or your Home file)
"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Tag, Wallet, Search, CreditCard, Truck, ArrowRight } from "lucide-react";
import NewBooks from "./components/NewBooks";
import HeroBanner from "./components/HeroBanner";
import BlogSection from "./components/Blog";
import { Suspense, useState } from "react";
import Loader from './loading'
import ReadMorePage from "./components/ReadMorePage";
import ImpactEstimator from "./components/ImpactEstimator";

const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description: "Post an ad on BookKart describing your book details to sell your old books online.",
    icon: <Camera className="h-7 w-7 text-amber-600" />,
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description: "Set the price for your books at which you want to sell them.",
    icon: <Tag className="h-7 w-7 text-amber-600" />,
  },
  {
    step: "Step 3",
    title: "Get paid into your UPI/Bank account",
    description: "You will get money into your account once you receive an order for your book.",
    icon: <Wallet className="h-7 w-7 text-amber-600" />,
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Select the used books you want",
    description: "Search from over thousands of used books listed on BookKart.",
    icon: <Search className="h-7 w-7 text-slate-800" />,
  },
  {
    step: "Step 2",
    title: "Place the order by making payment",
    description: "Then simply place the order by clicking on the 'Buy Now' button.",
    icon: <CreditCard className="h-7 w-7 text-slate-800" />,
  },
  {
    step: "Step 3",
    title: "Get the books delivered at your doorstep",
    description: "The books will be delivered to you at your doorstep!",
    icon: <Truck className="h-7 w-7 text-slate-800" />,
  },
];

export default function Home() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  
  if (selectedArticle !== null) {
    return (
      <ReadMorePage
        articleId={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        selectArticle={setSelectedArticle}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Interactive Client Hero Banner */}
      <HeroBanner />

      {/* Server Rendered Content / Dynamic Components */}
      <Suspense fallback={<Loader/>}>
        <NewBooks />
      </Suspense>

      <div className="flex justify-center mt-6 mb-10">
        <Link href="/books">
          <Button
            size="lg"
            className="group flex items-center gap-2 bg-slate-900 hover:bg-yellow-500 hover:text-slate-950 text-white font-bold px-8 py-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10 cursor-pointer"
          >
            Explore More Books
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Dynamic Creative Section: Value & Environmental Impact Estimator */}
      <ImpactEstimator />

      {/* How to Sell */}
      <section className="py-12 bg-amber-50 border-t border-b border-amber-100 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100/50 px-3 py-1.5 rounded-full">
              For Sellers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-3 mb-2 leading-tight">
              Sell old books online in 3 simple steps
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Reselling your books is fast, simple, and helps you declutter while putting extra cash in your pocket.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Wide Card (col-span-2) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-amber-200/50 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row items-start gap-4 md:gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                {sellSteps[0].icon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {sellSteps[0].step}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-1.5">{sellSteps[0].title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{sellSteps[0].description}</p>
              </div>
            </div>

            {/* Step 2: Regular Card (col-span-1) */}
            <div className="md:col-span-1 bg-white rounded-3xl p-6 md:p-8 border border-amber-200/50 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row md:flex-col items-start justify-between gap-4 md:gap-0">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-0 md:mb-5 shrink-0">
                {sellSteps[1].icon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {sellSteps[1].step}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-1.5">{sellSteps[1].title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{sellSteps[1].description}</p>
              </div>
            </div>

            {/* Step 3: Full-width Card (col-span-3) */}
            <div className="md:col-span-3 bg-gradient-to-br from-white to-amber-50/30 rounded-3xl p-6 md:p-8 border border-amber-200/50 hover:border-amber-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row items-start gap-4 md:gap-6">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shrink-0">
                {sellSteps[2].icon}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-600 bg-amber-100/50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {sellSteps[2].step}
                </span>
                <h3 className="font-extrabold text-slate-900 text-lg mt-3 mb-1.5">{sellSteps[2].title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{sellSteps[2].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section className="py-12 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full uppercase tracking-widest">
              For Buyers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-3 mb-2 leading-tight">
              Get the book you want in minutes
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find thousands of second-hand books and order safely at unbeatable prices.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Step 1: Regular Card (col-span-1) */}
            <div className="md:col-span-1 bg-yellow-400/90 hover:bg-yellow-400 text-slate-900 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row md:flex-col items-start justify-between gap-4 md:gap-0">
              <div className="w-14 h-14 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-0 md:mb-5 shrink-0">
                {buySteps[0].icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-md text-slate-800">
                  {buySteps[0].step}
                </span>
                <h3 className="font-extrabold text-slate-950 text-lg mt-3 mb-1.5">{buySteps[0].title}</h3>
                <p className="text-slate-800/80 text-sm leading-relaxed">{buySteps[0].description}</p>
              </div>
            </div>

            {/* Step 2: Wide Card (col-span-2) */}
            <div className="md:col-span-2 bg-yellow-400/90 hover:bg-yellow-400 text-slate-900 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row items-start gap-4 md:gap-6">
              <div className="w-14 h-14 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                {buySteps[1].icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-md text-slate-800">
                  {buySteps[1].step}
                </span>
                <h3 className="font-extrabold text-slate-950 text-lg mt-3 mb-1.5">{buySteps[1].title}</h3>
                <p className="text-slate-800/80 text-sm leading-relaxed">{buySteps[1].description}</p>
              </div>
            </div>

            {/* Step 3: Full-width Card (col-span-3) */}
            <div className="md:col-span-3 bg-gradient-to-br from-yellow-400 to-amber-400 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-3xl p-6 md:p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-row items-start gap-4 md:gap-6 border border-yellow-500/20">
              <div className="w-14 h-14 bg-white/40 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0">
                {buySteps[2].icon}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2.5 py-1 rounded-md text-slate-800">
                  {buySteps[2].step}
                </span>
                <h3 className="font-extrabold text-slate-950 text-lg mt-3 mb-1.5">{buySteps[2].title}</h3>
                <p className="text-slate-900/80 text-sm leading-relaxed">{buySteps[2].description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Client Blog Section */}
      <BlogSection onSelectArticle={setSelectedArticle} />
    </main>
  );
}
