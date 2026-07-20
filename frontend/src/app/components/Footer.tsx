"use client";

import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Phone, Mail, MapPin, Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#172337] text-white text-xs pt-12 pb-6 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-10">
          
          {/* ABOUT */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">ABOUT</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/about-us" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/about-us" className="hover:underline">About BookKart</Link></li>
              <li><Link href="/book-sell" className="hover:underline">Sell Books</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">BookKart Wholesale</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">Corporate Information</Link></li>
            </ul>
          </div>

          {/* HELP */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">HELP</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/how-it-works" className="hover:underline">Payments</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">Shipping & Delivery</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">Cancellation & Returns</Link></li>
              <li><Link href="/how-it-works" className="hover:underline">FAQ & Help Center</Link></li>
            </ul>
          </div>

          {/* CONSUMER POLICY */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">CONSUMER POLICY</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/privacy-policy" className="hover:underline">Cancellation & Return</Link></li>
              <li><Link href="/terms-of-use" className="hover:underline">Terms Of Use</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Security & Privacy</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Sitemap</Link></li>
              <li><Link href="/terms-of-use" className="hover:underline">EPR Compliance</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">SOCIAL</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:underline">Facebook</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">YouTube</a></li>
              <li><a href="#" className="hover:underline">Instagram</a></li>
            </ul>
          </div>

          {/* REGISTERED OFFICE ADDRESS */}
          <div className="col-span-2 md:col-span-1 space-y-3 border-t md:border-t-0 md:border-l border-gray-700 pt-6 md:pt-0 md:pl-6">
            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">REGISTERED OFFICE</h3>
            <div className="text-gray-300 leading-relaxed space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                BookKart Private Limited <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              </p>
              <p>Buildings Alyssa, Begonia & Clove Embassy Tech Village,</p>
              <p>Outer Ring Road, Devarabeesanahalli Village,</p>
              <p>Bengaluru, 560103, Karnataka, India</p>
              <p className="pt-2 font-bold text-white">CIN: U51109KA2012PTC066107</p>
            </div>
          </div>

        </div>

        {/* Flipkart Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-400 text-[11px]">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <Store className="w-4 h-4 text-yellow-400" /> Become a Seller
            </span>
            <span className="flex items-center gap-1.5 text-white font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> 100% Buyer Protection
            </span>
          </div>

          <p>© 2026 BookKart.com. All rights reserved.</p>

          <div className="flex items-center gap-2">
            <span className="bg-gray-800 text-gray-200 font-bold px-2 py-0.5 rounded-2xs">VISA</span>
            <span className="bg-gray-800 text-gray-200 font-bold px-2 py-0.5 rounded-2xs">MasterCard</span>
            <span className="bg-gray-800 text-gray-200 font-bold px-2 py-0.5 rounded-2xs">UPI</span>
            <span className="bg-gray-800 text-gray-200 font-bold px-2 py-0.5 rounded-2xs">Razorpay</span>
            <span className="bg-gray-800 text-gray-200 font-bold px-2 py-0.5 rounded-2xs">NetBanking</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
