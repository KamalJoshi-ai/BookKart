"use client";

import Image from "next/image";
import React from "react";

interface Step {
  step: string;
  title: string;
  description: string;
  image: {
    src:string,
    alt:string
  };
}

const steps: Step[] = [
 
      {
        step: "Step 1",
        title: "Seller posts an Ad",
        description:
          "Seller posts book on book kart to sell their used books.",
        image: { src: "/icons/ads.png", alt: "Post Ad" },
      },
      {
        step: "Step 2",
        title: "Buyer Pays Online",
        description:
          "Buyer makes an online payment to book kart to buy those books.",
        image: { src: "/icons/pay_online.png", alt: "Payment" },
      },
      {
        step: "Step 3",
        title: "Seller ships the books",
        description: "Seller then ships the books to the buyer",
        image: { src: "/icons/fast-delivery.png", alt: "Shipping" },
      },
   
];

const HowItWorks: React.FC = () => {
  return (
    <section className=" py-12   container ">
      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">
        How does it work?
      </h3>

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.step}
            className="bg-linear-to-br from-amber-50 to-amber-100 p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all duration-200"
          >
            <span className="inline-block bg-black text-white text-sm font-semibold px-3 py-1 rounded-lg mb-3">
            {step.step}
            </span>

            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {step.title}
            </h3>
            <p className="text-gray-600 mb-5 text-sm">{step.description}</p>

            <div className="flex justify-center mt-4">
              <Image
                src={step.image.src}
                alt={step.image.alt}
                width={100}
                height={100}
                className="object-contain w-24 h-24 md:w-28 md:h-28"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
