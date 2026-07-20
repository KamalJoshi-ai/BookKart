"use client";

import React, { Suspense, useState } from "react";
import CategoryStrip from "./components/CategoryStrip";
import HeroBanner from "./components/HeroBanner";
import DealsOfTheDay from "./components/DealsOfTheDay";
import NewBooks from "./components/NewBooks";
import ImpactEstimator from "./components/ImpactEstimator";
import BlogSection from "./components/Blog";
import ReadMorePage from "./components/ReadMorePage";
import Loader from "./loading";

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
    <main className="min-h-screen bg-[#f1f2f6] text-gray-900 font-sans pb-8">
      {/* 1. Flipkart Category Strip */}
      <CategoryStrip />

      {/* 2. Hero Promotional Carousel Banner */}
      <HeroBanner />

      {/* 3. Flipkart Deals of the Day (Timer Countdown) */}
      <DealsOfTheDay />



      {/* 5. Resale Calculator & Green Footprint */}
      <ImpactEstimator />

      {/* 6. Blog & Helpful Guides */}
      <BlogSection onSelectArticle={setSelectedArticle} />
    </main>
  );
}
