"use client";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle,
  Phone,
  BookOpen,
  ShoppingBag,
  Truck,
  CreditCard,
  RefreshCw,
  Shield,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "Buying Books",
    icon: <ShoppingBag className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600",
    questions: [
      {
        q: "How do I buy a book on BookKart?",
        a: "Browse or search for books, click on a listing, and press 'Buy Now'. Complete payment and the seller will ship the book to your address.",
      },
      {
        q: "Are the books in good condition?",
        a: "Each listing shows the book's condition — Good, Very Good, or Like New. Read the seller's description carefully before purchasing.",
      },
      {
        q: "Can I return a book if it's not as described?",
        a: "Yes. If the book significantly differs from the listing description, you can raise a return request within 7 days of delivery.",
      },
    ],
  },
  {
    category: "Selling Books",
    icon: <BookOpen className="w-5 h-5" />,
    color: "bg-yellow-100 text-yellow-600",
    questions: [
      {
        q: "How do I list a book for sale?",
        a: "Go to 'Sell Used Book', fill in the book details, upload clear photos, set your price, and publish the listing. It's free to list.",
      },
      {
        q: "When do I get paid?",
        a: "Payment is transferred to your UPI or bank account within 2-3 business days after the buyer confirms delivery.",
      },
      {
        q: "What books can I sell on BookKart?",
        a: "You can sell textbooks, novels, competitive exam books, children's books, and most non-fiction. Adult-only or illegal content is not allowed.",
      },
    ],
  },
  {
    category: "Delivery & Shipping",
    icon: <Truck className="w-5 h-5" />,
    color: "bg-green-100 text-green-600",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Delivery typically takes 3-7 business days depending on the seller's location and your pin code.",
      },
      {
        q: "Who pays for shipping?",
        a: "Shipping charges are shown at checkout. Some sellers offer free shipping on their listings.",
      },
      {
        q: "How do I track my order?",
        a: "Once the seller ships, you'll receive a tracking link via email. You can also track from 'My Orders' in your account.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    icon: <CreditCard className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-600",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept UPI, debit/credit cards, net banking, and wallets via Razorpay secure payment gateway.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 5-7 business days after the return is approved and the book is received by the seller.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through Razorpay which is PCI-DSS compliant. We never store your card details.",
      },
    ],
  },
  {
    category: "Account & Security",
    icon: <Shield className="w-5 h-5" />,
    color: "bg-red-100 text-red-600",
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click 'Login', then 'Forgot Password'. Enter your email and we'll send you a reset link.",
      },
      {
        q: "Can I change my registered email?",
        a: "Yes. Go to My Profile > Edit Profile and update your email. A verification link will be sent to your new email.",
      },
      {
        q: "How do I delete my account?",
        a: "Contact our support team at support@bookkart.in with your registered email and we'll process the deletion within 7 days.",
      },
    ],
  },
  {
    category: "Returns & Cancellations",
    icon: <RefreshCw className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600",
    questions: [
      {
        q: "Can I cancel an order?",
        a: "You can cancel before the seller ships. Once shipped, cancellation is not possible — you'll need to raise a return request after delivery.",
      },
      {
        q: "How do I raise a return request?",
        a: "Go to My Orders, select the order, and click 'Return'. Describe the issue and upload photos. Our team will review within 24 hours.",
      },
    ],
  },
];

const contactOptions = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Us",
    description: "We reply within 24 hours",
    value: "support@bookkart.in",
    color: "bg-blue-500",
    action: "mailto:support@bookkart.in",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Live Chat",
    description: "Mon–Sat, 9am to 6pm",
    value: "Start a chat",
    color: "bg-green-500",
    action: "#",
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Call Us",
    description: "Mon–Sat, 10am to 5pm",
    value: "+91 98765 43210",
    color: "bg-orange-500",
    action: "tel:+919876543210",
  },
];

export default function HelpSupportPage() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleQuestion = (key: string) => {
    setOpenQuestion(openQuestion === key ? null : key);
  };

  const filteredFaqs = faqs
    .map((cat) => ({
      ...cat,
      questions: cat.questions.filter(
        (q) =>
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) =>
      searchQuery
        ? cat.questions.length > 0
        : activeCategory
        ? cat.category === activeCategory
        : true
    );

  return (
    <main className="min-h-screen bg-[rgb(221,234,254)]">

      {/* Hero */}
      <section className="bg-primary py-16 px-4 text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            How can we help you?
          </h1>
          <p className="text-white/80 mb-8 text-lg">
            Search our help centre or browse topics below
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-gray-800 border-0 rounded-2xl h-14 pl-5 pr-14 text-base shadow-xl placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-yellow-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-12">

        {/* Contact Options */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {contactOptions.map((opt, i) => (
            <a
              key={i}
              href={opt.action}
              className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group"
            >
              <div className={`${opt.color} text-white p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform`}>
                {opt.icon}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{opt.title}</p>
                <p className="text-xs text-gray-500 mb-1">{opt.description}</p>
                <p className="text-xs font-semibold text-primary">{opt.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Category Filter */}
        {!searchQuery && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === null
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              All Topics
            </button>
            {faqs.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category === activeCategory ? null : cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeCategory === cat.category
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* FAQ Sections */}
        <div className="space-y-6">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-md">
              <p className="text-gray-400 text-lg">No results found for "{searchQuery}"</p>
              <p className="text-gray-400 text-sm mt-2">Try a different search term</p>
            </div>
          ) : (
            filteredFaqs.map((cat) => (
              <div key={cat.category} className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">

                {/* Category Header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                  <div className={`${cat.color} p-2 rounded-lg`}>
                    {cat.icon}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg">{cat.category}</h2>
                  <span className="ml-auto text-xs text-gray-400 font-medium">
                    {cat.questions.length} articles
                  </span>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-50">
                  {cat.questions.map((item, qi) => {
                    const key = `${cat.category}-${qi}`;
                    const isOpen = openQuestion === key;
                    return (
                      <div key={qi}>
                        <button
                          onClick={() => toggleQuestion(key)}
                          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-800 text-sm pr-4">
                            {item.q}
                          </span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-5">
                            <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 rounded-xl p-4">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Still need help */}
        <div className="mt-10 bg-primary rounded-3xl p-8 text-center text-white shadow-lg">
          <h3 className="text-2xl font-extrabold mb-2">Still need help?</h3>
          <p className="text-white/80 mb-6 text-sm">
            Our support team is ready to assist you with any issue.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="mailto:support@bookkart.in">
              <Button className="bg-white text-primary hover:bg-white/90 font-bold px-6 rounded-xl">
                Email Support
              </Button>
            </a>
            <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-bold px-6 rounded-xl">
              Start Live Chat
            </Button>
          </div>
        </div>

      </div>
    </main>
  );
}