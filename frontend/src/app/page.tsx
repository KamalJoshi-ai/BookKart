// app/page.tsx (or your Home file)
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Camera, Tag, Wallet, Search, CreditCard, Truck } from "lucide-react";
import NewBooks from "./components/NewBooks";
import HeroBanner from "./components/HeroBanner";
import BlogSection from "./components/Blog";
import { Suspense } from "react";
import Loader from './loading'
const sellSteps = [
  {
    step: "Step 1",
    title: "Post an ad for selling used books",
    description: "Post an ad on BookKart describing your book details to sell your old books online.",
    icon: <Camera className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 2",
    title: "Set the selling price for your books",
    description: "Set the price for your books at which you want to sell them.",
    icon: <Tag className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 3",
    title: "Get paid into your UPI/Bank account",
    description: "You will get money into your account once you receive an order for your book.",
    icon: <Wallet className="h-8 w-8 text-primary" />,
  },
];

const buySteps = [
  {
    step: "Step 1",
    title: "Select the used books you want",
    description: "Search from over thousands of used books listed on BookKart.",
    icon: <Search className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 2",
    title: "Place the order by making payment",
    description: "Then simply place the order by clicking on the 'Buy Now' button.",
    icon: <CreditCard className="h-8 w-8 text-primary" />,
  },
  {
    step: "Step 3",
    title: "Get the books delivered at your doorstep",
    description: "The books will be delivered to you at your doorstep!",
    icon: <Truck className="h-8 w-8 text-primary" />,
  },
];
export const revalidate = 180;
// export const dynamic = "force-static";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Interactive Client Hero Banner */}
      <HeroBanner />

      {/* Server Rendered Content / Dynamic Components */}
     <Suspense fallback={<Loader/>}>
        <NewBooks />
      </Suspense>

      <Button
        size="lg"
        className="flex mt-10 mx-auto bg-yellow-500 px-8 py-6 rounded-xl lg:mb-10 mb-8"
      >
        <Link href="/books">
          <div className="text-sm">Explore More Books</div>
        </Link>
      </Button>

      {/* How to Sell */}
      <section className="py-16 bg-amber-50 hover:bg-amber-100/70 transition-all px-4">
        <div className="container mx-auto rounded">
          <div className="text-center font-bold mb-4">
            <h2 className="text-3xl font-semibold mb-4">
              How to SELL old books online on BookKart?
            </h2>
            <p className="text-gray-500 max-w-5xl mx-auto font-medium mb-8">
              Saving some good amount of money is as easy as selling your old
              books online with BookKart. Just follow these simple steps to get
              started:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-gray-900 " />
            {sellSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col h-full shadow-2xl rounded-xl ">
                <div className="bg-white rounded-xl p-18 shadow-lg text-center grow flex flex-col">
                  <div className="absolute top-5 left-14 -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm grow">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section className="py-16 bg-white/70 hover:bg-white/30 px-4">
        <div className="container mx-auto rounded">
          <div className="text-center font-bold mb-4">
            <h2 className="text-3xl font-semibold mb-4">
              How to BUY second hand books online on BookKart?
            </h2>
            <p className="text-gray-500 max-w-5xl mx-auto font-medium mb-8">
              Saving some good amount of money by buying used books is just 3
              steps away from you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed border-gray-500" />
            {buySteps.map((step, index) => (
              <div key={index} className="relative flex flex-col h-full shadow-2xl">
                <div className="bg-yellow-400 rounded-xl p-18 shadow-lg text-center grow flex flex-col">
                  <div className="absolute top-5 left-14 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    {step.step}
                  </div>
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm grow">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Client Blog Section */}
      <BlogSection />
    </main>
  );
}