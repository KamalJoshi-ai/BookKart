"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsQuery } from "@/store/api";

const NewBooks = () => {
  const {
    data,
    isLoading,
    error,
  } = useGetProductsQuery({
    page: 1,
    limit: 12,
    sort: "newest",
  });

  const [isMobile, setIsMobile] =
    useState(false);

  const [currentSlide, setCurrentSlide] =
    useState(0);

  const [isPaused, setIsPaused] =
    useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < 768);

    checkMobile();

    window.addEventListener(
      "resize",
      checkMobile
    );

    return () =>
      window.removeEventListener(
        "resize",
        checkMobile
      );
  }, []);

  const ITEMS_PER_SLIDE =
    isMobile ? 1 : 3;

  const books =
    data?.products || [];

  const totalSlides = Math.ceil(
    books.length / ITEMS_PER_SLIDE
  );

  useEffect(() => {
    if (isPaused || totalSlides === 0)
      return;

    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) =>
          (prev + 1) % totalSlides
      );
    }, 3500);

    return () => clearInterval(interval);

  }, [isPaused, totalSlides]);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + totalSlides) %
        totalSlides
    );
  };

  const nextSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev + 1) % totalSlides
    );
  };

  const calculateDiscount = (
    price: number,
    finalPrice: number
  ) => {
    if (
      price > finalPrice &&
      price > 0
    ) {
      return Math.round(
        ((price - finalPrice) / price) *
          100
      );
    }

    return 0;
  };

  if (isLoading) {
    return (
      <section className="py-8 bg-gray-50 text-center">
        <p className="text-gray-600">
          Loading books...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50 text-center">
        <p className="text-red-500 font-semibold">
          Failed to load books...
        </p>
      </section>
    );
  }

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          New Arrivals
        </h2>

        {books.length > 0 ? (

          <div className="relative">

            {/* SLIDER */}

            <div className="overflow-hidden">

              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentSlide * 100
                  }%)`,
                }}
              >

                {Array.from({
                  length: totalSlides,
                }).map((_, slideIndex) => (

                  <div
                    key={slideIndex}
                    className="w-full shrink-0"
                  >

                    <div
                      className={`grid ${
                        isMobile
                          ? "grid-cols-1"
                          : "grid-cols-1 md:grid-cols-3"
                      } gap-8`}
                    >

                      {books
                        .slice(
                          slideIndex *
                            ITEMS_PER_SLIDE,

                          slideIndex *
                            ITEMS_PER_SLIDE +
                            ITEMS_PER_SLIDE
                        )

                        .map((book: any) => (

                          <Card
                            key={book._id}
                            className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                            onMouseEnter={() =>
                              setIsPaused(true)
                            }
                            onMouseLeave={() =>
                              setIsPaused(false)
                            }
                          >

                            <CardContent className="p-3 flex flex-col h-full">

                              <Link
                                href={`/books/${book._id}`}
                              >

                                {/* IMAGE */}

                                <div className="relative w-full aspect-4/5 overflow-hidden rounded-md bg-gray-100">

                                  <Image
                                    src={
                                      book.images[0]
                                    }
                                    alt={book.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                  />

                                  {calculateDiscount(
                                    book.price,
                                    book.finalPrice
                                  ) > 0 && (

                                    <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">

                                      {calculateDiscount(
                                        book.price,
                                        book.finalPrice
                                      )}

                                      % OFF

                                    </span>
                                  )}
                                </div>

                                {/* TITLE */}

                                <h3 className="mt-4 text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">

                                  {book.title}

                                </h3>

                                {/* PRICE */}

                                <div className="flex items-center justify-between mt-2">

                                  <div className="flex items-center gap-2">

                                    <span className="text-lg font-bold text-orange-600">

                                      ₹{book.finalPrice}

                                    </span>

                                    {book.price && (

                                      <span className="text-sm text-gray-400 line-through">

                                        ₹{book.price}

                                      </span>
                                    )}
                                  </div>

                                  <span className="text-xs text-gray-500">

                                    {book.condition}

                                  </span>
                                </div>

                                {/* BUTTON */}

                                <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg">

                                  Buy Now

                                </Button>

                              </Link>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEFT BUTTON */}

            <button
              onClick={prevSlide}
              className="absolute -left-3.75 top-1/2 -translate-y-7 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition md:block hidden"
            >

              <ChevronLeft className="h-5 w-5 text-gray-700" />

            </button>

            {/* RIGHT BUTTON */}

            <button
              onClick={nextSlide}
              className="absolute -right-3.75 top-1/2 -translate-y-7 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition md:block hidden"
            >

              <ChevronRight className="h-5 w-5 text-gray-700" />

            </button>

            {/* DOTS */}

            <div className="flex justify-center mt-8 gap-2">

              {Array.from({
                length: totalSlides,
              }).map((_, index) => (

                <div
                  key={index}
                  onClick={() =>
                    setCurrentSlide(index)
                  }
                  className={`h-2.5 w-2.5 rounded-full cursor-pointer transition-all ${
                    currentSlide === index
                      ? "bg-orange-500 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

        ) : (

          <p className="text-center text-gray-500">
            No books available
          </p>

        )}
      </div>
    </section>
  );
};

export default NewBooks;