'use client';

import React from 'react';
import { FoodCard } from './FoodCard';
import { useMenu } from '@/context/MenuContext';

interface FoodMenuGridProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery?: string;
}

export const FoodMenuGrid: React.FC<FoodMenuGridProps> = ({
  activeCategory,
  onCategoryChange,
  searchQuery = '',
}) => {
  const { items, categories } = useMenu();

  const categoryPills = [
    { id: 'all', label: 'All' },
    ...categories,
  ];

  const scrollToMenu = () => {
    const el = document.getElementById('our-menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryPillClick = (catId: string) => {
    onCategoryChange(catId);
    scrollToMenu();
  };

  const filteredBySearch = items.filter((item) => {
    return (
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const popularItems = filteredBySearch.filter((item) => item.badge === 'POPULAR').slice(0, 3);

  const filteredItems =
    activeCategory === 'all'
      ? filteredBySearch
      : filteredBySearch.filter(
          (item) => item.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Popular Today Section */}
      {activeCategory === 'all' && searchQuery === '' && popularItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Today
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Top picks from our kitchen right now
              </p>
            </div>
            <button
              onClick={() => {
                onCategoryChange('all');
                scrollToMenu();
              }}
              className="text-[#EB3223] font-bold text-sm hover:underline flex items-center gap-1 cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <FoodCard key={`popular-${item.id}`} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Our Menu Section */}
      <div className="space-y-6" id="our-menu">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our Menu
          </h2>

          {/* Dynamic Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categoryPills.map((cat) => {
              const isSelected = activeCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryPillClick(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#EB3223] text-white shadow-md shadow-red-500/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">No items found</h3>
            <p className="text-slate-500 text-sm">
              We couldn&apos;t find any dishes matching this category or search term.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
