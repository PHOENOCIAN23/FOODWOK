'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FoodMenuGrid } from '@/components/FoodMenuGrid';
import { useMenu } from '@/context/MenuContext';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { items } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const heroItem = useMemo(() => {
    return items.find((i) => i.id === 'smoky-jollof-rice') || items[0];
  }, [items]);

  const scrollToMenuSection = () => {
    setTimeout(() => {
      const el = document.getElementById('our-menu');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    scrollToMenuSection();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 space-y-4 pb-16">
        {/* Hero Section */}
        {searchQuery === '' && heroItem && (
          <HeroSection
            heroItem={heroItem}
            onExploreMenu={scrollToMenuSection}
          />
        )}

        {/* Menu Grid */}
        <FoodMenuGrid
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}
