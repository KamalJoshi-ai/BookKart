"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Coins, Leaf, Droplet, ArrowRight, ShieldCheck, TrendingUp } from "lucide-react";

export default function ImpactEstimator() {
  const [originalPrice, setOriginalPrice] = useState<number>(500);
  const [condition, setCondition] = useState<string>("likenew");

  const getResaleMultiplier = (cond: string) => {
    switch (cond) {
      case "likenew": return 0.70;
      case "verygood": return 0.55;
      case "good": return 0.40;
      default: return 0.25;
    }
  };

  const resalePrice = Math.round(originalPrice * getResaleMultiplier(condition));
  const waterSaved = Math.round(originalPrice * 2.2);

  return (
    <div className="max-w-7xl mx-auto my-6 px-2 sm:px-4">
      <div className="bg-white border border-gray-200 shadow-xs rounded-sm p-6 space-y-6">
        
        {/* Header */}
        <div className="border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#2874f0] text-xs font-bold px-3 py-1 rounded-full mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> BookKart Resale Calculator
            </div>
            <h2 className="text-xl font-black text-gray-900">Estimate Resale Cash & Eco Savings</h2>
            <p className="text-xs text-gray-500">Calculate how much money you earn by selling your used books on BookKart</p>
          </div>

          <Link href="/book-sell">
            <button className="bg-[#fb641b] text-white font-bold text-xs px-6 py-2.5 rounded-xs shadow-xs hover:bg-[#e5560f] transition cursor-pointer flex items-center gap-1">
              SELL NOW <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Calculation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5 p-5 bg-gray-50 rounded-sm border border-gray-200">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-gray-700">Original Book Price (MRP)</span>
                <span className="font-extrabold text-[#2874f0] bg-white border border-blue-200 px-3 py-1 rounded-xs">
                  ₹{originalPrice}
                </span>
              </div>
              <input 
                type="range"
                min="100"
                max="2500"
                step="50"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2874f0]"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>₹100</span>
                <span>₹2,500</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">Book Condition</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "likenew", label: "Like New", desc: "No markings" },
                  { id: "verygood", label: "Very Good", desc: "Minor cover creases" },
                  { id: "good", label: "Good", desc: "Read but intact" },
                  { id: "fair", label: "Fair", desc: "Heavy wear" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCondition(item.id)}
                    className={`p-2.5 rounded-xs text-left border text-xs transition ${
                      condition === item.id 
                        ? "bg-blue-50 border-[#2874f0] text-[#2874f0] font-bold" 
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div>{item.label}</div>
                    <div className="text-[10px] text-gray-400 font-normal">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Payout Card */}
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-sm shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-2xs">
                  Instant UPI Payout
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black">₹{resalePrice}</span>
                  <span className="text-blue-100 text-xs font-semibold">to ₹{Math.round(resalePrice * 1.2)}</span>
                </div>
                <p className="text-[11px] text-blue-100 mt-2">
                  Direct transfer into your UPI/Bank account once buyer receives the order.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/20 flex items-center gap-2 text-xs text-white">
                <Coins className="w-4 h-4 text-yellow-300" />
                <span className="font-bold">Zero Listing Fee</span>
              </div>
            </div>

            {/* Eco Savings Card */}
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-900 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-2xs">
                  Green Footprint Saved
                </span>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-cyan-600" />
                    <span className="text-2xl font-black text-gray-900">{waterSaved} Liters</span>
                  </div>
                  <p className="text-[11px] text-gray-600">
                    Water saved in print production by reselling 1 book.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>100% Sustainable Re-commerce</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
