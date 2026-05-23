"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { formatDistanceToNow } from "date-fns";
import { useSearchParams } from "next/navigation";
import {  filters } from "@/lib/Constant";
import Link from "next/link";
import React, { useState } from "react";
import BookLoader from "@/lib/BookLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetProductsQuery } from "@/store/api";

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const bookPerPage = 1;
const { data, isLoading,isFetching } = useGetProductsQuery({
  page: currentPage,
  limit: bookPerPage,
  search,
  condition: selectedCondition,
  classType: selectedType,
  category: selectedCategory,
  sort: sortOption,
});
  
  
  const toggleFilter = (section: string, item: string) => {
    
    const updateFilter = (prev: string[]) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];

    switch (section) {
      case "condition":
        setSelectedCondition(updateFilter);
        break;
      case "classType":
        setSelectedType(updateFilter);
        break;
      case "category":
        setSelectedCategory(updateFilter);
        break;
    }
    setCurrentPage(1);
  };

 

  const paginatedBooks =
data?.products || [];

const totalPages =
data?.totalPages || 1;

  const handlePageChange = (page: number) => setCurrentPage(page);

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return formatDistanceToNow(d, { addSuffix: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-slate-100 to-blue-100 text-gray-800">
      
      <div className="container mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link
            href="/"
            className="text-indigo-600 hover:underline font-medium"
          >
            Home
          </Link>
          <span>/</span>
          <span>Books</span>
        </nav>

        <h1 className="mb-8 text-4xl font-extrabold text-gray-800">
          Explore <span className="text-indigo-600">1000+</span> Used Books
        </h1>

        <div className="grid gap-10 md:grid-cols-[280px_1fr]">
          {/* ---------- FILTER SECTION ---------- */}
          <div className="space-y-6">
            <Accordion
              type="multiple"
              className="bg-white/90 backdrop-blur-md p-6 border border-gray-200 rounded-2xl shadow-md"
            >
              {Object.entries(filters).map(([key, values]) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-lg font-semibold text-indigo-600 ">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="mt-3 space-y-2">
                      {values.map((value) => {           
                        const id = `${key}-${value}`;
                        const checked =
                          key === "condition"
                            ? selectedCondition.includes(value)
                            : key === "classType"
                            ? selectedType.includes(value)
                            : selectedCategory.includes(value);

                        return (
                          <div
                            key={value}
                            className="flex items-center space-x-2"
                          >
                            <input
                              id={id}
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFilter(key, value)}
                              className="h-4 w-4 rounded border-gray-400 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={id}
                              className="text-sm font-medium cursor-pointer select-none text-gray-700 hover:text-indigo-600"
                            >
                              {value}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* ---------- BOOKS SECTION ---------- */}
          <div className="space-y-6">
            {isLoading ? (
              <BookLoader />
            ) : paginatedBooks.length ? (
              <>
                <div className="sm:flex justify-between items-center">
                  <div className="mb-6 text-xl font-semibold text-indigo-700">
                    Buy Second Hand Books Online
                  </div>

                  {/* Sort Dropdown */}
                  <Select value={sortOption} onValueChange={setSortOption}>
                    <SelectTrigger className="w-45 border border-gray-300 bg-white text-gray-700 rounded-lg px-2 py-1">
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 text-gray-700">
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Books Grid */}
                <div className="relative">
 {isFetching && (
    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex justify-center items-center">
      <BookLoader />
    </div>
  )}
   <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedBooks.map((book:any) => (
                    <Card
                      key={book._id}
                      className="group p-0 relative overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-lg hover:shadow-indigo-200/70 hover:-translate-y-1 transition-all duration-300"
                    >
                      <CardContent className="p-0">
                        <Link href={`/books/${book._id}`} className="block">
                          <div className="relative">
                            <Image
                              src={
                                book.images[0] 
                              }
                              alt={book.title}
                              width={400}
                              height={300}
                              className="h-[250px] w-full  transition-transform duration-300 group-hover:scale-105"
                            />

                            {/* Discount Badge */}
                            <div className="absolute left-0 top-0 z-10 flex flex-col gap-2 p-2">
                              {calculateDiscount(book.price, book.finalPrice) >
                                0 && (
                                <Badge className="bg-red-800 text-white text-xs px-2 py-1 rounded-md">
                                  {calculateDiscount(
                                    book.price,
                                    book.finalPrice
                                  )}
                                  % Off
                                </Badge>
                              )}
                            </div>

                            {/* Heart Button
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition duration-300 shadow-sm"
                            >
                              <Heart className="h-4 w-4 text-red-400" />
                            </Button> */}
                          </div>

                          {/* Book Details */}
                          <div className="p-4">
  <h3 className="font-semibold text-lg text-gray-800 group-hover:text-indigo-600 transition">
    {book.title}
  </h3>

  <p className="text-sm text-gray-600 mb-2">
    {book.author}
  </p>

  <div className="flex items-center gap-2 mb-2">
    <span className="text-indigo-600 font-semibold  text-xl">
      ₹{book.finalPrice}
    </span>

    {book.price > book.finalPrice && (
      <span className="text-gray-600 line-through text-sm">
        ₹{book.price}
      </span>
    )}
  </div>

  <div className="flex justify-between text-xs text-gray-500 mt-2">
    <span>{formatDate(book.createdAt)}</span>
    <span className="capitalize bg-gray-100 px-2 py-0.5 rounded">
      {book.condition}
    </span>
  </div>
</div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>


                </div>
               

                {/* Pagination */}
                <div className="flex justify-center items-center gap-3 mt-10">
                  <Button
                    variant="ghost"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-4 py-2 rounded-md font-medium transition-all ${
                        currentPage === i + 1
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-white border text-gray-700 hover:bg-indigo-50"
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="text-gray-500 hover:text-indigo-600 hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500 font-medium">
                No books found.
              </div>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
};

export default Page;
