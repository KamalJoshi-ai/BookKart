"use client";

import { useState } from "react";
import Link from "next/link";
import { Leaf, Droplet, Coins, ArrowRight, Sparkles, BookOpen } from "lucide-react";

export default function ImpactEstimator() {
  const [originalPrice, setOriginalPrice] = useState<number>(500);
  const [condition, setCondition] = useState<string>("good");
  const [genre, setGenre] = useState<string>("fiction");

  // resale percentage based on condition
  const getResaleMultiplier = (cond: string) => {
    switch (cond) {
      case "likenew":
        return 0.7;
      case "verygood":
        return 0.55;
      case "good":
        return 0.4;
      case "fair":
        return 0.25;
      default:
        return 0.4;
    }
  };

  const resalePrice = Math.round(originalPrice * getResaleMultiplier(condition));
  
  // environmental impact metrics per book
  const co2Prevented = 2.7; // kg CO2
  const waterSaved = 1200; // liters of water
  const treesSaved = 0.04; // fraction of a tree

  return (
    <section className="py-14 bg-white border-t border-b border-slate-100 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Tool
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Estimate Your Resale Value & Green Impact
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            See how much cash you can make by selling your old books, and see the environmental footprint you save!
          </p>
        </div>

        {/* Dynamic Widget Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-stretch">
          
          {/* Inputs Section */}
          <div className="md:col-span-6 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Book Details
              </h3>

              {/* Slider for Original Price */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-slate-600">Original Price (MRP)</label>
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    ₹{originalPrice}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹100</span>
                  <span>₹2000</span>
                </div>
              </div>

              {/* Condition Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-600 mb-2">Book Condition</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "likenew", label: "Like New", desc: "No wear or marks" },
                    { id: "verygood", label: "Very Good", desc: "Minor cover creases" },
                    { id: "good", label: "Good", desc: "Read but intact" },
                    { id: "fair", label: "Fair", desc: "Heavy shelf wear" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCondition(item.id)}
                      className={`text-left p-3 rounded-2xl border transition-all duration-200 ${
                        condition === item.id
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/10"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className={`text-[10px] ${condition === item.id ? "text-blue-100" : "text-slate-400"} mt-0.5`}>
                        {item.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selector */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Book Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="fiction">Fiction & Literature</option>
                  <option value="tech">Science, Tech & Coding</option>
                  <option value="business">Business & Finance</option>
                  <option value="exam">Academic & Competitive Exams</option>
                  <option value="children">Children & Comics</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200/60">
              <Link href="/book-sell" className="group flex items-center justify-between bg-slate-900 hover:bg-blue-600 text-white font-bold px-5 py-3.5 rounded-2xl transition-all duration-200">
                <span className="text-sm">List your book in seconds</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Outputs/Impact Section */}
          <div className="md:col-span-6 flex flex-col gap-4">
            
            {/* Value Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-lg shadow-blue-500/10">
              {/* background design circle */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-blue-50">
                  Est. Payout
                </span>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight">₹{resalePrice}</span>
                  <span className="text-blue-100 text-sm font-semibold">to ₹{Math.round(resalePrice * 1.25)}</span>
                </div>
                <p className="text-blue-100 text-xs mt-3 leading-relaxed max-w-sm">
                  Estimate calculated for a used {genre} book in {condition === "likenew" ? "like new" : condition} condition. Prices vary based on demand.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 bg-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Coins className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Direct Transfer</div>
                  <div className="text-[10px] text-blue-100">UPI/Bank Transfer once sold.</div>
                </div>
              </div>
            </div>

            {/* Environmental Impact Card */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    Ecological Footprint Prevented
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    Green Factor
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Water Saved */}
                  <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                      <Droplet className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-800 leading-none">{waterSaved}L</div>
                      <div className="text-[10px] text-slate-400 mt-1">Water Saved</div>
                    </div>
                  </div>

                  {/* CO2 Saved */}
                  <div className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <Leaf className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-lg font-black text-slate-800 leading-none">{co2Prevented}kg</div>
                      <div className="text-[10px] text-slate-400 mt-1">CO₂ Prevented</div>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-700 leading-relaxed mt-5">
                🌳 Saving 1 book stops <strong>{co2Prevented} kg of carbon</strong> emissions and saves <strong>{waterSaved} liters of water</strong> used in print paper production. By reselling, you prevent new book production footprints!
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
