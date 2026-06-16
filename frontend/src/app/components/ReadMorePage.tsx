"use client";
import { ArrowLeft, Clock, BookOpen, Share2, Bookmark, Tag, } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const articles = [
  {
    id: 1,
    imageSrc:
      "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=1200&auto=format&fit=crop&q=80",
    title: "Where and how to sell old books online?",
    description:
      "Get started with selling your used books online and earn money from your old books.",
    category: "Selling Tips",
    readTime: "5 min read",
    date: "Jan 12, 2025",
    content: [
      {
        heading: "Why Sell Your Old Books Online?",
        body: "Every year, millions of books sit on shelves collecting dust. Selling them online not only declutters your space but also puts money back in your pocket — and gives those books a second life with someone who truly wants them.",
      },
      {
        heading: "Step 1 — Assess Your Books",
        body: "Before listing anything, go through your collection. Look for books in good condition — minimal highlighting, intact spines, no water damage. Textbooks, popular fiction, and non-fiction titles tend to sell fastest. Rare or out-of-print editions can fetch surprisingly high prices.",
      },
      {
        heading: "Step 2 — Choose the Right Platform",
        body: "BookKart is ideal for used books in India, connecting you directly with local buyers. Other options include Amazon Marketplace, OLX, and Facebook Marketplace. Each platform has different fee structures, so compare before listing.",
      },
      {
        heading: "Step 3 — Price It Right",
        body: "Check what similar books are selling for on the platform. A good rule of thumb: price used books at 30–50% of the original cover price. Textbooks and professional books can be priced higher due to demand.",
      },
      {
        heading: "Step 4 — Write a Good Listing",
        body: "Take clear photos in good lighting. Mention the edition, condition honestly, and any notable features. A detailed, honest listing builds trust and reduces returns or disputes.",
      },
      {
        heading: "Tips for Faster Sales",
        body: "Bundle related books for better value offers. Respond quickly to buyer inquiries. Offer free or discounted shipping for multiple purchases. The more active and responsive your profile, the more sales you'll close.",
      },
    ],
  },
  {
    id: 2,
    imageSrc:
      "https://cdn.pixabay.com/photo/2019/09/19/12/43/portrait-4489207_1280.jpg",
    title: "What to do with old books?",
    description:
      "Learn about different ways to make use of your old books and get value from them.",
    category: "Book Care",
    readTime: "4 min read",
    date: "Jan 18, 2025",
    content: [
      {
        heading: "Don't Just Throw Them Away",
        body: "Old books have more value than you might think. Whether they're worn paperbacks or pristine hardcovers, there are many ways to give them a new purpose beyond your shelf.",
      },
      {
        heading: "Sell Them",
        body: "The most straightforward option — sell your books on BookKart and earn cash. Even books you think no one wants might find a buyer. List them, price them fairly, and let someone else enjoy them.",
      },
      {
        heading: "Donate to Libraries or Schools",
        body: "Local schools, community libraries, and NGOs often welcome book donations. Children's books, educational material, and general fiction are always in demand. Your old collection could spark a love of reading in someone else.",
      },
      {
        heading: "Book Swaps",
        body: "Join or organize a book swap in your community. You give away books you've read and pick up ones you haven't. It's free, social, and sustainable — everyone wins.",
      },
      {
        heading: "Upcycle Creatively",
        body: "Old books can become art. Folded book sculptures, decorative stacks, journal covers, and even furniture using stacked hardcovers — there's a whole creative movement around repurposing books aesthetically.",
      },
    ],
  },
  {
    id: 3,
    imageSrc:
      "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=1200&auto=format&fit=crop&q=80",
    title: "What is BookKart?",
    description:
      "Discover how BookKart helps you buy and sell used books online easily.",
    category: "About Us",
    readTime: "3 min read",
    date: "Jan 25, 2025",
    content: [
      {
        heading: "BookKart — India's Used Book Marketplace",
        body: "BookKart is an online platform dedicated to buying and selling used books in India. Whether you're a student looking for affordable textbooks or a reader hunting for out-of-print titles, BookKart connects buyers and sellers simply and affordably.",
      },
      {
        heading: "How It Works for Sellers",
        body: "Create a free account, list your books with photos and a description, set your price, and wait for buyers. Once a sale is made, ship the book or arrange a local pickup. Payment is handled securely through the platform.",
      },
      {
        heading: "How It Works for Buyers",
        body: "Browse thousands of used book listings, filter by category, author, or price, and purchase directly from sellers. You get great books at a fraction of the original cost — often 50–70% cheaper than new.",
      },
      {
        heading: "Why BookKart?",
        body: "BookKart focuses exclusively on books, which means a better experience than general marketplaces. The community is built around readers, so you'll find people who genuinely care about the condition and quality of what they're selling.",
      },
      {
        heading: "Sustainability at the Core",
        body: "Every used book sold on BookKart is one less book that ends up in a landfill. By choosing used, buyers and sellers together reduce paper waste and carbon footprint — reading responsibly.",
      },
    ],
  },
];

interface ReadMorePageProps {
  articleId?: number;
  onBack?: () => void;
  selectArticle:(id:number)=>void
}

export default function ReadMorePage({ articleId , onBack,selectArticle }: ReadMorePageProps) {
 
  const article = articles.find((a) => a.id === articleId) || articles[0];
  const otherArticles = articles.filter((a) => a.id !== article.id);
  const [bookmarked, setBookmarked] = useState(false);
   useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  return (
    <main className="min-h-screen bg-[rgb(221,234,254)]">

      {/* Sticky Top Nav */}
      <nav className="sticky top-0 z-50 bg-[rgb(221,234,254)]/90 backdrop-blur-md border-b border-blue-200/60 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between max-w-4xl">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 font-semibold text-gray-800 hover:bg-white/70 rounded-xl px-4 py-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => setBookmarked(!bookmarked)}
              className={`rounded-xl px-3 py-2 transition-all ${
                bookmarked
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "hover:bg-white/70"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-white" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              className="rounded-xl px-3 py-2 hover:bg-white/70 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto max-w-4xl px-4 pb-20">

        {/* Hero Image */}
        <div className="relative w-full h-[420px] rounded-3xl overflow-hidden mt-8 shadow-2xl">
          <Image
            src={article.imageSrc}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-6 left-6">
            <span className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
          </div>

          {/* Title over image */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-white text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <span className="text-white/80 text-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span className="text-white/60 text-sm">•</span>
              <span className="text-white/80 text-sm">{article.date}</span>
              <span className="text-white/60 text-sm">•</span>
              <span className="text-white/80 text-sm flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                BookKart Blog
              </span>
            </div>
          </div>
        </div>

        {/* Description card */}
        <div className="bg-white rounded-3xl p-8 mt-6 shadow-md border border-blue-100">
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            {article.description}
          </p>
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-3xl p-8 mt-4 shadow-md border border-blue-100">
          <div className="space-y-8">
            {article.content.map((section, i) => (
              <div key={i}>
                <div className="flex items-start gap-4 mb-3">
                  <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-0.5">
                    <span className="text-primary font-bold text-sm">{i + 1}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 leading-snug">
                    {section.heading}
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-[15px] pl-12">
                  {section.body}
                </p>
                {i < article.content.length - 1 && (
                  <div className="border-b border-blue-100 mt-8" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-primary rounded-3xl p-8 mt-4 shadow-lg text-white text-center">
          <h3 className="text-2xl font-extrabold mb-2">Ready to get started?</h3>
          <p className="text-white/80 mb-6 text-sm">
            Join thousands of readers buying and selling books on BookKart.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
             <Link href="/books">
            <Button className="bg-white text-primary hover:bg-white/90 font-bold px-6 rounded-xl">
              Buy Books
            </Button>
            </Link>
             <Link href="/book-sell">
            <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold px-6 rounded-xl">
              Sell Books
            </Button>
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-10">
          <h3 className="text-xl font-extrabold text-gray-900 mb-4 tracking-tight">
            More from the Blog
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherArticles.map((a) => (
              <div
                key={a.id}
               onClick={() => {
  selectArticle?.(a.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={a.imageSrc}
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {a.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-bold text-gray-900 text-sm leading-snug mb-2">
                    {a.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {a.readTime}
                    <span>•</span>
                    {a.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}