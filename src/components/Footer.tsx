'use client';

import React from 'react';
import Link from 'next/link';
import { Blobatar } from '@/components/ui/Blobatar';
import { ShieldCheck, Lock, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mascot Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform">
                <Blobatar name="Foodwok Kitchen" size={44} silhouette="organic" animate={true} />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white block">
                  Foodwok
                </span>
                <span className="text-xs font-semibold text-[#EB3223] tracking-wide uppercase">
                  Authentic Nigerian Cuisine
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Party jollof rice, smoky native delicacies, and fiery savouries — prepared fresh in our Lagos kitchens and delivered hot straight to your doorstep.
            </p>

            {/* Compliance & Security Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Paystack PCI-DSS Secured</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#EB3223]" />
                <span>NDPA 2023 Compliant</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Explore Menu
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Our Menu
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Cart & Checkout
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Account Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Legal & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EB3223]"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms#allergen-policy" className="hover:text-white transition-colors text-slate-400">
                  Allergen Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/terms#cancellation-policy" className="hover:text-white transition-colors text-slate-400">
                  Cancellation & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              Kitchen & Support
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>Victoria Island & Lekki Phase 1, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="tel:+2348000000000" className="hover:text-white transition-colors">
                  +234 800 000 0000
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <a href="mailto:support@foodwok.ng" className="hover:text-white transition-colors">
                  support@foodwok.ng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Foodwok Restaurant Nigeria. All rights reserved.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-[#EB3223] fill-[#EB3223]" />
            <span>for Nigerian food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
