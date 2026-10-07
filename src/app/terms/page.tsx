'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Blobatar } from '@/components/ui/Blobatar';
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Truck,
  RotateCcw,
  Scale,
  HelpCircle,
  ChevronRight,
  UtensilsCrossed,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Account Registration & Eligibility' },
  { id: 'orders-pricing', title: '3. Orders, Pricing & Currency' },
  { id: 'payments', title: '4. Paystack Payments & Billing' },
  { id: 'allergens', title: '5. Food Preparation & Allergen Disclaimer' },
  { id: 'delivery', title: '6. Dispatch, Delivery & Rider Logistics' },
  { id: 'cancellations', title: '7. Cancellations, Refunds & Complaints' },
  { id: 'conduct', title: '8. User Conduct & Acceptable Use' },
  { id: 'ip', title: '9. Intellectual Property' },
  { id: 'liability', title: '10. Limitation of Liability & Force Majeure' },
  { id: 'governing-law', title: '11. Governing Law & Dispute Resolution' },
  { id: 'contact', title: '12. Contact & Customer Support' },
];

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState('acceptance');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Header */}
        <section className="bg-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-[#EB3223]">
                  <Scale className="w-3.5 h-3.5" />
                  <span>Legal & Customer Agreement</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  Terms of Service
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                  These terms govern your use of Foodwok’s online food ordering service, customer accounts, payment processing, and hot food delivery across Nigeria.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Last Updated: October 2026
                  </span>
                  <span>•</span>
                  <span>Version 2.4</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Jurisdiction: Lagos, Nigeria</span>
                </div>
              </div>

              {/* Concierge Avatar card with Blobatar */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 flex items-center gap-4 max-w-xs shrink-0 shadow-lg">
                <Blobatar name="Foodwok Legal Desk" size={48} silhouette="round" animate={true} />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Questions about our terms?</span>
                  <p className="text-[11px] text-slate-400">Our customer support team is available 8am–10pm daily.</p>
                  <a
                    href="mailto:support@foodwok.ng"
                    className="text-xs font-semibold text-[#EB3223] hover:underline inline-block pt-1"
                  >
                    support@foodwok.ng
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sticky Table of Contents Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#EB3223]" />
                    <span>Table of Contents</span>
                  </h2>
                  <nav className="space-y-1">
                    {SECTIONS.map((sec) => {
                      const isActive = activeSection === sec.id;
                      return (
                        <button
                          key={sec.id}
                          onClick={() => scrollToSection(sec.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                            isActive
                              ? 'bg-red-50 text-[#EB3223] font-bold shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <span className="truncate">{sec.title}</span>
                          {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Quick Summary Highlights Box */}
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/60 rounded-3xl p-5 text-amber-950 space-y-3">
                  <h3 className="text-xs font-bold flex items-center gap-2 text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>Key Highlights</span>
                  </h3>
                  <ul className="text-xs space-y-2 text-amber-900/90 leading-relaxed font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Zero card storage: Payments are processed directly through Paystack.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Perishable food: Orders cannot be cancelled once cooking commences in the kitchen.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>Delivery handover: Riders wait up to 10 minutes at your landmark.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Terms Document Body */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs space-y-12 text-slate-700 text-sm leading-relaxed">
              {/* Section 1 */}
              <section id="acceptance" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">1.</span> Acceptance of Terms
                </h2>
                <p>
                  Welcome to <strong>Foodwok</strong> (&quot;Foodwok&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). These Terms of Service constitute a legally binding agreement between you (&quot;Customer&quot;, &quot;you&quot;, or &quot;your&quot;) and Foodwok Restaurant Nigeria, governing your access to and use of the Foodwok website (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">foodwok.ng</code>), our web applications, order checkout systems, customer profiles, and hot meal delivery services.
                </p>
                <p>
                  By browsing our menu, registering an account, or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms of Service, along with our{' '}
                  <Link href="/privacy" className="text-[#EB3223] font-semibold hover:underline">
                    Privacy Policy
                  </Link>. If you do not agree with any part of these terms, you must not use our website or place an order.
                </p>
              </section>

              {/* Section 2 */}
              <section id="eligibility" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">2.</span> Account Registration & Eligibility
                </h2>
                <p>
                  To place orders and access features such as saved delivery addresses and real-time order tracking, you may create a Foodwok customer account. By creating an account, you represent and warrant that:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You are at least 18 years of age or possess legal parental/guardian authorization to enter into contracts in Nigeria.</li>
                  <li>All information you provide—including your First Name, Last Name, active Nigerian phone number (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">+234...</code>), and email address—is accurate, current, and complete.</li>
                  <li>You are responsible for maintaining the confidentiality of your account credentials, passwords, and one-time passcodes (OTPs). You agree to notify us immediately at <a href="mailto:support@foodwok.ng" className="text-[#EB3223] font-medium hover:underline">support@foodwok.ng</a> if you suspect unauthorized access.</li>
                  <li>Each customer is permitted one primary customer account. Foodwok reserves the right to suspend or terminate accounts that provide misleading information or engage in fraudulent activities.</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section id="orders-pricing" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">3.</span> Orders, Pricing & Currency
                </h2>
                <p>
                  All menu items, proteins (beef, chicken, goat meat, fish), sides (dodo/plantain, coleslaw, moi-moi), and drinks displayed on Foodwok are subject to real-time availability in our active kitchens.
                </p>
                <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2 text-xs">
                  <strong className="text-slate-900 block font-bold text-sm">Currency & Transparent Pricing:</strong>
                  <p>
                    All prices on Foodwok are denominated in <strong>Nigerian Naira (NGN / Kobo)</strong> and include all applicable state and federal taxes unless explicitly indicated otherwise.
                  </p>
                  <p>
                    Delivery fees are calculated dynamically based on your physical delivery address, estimated distance from our nearest kitchen hub (e.g. Victoria Island, Lekki), and route conditions.
                  </p>
                </div>
                <p>
                  Placing an item in your shopping cart does not reserve the item or lock its price until you successfully complete checkout and payment verification. While we make every effort to ensure accurate pricing and item descriptions, Foodwok reserves the right to rectify accidental clerical errors prior to order dispatch.
                </p>
              </section>

              {/* Section 4 */}
              <section id="payments" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-[#EB3223]" />
                  <span>4. Paystack Payments & Billing Security</span>
                </h2>
                <p>
                  All online payment transactions on Foodwok are securely processed through <strong>Paystack Payments Limited</strong>, an accredited, Central Bank of Nigeria (CBN)-licensed payment solution provider compliant with PCI-DSS Level 1 standards.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Foodwok Zero Card Storage Guarantee</span>
                  </div>
                  <p>
                    <strong>Foodwok never stores, handles, or has access to your full debit/credit card numbers, CVV security codes, card PINs, or online banking passwords.</strong>
                  </p>
                  <p>
                    When you click &quot;Pay Now&quot;, payment is conducted directly via Paystack’s encrypted gateway. Foodwok only receives a cryptographic transaction reference (<code className="text-[11px] bg-emerald-100/70 px-1.5 py-0.5 rounded">paystackReference</code>), payment confirmation status (<code className="text-[11px] bg-emerald-100/70 px-1.5 py-0.5 rounded">PAID</code>), and verification webhooks signed with HMAC SHA512 security keys.
                  </p>
                </div>
                <p>
                  If a debit occurs from your bank account but your order status fails to reflect as paid due to network timeouts, our system automatically runs reconciliation via Paystack verification webhooks. Alternatively, our customer support will manually confirm the reference with Paystack within minutes.
                </p>
              </section>

              {/* Section 5 */}
              <section id="allergens" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <UtensilsCrossed className="w-6 h-6 text-[#EB3223]" />
                  <span>5. Food Preparation & Allergen Disclaimer</span>
                </h2>
                <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Important Nigerian Culinary Allergen Notice</span>
                  </div>
                  <p>
                    Our meals are prepared in commercial kitchens that handle staple Nigerian ingredients including:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-amber-900/90 font-medium">
                    <li><strong>Groundnuts & Peanuts</strong> (used in suya spices, groundnut oils, and specialty soups)</li>
                    <li><strong>Crustaceans & Seafood</strong> (ground dried crayfish, stockfish, prawns, dried fish)</li>
                    <li><strong>Sesame seeds, locust beans (Iru/Ogiri), and tree nuts</strong></li>
                    <li><strong>High-intensity chili peppers</strong> (Scotch bonnet / Atarodo, Sombo, Cameroon pepper)</li>
                    <li><strong>Wheat & Gluten</strong> (in selected pasta, pastries, and breadings)</li>
                  </ul>
                </div>
                <p>
                  While our culinary team follows strict sanitary kitchen protocols, cross-contact between ingredients may occur during peak hours. If you suffer from a life-threatening or severe food allergy, you are strongly advised to inspect dish details carefully or consult our kitchen staff via order notes or customer support before ordering. Foodwok cannot guarantee an allergen-free environment for severe allergies.
                </p>
              </section>

              {/* Section 6 */}
              <section id="delivery" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-[#EB3223]" />
                  <span>6. Dispatch, Delivery & Rider Logistics</span>
                </h2>
                <p>
                  Foodwok coordinates delivery through dedicated dispatch riders and vetted third-party logistics courier partners across serviceable zones in Lagos, Nigeria.
                </p>
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-bold text-sm">Delivery Addresses & Landmarks:</strong>
                    <p>
                      You must provide an accurate street address and a recognisable nearby landmark (e.g. &quot;Opposite Zenith Bank&quot; or &quot;Beside Total Filling Station&quot;), along with an active phone number where the recipient can be reached immediately.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-bold text-sm">Estimated Delivery Times:</strong>
                    <p>
                      Estimated delivery intervals displayed (e.g. 30–45 minutes) are operational estimates based on kitchen cooking time and traffic flow. Heavy rainfall, severe traffic gridlock, security estate access checkpoints, or festive rushes may influence actual transit duration.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl space-y-1">
                    <strong className="text-slate-900 block font-bold text-sm">Handover & 10-Minute Waiting Policy:</strong>
                    <p>
                      When the dispatch rider arrives at your address or estate gate, they will contact you via phone or SMS. Riders are instructed to wait a maximum of <strong>10 minutes</strong>. If the customer or recipient is unreachable after reasonable contact attempts, the order may be marked undeliverable to preserve food safety standards, without eligibility for a refund.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section id="cancellations" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <RotateCcw className="w-6 h-6 text-[#EB3223]" />
                  <span>7. Cancellations, Refunds & Quality Complaints</span>
                </h2>
                <div className="space-y-3">
                  <p>
                    Because Foodwok prepares fresh, cooked-to-order, perishable food, special cancellation rules apply:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Cancellation Window:</strong> You may cancel an order only before the kitchen marks the order status as <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-800">preparing</code> on our Kitchen Display System (KDS). Once meal cooking has commenced, orders cannot be cancelled or recalled.
                    </li>
                    <li>
                      <strong>Incorrect or Missing Items:</strong> If an order arrives with missing dishes, incorrect proteins, or damaged packaging, you must notify Foodwok Support within <strong>2 hours</strong> of receipt with photographic evidence of the meal package and receipt slip.
                    </li>
                    <li>
                      <strong>Remedies:</strong> Where a fault is confirmed on our end, Foodwok will promptly dispatch the missing item at no additional charge, issue a replacement meal, or credit your account / original Paystack account with the corresponding amount.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 8 */}
              <section id="conduct" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">8.</span> User Conduct & Acceptable Use
                </h2>
                <p>When using our website and receiving deliveries, you agree NOT to:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>Harass, abuse, threaten, or discriminate against our kitchen personnel, dispatch riders, or customer service representatives.</li>
                  <li>Initiate fraudulent chargebacks or dispute legitimate Paystack transactions after receiving completed orders.</li>
                  <li>Attempt to disrupt, reverse-engineer, scan, or scrape the Foodwok platform or API endpoints.</li>
                  <li>Provide fictitious addresses, stolen credit cards, or fraudulent phone numbers during checkout.</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="ip" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">9.</span> Intellectual Property
                </h2>
                <p>
                  All content, branding, trademarks, logos, culinary photographs, website code, graphical interfaces, and copy on Foodwok are the intellectual property of Foodwok Restaurant Nigeria. No part of our platform or media may be copied, reproduced, republished, or commercialized without our prior written consent.
                </p>
              </section>

              {/* Section 10 */}
              <section id="liability" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-[#EB3223]">10.</span> Limitation of Liability & Force Majeure
                </h2>
                <p>
                  To the maximum extent permitted by applicable Nigerian law, Foodwok and its directors, employees, and logistics contractors shall not be liable for indirect, incidental, or consequential damages resulting from inability to access the site, brief delays caused by force majeure events (including severe storms, civil disturbances, road closures, or telecommunication network failures), or improper handling of food after successful handover.
                </p>
                <p>
                  Our total aggregate liability for any proven claim arising from an order shall not exceed the total amount paid by you for that specific order.
                </p>
              </section>

              {/* Section 11 */}
              <section id="governing-law" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Scale className="w-6 h-6 text-[#EB3223]" />
                  <span>11. Governing Law & Dispute Resolution</span>
                </h2>
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>.
                </p>
                <p>
                  Any dispute, controversy, or claim arising out of or relating to these terms or orders placed on Foodwok shall first be submitted to good-faith amicable negotiation between you and Foodwok management. If unresolved within 21 days, both parties submit to the exclusive jurisdiction of the competent courts of <strong>Lagos State, Nigeria</strong>.
                </p>
              </section>

              {/* Section 12 */}
              <section id="contact" className="space-y-4 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#EB3223]" />
                  <span>12. Contact & Customer Support</span>
                </h2>
                <p>
                  If you have questions, feedback, or concerns regarding these Terms of Service or an active order, please reach out directly:
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Blobatar name="Foodwok Care Team" size={56} silhouette="organic" animate={true} />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block text-base">Foodwok Customer Care Desk</span>
                      <p className="text-xs text-slate-500">Available Monday through Sunday, 8:00 AM – 10:00 PM WAT</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-700 pt-1">
                        <span>Email: <a href="mailto:support@foodwok.ng" className="text-[#EB3223] hover:underline">support@foodwok.ng</a></span>
                        <span>Phone: <a href="tel:+2348000000000" className="text-[#EB3223] hover:underline">+234 800 000 0000</a></span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-full bg-[#EB3223] text-white text-xs font-bold shadow-md hover:bg-[#d62819] transition-all shrink-0"
                  >
                    Back to Menu
                  </Link>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
