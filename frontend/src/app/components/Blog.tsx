// components/BlogSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, Library, Store } from "lucide-react";
import ReadMorePage from "./ReadMorePage";

const blogPosts = [
  {
    id: 1,
    imageSrc: "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60",
    title: "Where and how to sell old books online?",
    description: "Get started with selling your used books online and earn money from your old books.",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
  },
  {
    id: 2,
    imageSrc: "https://cdn.pixabay.com/photo/2019/09/19/12/43/portrait-4489207_1280.jpg",
    title: "What to do with old books?",
    description: "Learn about different ways to make use of your old books and get value from them.",
    icon: <Library className="w-6 h-6 text-primary" />,
  },
  {
    id: 3,
    imageSrc: "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60",
    title: "What is BookKart?",
    description: "Discover how BookKart helps you buy and sell used books online easily.",
    icon: <Store className="w-6 h-6 text-primary" />,
  },
];

export default function BlogSection({
  onSelectArticle,
}: {
  onSelectArticle: (id: number) => void;
}) {
  

  return (
    <section className="py-20 bg-[rgb(221,234,254)]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-extrabold text-center mb-14 tracking-tight text-gray-900">
          Read from our <span className="text-primary">BLOG</span>
        </h2>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="group h-full flex flex-col overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 p-0"
            >
              <CardContent className="p-0 flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={post.imageSrc}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="p-6 flex flex-col grow">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-3 text-gray-800">
                    <div className="bg-primary/10 p-3 rounded-full text-primary">
                      {post.icon}
                    </div>
                    <span className="grow">{post.title}</span>
                  </h3>

                  <p className="text-gray-600 text-sm grow leading-relaxed">
                    {post.description}
                  </p>

                  <Button
                    variant="link"
                    onClick={() =>onSelectArticle(post.id)}
                    className="mt-6 mx-auto cursor-pointer self-start text-primary font-medium hover:text-primary/80 flex items-center transition-colors duration-200"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}