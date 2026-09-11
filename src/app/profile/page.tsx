'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Plus, MapPin, Trash2, Check, LogOut, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect');
  const noticeParam = searchParams.get('notice');
  const isFirstTime = searchParams.get('firstTime') === 'true';

  const { user, updateProfile, addAddress, removeAddress, setDefaultAddress, logout } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || 'Chidi');
  const [lastName, setLastName] = useState(user?.lastName || 'Okeke');
  const [email, setEmail] = useState(user?.email || 'chidi@example.com');
  const [phone, setPhone] = useState(user?.phone || '+234 800 000 0000');

  // Add Address Form State (Auto-opened for first-timers or address prompt)
  const [showAddAddressForm, setShowAddAddressForm] = useState(
    isFirstTime || noticeParam === 'welcome_add_address' || noticeParam === 'add_address'
  );
  const [newLabel, setNewLabel] = useState('Home');
  const [newAddress, setNewAddress] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      firstName,
      lastName,
      email,
      phone,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;

    addAddress({
      label: newLabel || 'Home',
      address: newAddress,
      landmark: newLandmark,
      isDefault: newIsDefault,
    });

    setNewAddress('');
    setNewLandmark('');
    setShowAddAddressForm(false);

    if (redirectTarget === 'checkout') {
      router.push('/checkout');
    } else if (isFirstTime) {
      router.push('/');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };

  const userAddresses = user?.addresses || [];

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-semibold text-sm transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Menu</span>
      </Link>

      {/* First Time Welcome Banner */}
      {(isFirstTime || noticeParam === 'welcome_add_address') && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 sm:p-6 flex items-start gap-4 text-emerald-900 shadow-xs animate-fade-in">
          <div className="p-2 bg-emerald-600 text-white rounded-2xl shrink-0 mt-0.5 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-base">Welcome to Foodwok, {firstName}! 🎉</h4>
            <p className="text-sm text-emerald-800 font-medium leading-relaxed">
              Please add your delivery location below so we know where to deliver your hot &amp; delicious meals!
            </p>
          </div>
        </div>
      )}

      {/* Redirect Notice Banner when routed from Checkout */}
      {noticeParam === 'add_address' && !isFirstTime && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-6 flex items-start gap-4 text-amber-900 shadow-xs animate-fade-in">
          <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-base">Delivery Address Required</h4>
            <p className="text-sm text-amber-800">
              Please add a delivery location below to proceed with your checkout.
            </p>
          </div>
        </div>
      )}

      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Account Profile
        </h1>

        <Link
          href="/orders"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-2xl text-xs font-bold transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders</span>
        </Link>
      </div>

      {/* Profile Info Card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-10 shadow-xs space-y-8">
        {/* User Header */}
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-[#EB3223] text-white font-black text-2xl flex items-center justify-center shadow-md">
            {firstName ? firstName.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              {firstName} {lastName}
            </h2>
            <p className="text-slate-500 text-sm font-medium">{email}</p>
          </div>
        </div>

        {/* Personal Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  FIRST NAME
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  LAST NAME
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl px-4 py-3 text-slate-900 text-sm focus:outline-none focus:border-[#EB3223] font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Profile Info</span>
              )}
            </button>
          </div>
        </form>

        {/* Delivery Locations Section with Add Address Functionality */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Delivery Locations
              </h3>
              <p className="text-slate-500 text-xs font-medium">
                Manage your saved delivery addresses
              </p>
            </div>

            <button
              onClick={() => setShowAddAddressForm((prev) => !prev)}
              className="bg-[#EB3223] hover:bg-[#d62819] text-white px-4 py-2 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20 inline-flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* Add Address Form Box */}
          {showAddAddressForm && (
            <form
              onSubmit={handleAddAddressSubmit}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-4 animate-scale-up"
            >
              <h4 className="font-extrabold text-slate-900 text-sm">
                Add New Delivery Location
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold uppercase text-slate-500">
                    LABEL
                  </label>
                  <select
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                  >
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-extrabold uppercase text-slate-500">
                    DELIVERY ADDRESS
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="12 Adeola Odeku Street, Victoria Island, Lagos"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold uppercase text-slate-500">
                  LANDMARK (OPTIONAL)
                </label>
                <input
                  type="text"
                  placeholder="Near GTBank branch"
                  value={newLandmark}
                  onChange={(e) => setNewLandmark(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="set-default"
                  checked={newIsDefault}
                  onChange={(e) => setNewIsDefault(e.target.checked)}
                  className="w-4 h-4 accent-[#EB3223] rounded cursor-pointer"
                />
                <label htmlFor="set-default" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Set as default delivery address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAddressForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#EB3223] hover:bg-[#d62819] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Saved Addresses List */}
          {userAddresses.length > 0 ? (
            <div className="space-y-3">
              {userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`border rounded-3xl p-5 flex items-start justify-between gap-4 transition-all ${
                    addr.isDefault
                      ? 'bg-red-50/30 border-[#EB3223]'
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-2.5 rounded-2xl ${
                        addr.isDefault
                          ? 'bg-[#EB3223] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-[#EB3223] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm font-medium">
                        {addr.address}
                      </p>
                      {addr.landmark && (
                        <p className="text-slate-400 text-xs font-medium">
                          Landmark: {addr.landmark}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-xs font-bold text-slate-500 hover:text-[#EB3223] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        Make Default
                      </button>
                    )}
                    <button
                      onClick={() => removeAddress(addr.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="font-extrabold text-slate-800 text-sm">
                No delivery addresses saved yet
              </h4>
              <p className="text-slate-500 text-xs max-w-sm mx-auto">
                Click &quot;Add New Address&quot; above to save your home or office address.
              </p>
            </div>
          )}
        </div>

        {/* Continue to Checkout Button if Redirected */}
        {redirectTarget === 'checkout' && userAddresses.length > 0 && (
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/checkout"
              className="w-full bg-[#EB3223] hover:bg-[#d62819] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-red-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Continue to Checkout ➔</span>
            </Link>
          </div>
        )}

        {/* Account Logout */}
        <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-500 hover:text-red-600 font-semibold text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <Navbar />
      <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading profile...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}
