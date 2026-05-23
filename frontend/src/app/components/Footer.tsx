import {
  Clock,
  Facebook,
  HeadphonesIcon,
  Instagram,
  Shield,
  Twitter,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-linear-to-b from-gray-900 via-gray-950 to-black text-gray-400">
      {/* Top Section */}
      <div className="container mx-auto px-4 py-16 grid gap-12 md:grid-cols-4">
        {/* About Us */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white border-l-4 border-orange-500 pl-3">
            ABOUT US
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about-us"
                className="hover:text-orange-400 transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact-us"
                className="hover:text-orange-400 transition-colors"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white border-l-4 border-orange-500 pl-3">
            USEFUL LINKS
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/how-it-works"
                className="hover:text-orange-400 transition-colors"
              >
                How it Works?
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="hover:text-orange-400 transition-colors"
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white border-l-4 border-orange-500 pl-3">
            POLICIES
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/terms-of-use"
                className="hover:text-orange-400 transition-colors"
              >
                Terms of Use
              </Link>
            </li>
            <li>
              <Link
                href="/privacy-policy"
                className="hover:text-orange-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white border-l-4 border-orange-500 pl-3">
            STAY CONNECTED
          </h3>
          <div className="mb-4 flex space-x-4">
            {[Facebook, Instagram, Youtube, Twitter].map((Icon, idx) => (
              <Link
                key={idx}
                href="#"
                className="hover:text-orange-400 transition-transform transform hover:scale-110"
              >
                <Icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            BookKart is a free platform where you can buy and sell second-hand
            books online. Save money, find your next read, and give old books a
            new life.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800"></div>

      {/* Features Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <Shield className="h-6 w-6 text-orange-500" />,
                title: "Secure Payment",
                desc: "Your payment information is processed safely.",
              },
              {
                icon: <Clock className="h-6 w-6 text-orange-500" />,
                title: "BookKart Trust",
                desc: "Money transferred only after confirmation.",
              },
              {
                icon: <HeadphonesIcon className="h-6 w-6 text-orange-500" />,
                title: "Customer Support",
                desc: "Friendly 24/7 support to assist you anytime.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl bg-gray-800/40 p-6 hover:bg-gray-700/40 transition-colors"
              >
                <div className="rounded-full bg-gray-900 p-3">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-8">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-orange-500 font-medium">BookKart</span>. All
            rights reserved.
          </p>

          <div className="flex items-center space-x-6">
            {["visa.svg", "rupay.svg", "paytm.svg", "upi.svg"].map(
              (icon, i) => (
                <Image
                  key={i}
                  src={`/icons/${icon}`}
                  alt={icon.replace(".svg", "")}
                  height={28}
                  width={48}
                  className={`filter invert brightness-90 transition-transform hover:scale-110 ${
                    icon === "paytm.svg" ? "invert-0" : ""
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
