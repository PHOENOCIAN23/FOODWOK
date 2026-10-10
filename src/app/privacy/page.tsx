'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  CreditCard,
  Truck,
  HardDrive,
  FileCheck,
  Clock,
  HelpCircle,
  ChevronRight,
  Cookie,
  Mail,
  Smartphone,
  MapPin,
  AlertCircle,
} from 'lucide-react';

const SECTIONS = [
  { id: 'overview', title: '1. Privacy Commitment & NDPA 2023' },
  { id: 'data-collected', title: '2. Information We Collect' },
  { id: 'permissions', title: '3. Customer Permissions & Consents' },
  { id: 'paystack-disclosure', title: '4. Paystack Payments & Zero Card Storage' },
  { id: 'kitchen-riders', title: '5. Kitchen Display (KDS) & Dispatch Riders' },
  { id: 'cookies-storage', title: '6. Cookies & Client LocalStorage' },
  { id: 'legal-basis', title: '7. Legal Basis for Data Processing' },
  { id: 'retention-security', title: '8. Data Security & Retention' },
  { id: 'customer-rights', title: '9. Your Rights Under Nigerian Law' },
  { id: 'third-parties', title: '10. Third-Party Service Providers' },
  { id: 'dpo-contact', title: '11. Data Protection Officer & Contact' },
];

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

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
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NDPA 2023 Compliant</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  Privacy Policy
                </h1>
                <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                  How Foodwok collects, uses, protects, and handles your personal details, delivery addresses, and payment references under the Nigeria Data Protection Act.
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    Last Updated: October 2026
                  </span>
                  <span>•</span>
                  <span>Version 2.3</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">NDPC Registered Framework</span>
                </div>
              </div>

              {/* DPO Contact card */}
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 flex items-center gap-4 max-w-xs shrink-0 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Data Privacy Officer</span>
                  <p className="text-[11px] text-slate-400">Dedicated to your rights and NDPA compliance.</p>
                  <a
                    href="mailto:privacy@foodwok.ng"
                    className="text-xs font-semibold text-emerald-400 hover:underline inline-block pt-1"
                  >
                    privacy@foodwok.ng
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Sticky Navigation Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span>Privacy Navigation</span>
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
                              ? 'bg-emerald-50 text-emerald-800 font-bold shadow-2xs'
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

                {/* Transparency Guarantee Card */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/60 rounded-3xl p-5 text-emerald-950 space-y-3">
                  <h3 className="text-xs font-bold flex items-center gap-2 text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Our Data Promises</span>
                  </h3>
                  <ul className="text-xs space-y-2 text-emerald-900/90 leading-relaxed font-medium">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>We never sell or rent your personal data to advertisers.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Zero raw bank card storage: All payments handled by Paystack.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Full control: Manage or delete your saved addresses anytime.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Policy Document Body */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs space-y-12 text-slate-700 text-sm leading-relaxed">
              {/* Section 1 */}
              <section id="overview" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600">1.</span> Privacy Commitment & NDPA 2023
                </h2>
                <p>
                  At <strong>Foodwok</strong> (&quot;Foodwok&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we treat your privacy and personal data with utmost transparency and care. This Privacy Policy outlines our practices regarding data collection, storage, sharing, and protection when you use our website, place hot food orders, or interact with our culinary and delivery teams.
                </p>
                <p>
                  Foodwok operates in full compliance with the <strong>Nigeria Data Protection Act (NDPA) 2023</strong> and guidelines established by the <strong>Nigeria Data Protection Commission (NDPC)</strong>. By using Foodwok, you consent to the processing of your personal information in accordance with this Policy.
                </p>
              </section>

              {/* Section 2 */}
              <section id="data-collected" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Database className="w-6 h-6 text-emerald-600" />
                  <span>2. Information We Collect</span>
                </h2>
                <p>
                  When you interact with Foodwok, we collect information necessary to prepare your food, coordinate delivery, and maintain your customer account:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                    <strong className="text-slate-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[#EB3223]" />
                      Account & Identity Information
                    </strong>
                    <p className="text-xs">
                      When signing up, you provide your <strong>First Name</strong>, <strong>Last Name</strong>, <strong>Email Address</strong>, <strong>Nigerian Phone Number</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">+234...</code>), and password (which is cryptographically hashed and never stored in plain text). If you sign in using <strong>Google OAuth</strong>, we receive your name, email address, and profile picture avatar from Google.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                    <strong className="text-slate-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      Delivery & Location Addresses
                    </strong>
                    <p className="text-xs">
                      To fulfill your orders, we collect your physical street delivery address (e.g., Victoria Island, Lekki, Ikoyi), apartment/suite numbers, and nearest landmark descriptions (e.g. &quot;Near GTBank branch&quot;) as well as recipient contact phone numbers.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                    <strong className="text-slate-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      Order Details & Culinary Preferences
                    </strong>
                    <p className="text-xs">
                      We store your selected menu items (party jollof rice, fried rice, proteins, sides, drinks), add-on selections (extra beef, dodo, salad), kitchen instructions, order timestamps, and order tracking histories.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5">
                    <strong className="text-slate-900 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      Device, Browser & Technical Information
                    </strong>
                    <p className="text-xs">
                      We collect technical details including IP address, browser type, operating system, and request headers to safeguard platform security, prevent fraudulent bot activity, and ensure website responsiveness.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="permissions" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600">3.</span> Customer Permissions & Consents
                </h2>
                <p>When using Foodwok, you explicitly grant the following operational permissions:</p>

                <ul className="list-disc pl-5 space-y-2 text-xs">
                  <li>
                    <strong>Phone & SMS Verification Permission:</strong> Permission to send one-time passcodes (OTPs) via SMS or phone verification services when logging in or securing your account.
                  </li>
                  <li>
                    <strong>Delivery Contact Permission:</strong> Permission for Foodwok personnel and assigned dispatch riders to call or message your provided phone number regarding your delivery, gate clearance, or arrival at your landmark.
                  </li>
                  <li>
                    <strong>Email Notification Permission:</strong> Permission to send order confirmation receipts, payment verification alerts, email confirmation links, and important status updates regarding your food order.
                  </li>
                  <li>
                    <strong>Saved Address Permission:</strong> Permission to store your frequent delivery destinations in your user profile for faster one-click reordering, which you can edit or remove at any time.
                  </li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="paystack-disclosure" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                  <span>4. Paystack Payments & Zero Card Storage</span>
                </h2>
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl p-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>Complete Card Security & Tokenization</span>
                  </div>
                  <p>
                    <strong>Foodwok DOES NOT collect, process, or store credit or debit card numbers, expiration dates, CVVs, or bank PINs on any of our servers or databases.</strong>
                  </p>
                  <p>
                    All electronic payment processing is handled through <strong>Paystack Payments Limited</strong>, a licensed payment solution provider certified under <strong>PCI-DSS Level 1</strong> standards (the highest security certification in the global payments industry).
                  </p>
                </div>
                <p className="text-xs">
                  The only payment data transmitted back to Foodwok and retained in our database includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>A unique Paystack transaction reference string (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">paystackReference</code>)</li>
                  <li>The payment status (<code className="bg-slate-100 px-1 py-0.5 rounded">PAID</code>, <code className="bg-slate-100 px-1 py-0.5 rounded">PENDING</code>, or <code className="bg-slate-100 px-1 py-0.5 rounded">FAILED</code>)</li>
                  <li>The total transaction amount in Nigerian Kobo / Naira</li>
                  <li>Cryptographically signed HMAC SHA512 webhook payloads confirming bank settlement</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section id="kitchen-riders" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-emerald-600" />
                  <span>5. Kitchen Display (KDS) & Dispatch Rider Disclosures</span>
                </h2>
                <p>
                  To fulfill your orders safely and efficiently, information is shared internally on a strictly need-to-know basis:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-xs">
                    <strong className="text-slate-900 font-bold block text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Kitchen Staff (KDS)
                    </strong>
                    <p>
                      Our kitchen cooks and kitchen managers see your order items, requested customizations, add-ons, and customer first name to prepare and package your dishes correctly. Kitchen staff have no access to payment details.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1.5 text-xs">
                    <strong className="text-slate-900 font-bold block text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Dispatch Riders & Logistics
                    </strong>
                    <p>
                      Assigned dispatch riders receive your recipient name, destination street address, landmark notes, and phone number solely to deliver your food parcel and phone you upon arrival at your location.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="cookies-storage" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <Cookie className="w-6 h-6 text-emerald-600" />
                  <span>6. Cookies & Client LocalStorage</span>
                </h2>
                <p>
                  Foodwok uses essential cookies and browser LocalStorage to provide a smooth, responsive ordering experience:
                </p>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-xs text-left border border-slate-200/80 rounded-2xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-800 uppercase font-bold text-[11px]">
                      <tr>
                        <th className="p-3">Key / Cookie</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-3 font-mono font-bold text-slate-900">foodwok_cart</td>
                        <td className="p-3">LocalStorage</td>
                        <td className="p-3">Preserves your food selections and selected add-ons across page refreshes.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-slate-900">foodwok_orders</td>
                        <td className="p-3">LocalStorage</td>
                        <td className="p-3">Allows rapid retrieval of your active tracking status and recent orders.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-slate-900">foodwok_role</td>
                        <td className="p-3">Cookie</td>
                        <td className="p-3">Secures role-based access for customer vs kitchen and administrative staff.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-slate-900">sb-*-auth-token</td>
                        <td className="p-3">Secure Cookie</td>
                        <td className="p-3">Maintains your authenticated Supabase user session securely over HTTPS.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Section 7 */}
              <section id="legal-basis" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600">7.</span> Legal Basis for Data Processing
                </h2>
                <p>
                  Under the Nigeria Data Protection Act (NDPA 2023), Foodwok processes your data under the following lawful bases:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li><strong>Contractual Performance:</strong> Processing required to prepare, package, and deliver your food order and collect payments.</li>
                  <li><strong>Legal Obligation:</strong> Maintaining financial transaction ledgers, tax accounting, and statutory records required under Nigerian commercial law.</li>
                  <li><strong>Legitimate Interests:</strong> Protecting our website against cyber threats, fraudulent chargebacks, and platform abuse.</li>
                  <li><strong>Consent:</strong> Explicit consent provided by you when registering an account, subscribing to communications, or saving delivery addresses.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section id="retention-security" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-6 h-6 text-emerald-600" />
                  <span>8. Data Security & Retention</span>
                </h2>
                <p>
                  We implement enterprise-grade security protocols to protect your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs">
                  <li>All web traffic between your browser and Foodwok servers is encrypted using Transport Layer Security (TLS/HTTPS).</li>
                  <li>Database records hosted on Supabase are protected using Row-Level Security (RLS) policies, preventing unauthorized cross-user access.</li>
                  <li>Financial webhooks are verified cryptographically via HMAC SHA512 signatures before updating order statuses.</li>
                  <li>We retain customer profile and order data for as long as your account remains active or as required by Nigerian financial record-keeping laws (up to 6 years for accounting logs).</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section id="customer-rights" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span>9. Your Rights Under Nigerian Law (NDPA)</span>
                </h2>
                <p>As a data subject in Nigeria, you hold the following statutory rights:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Right of Access</strong>
                    <p className="text-slate-600">You may request a copy of all personal information we hold about you.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Right to Rectification</strong>
                    <p className="text-slate-600">You can update your name, phone number, and delivery addresses anytime via your <Link href="/profile" className="text-[#EB3223] underline">Profile page</Link>.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Right to Erasure (&quot;Right to be Forgotten&quot;)</strong>
                    <p className="text-slate-600">You can request full deletion of your account and personal details by contacting our DPO.</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900 font-bold block">Right to Lodge a Complaint</strong>
                    <p className="text-slate-600">You have the right to lodge a formal complaint with the Nigeria Data Protection Commission (NDPC).</p>
                  </div>
                </div>
              </section>

              {/* Section 10 */}
              <section id="third-parties" className="space-y-3 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="text-emerald-600">10.</span> Third-Party Service Providers
                </h2>
                <p>We work with trusted service providers to deliver our services:</p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Paystack Payments Limited:</strong> Payment gateway and verification.</li>
                  <li><strong>Supabase Inc.:</strong> Encrypted cloud database and identity management.</li>
                  <li><strong>Google Identity Services:</strong> Optional single-sign-on (OAuth).</li>
                  <li><strong>Vetted Courier Partners:</strong> Door-to-door food delivery riders in Lagos.</li>
                </ul>
              </section>

              {/* Section 11 */}
              <section id="dpo-contact" className="space-y-4 scroll-mt-28 border-t border-slate-100 pt-8">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-emerald-600" />
                  <span>11. Data Protection Officer & Privacy Inquiries</span>
                </h2>
                <p>
                  To exercise any of your privacy rights, request account deletion, or file a privacy inquiry, please reach out to our dedicated Data Protection Officer:
                </p>

                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block text-base">Office of the Data Protection Officer</span>
                      <p className="text-xs text-slate-500">Foodwok Restaurant Nigeria Ltd • Lagos, Nigeria</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-700 pt-1">
                        <span>Email: <a href="mailto:privacy@foodwok.ng" className="text-emerald-600 hover:underline">privacy@foodwok.ng</a></span>
                        <span>General Support: <a href="mailto:support@foodwok.ng" className="text-[#EB3223] hover:underline">support@foodwok.ng</a></span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shrink-0"
                  >
                    Return Home
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
