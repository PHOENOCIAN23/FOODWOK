'use client';

import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  Star,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  FolderPlus,
  Globe,
  Layers,
} from 'lucide-react';
import { useMenu } from '@/context/MenuContext';
import { MenuItem, AddOnOption, AddOnScope } from '@/types/foodwok';
import { formatNairaFromKobo, koboToNairaNumber, nairaToKobo } from '@/lib/currency';

export default function AdminMenuPage() {
  const {
    items,
    addOns,
    categories,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    toggleMenuItemAvailability,
    updateAddOn,
    addAddOn,
    deleteAddOn,
    toggleAddOnAvailability,
    addCategory,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<'items' | 'addons'>('items');

  // Edit Dish Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewDish, setIsNewDish] = useState(false);

  // Form State for Dish Editing
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState<string>('rice');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryText, setNewCategoryText] = useState('');

  const [dishPriceNaira, setDishPriceNaira] = useState(3500);
  const [dishDescription, setDishDescription] = useState('');
  const [dishFullDescription, setDishFullDescription] = useState('');
  const [dishImage, setDishImage] = useState('');
  const [dishBadge, setDishBadge] = useState('POPULAR');
  const [dishRating, setDishRating] = useState(4.9);
  const [dishIsAvailable, setDishIsAvailable] = useState(true);
  const [dishSelectedAddOnIds, setDishSelectedAddOnIds] = useState<string[]>([]);

  // Add-on Editing State
  const [editingAddOn, setEditingAddOn] = useState<AddOnOption | null>(null);
  const [isNewAddOn, setIsNewAddOn] = useState(false);
  const [addOnName, setAddOnName] = useState('');
  const [addOnPriceNaira, setAddOnPriceNaira] = useState(500);
  const [addOnIsAvailable, setAddOnIsAvailable] = useState(true);
  const [addOnScope, setAddOnScope] = useState<AddOnScope>('UNIVERSAL');
  const [addOnCategories, setAddOnCategories] = useState<string[]>(['rice', 'pasta']);

  const openEditDishModal = (item?: MenuItem) => {
    setIsAddingCategory(false);
    setNewCategoryText('');

    if (item) {
      setEditingItem(item);
      setIsNewDish(false);
      setDishName(item.name);
      setDishCategory(item.category || 'rice');
      setDishPriceNaira(koboToNairaNumber(item.priceInKobo));
      setDishDescription(item.description);
      setDishFullDescription(item.fullDescription || item.description);
      setDishImage(item.image);
      setDishBadge(item.badge || '');
      setDishRating(item.rating);
      setDishIsAvailable(item.isAvailable !== false);
      setDishSelectedAddOnIds(item.addOns ? item.addOns.map((a) => a.id) : []);
    } else {
      setEditingItem({
        id: '',
        name: '',
        category: categories[0]?.id || 'rice',
        description: '',
        priceInKobo: 300000,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        isAvailable: true,
        addOns: addOns,
      });
      setIsNewDish(true);
      setDishName('');
      setDishCategory(categories[0]?.id || 'rice');
      setDishPriceNaira(3000);
      setDishDescription('');
      setDishFullDescription('');
      setDishImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
      setDishBadge('NEW');
      setDishRating(4.8);
      setDishIsAvailable(true);
      setDishSelectedAddOnIds(addOns.map((a) => a.id));
    }
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    const priceInKobo = nairaToKobo(dishPriceNaira);
    const selectedAddOnObjects = addOns.filter((a) => dishSelectedAddOnIds.includes(a.id));

    if (isNewDish) {
      addMenuItem({
        name: dishName,
        category: dishCategory,
        priceInKobo,
        description: dishDescription,
        fullDescription: dishFullDescription,
        image: dishImage,
        badge: dishBadge || undefined,
        rating: dishRating,
        isAvailable: dishIsAvailable,
        addOns: selectedAddOnObjects,
      });
    } else if (editingItem) {
      updateMenuItem({
        ...editingItem,
        name: dishName,
        category: dishCategory,
        priceInKobo,
        description: dishDescription,
        fullDescription: dishFullDescription,
        image: dishImage,
        badge: dishBadge || undefined,
        rating: dishRating,
        isAvailable: dishIsAvailable,
        addOns: selectedAddOnObjects,
      });
    }

    setEditingItem(null);
  };

  const handleCreateInlineCategory = () => {
    if (newCategoryText.trim()) {
      const created = addCategory(newCategoryText);
      setDishCategory(created.id);
      setNewCategoryText('');
      setIsAddingCategory(false);
    }
  };

  // Add-on Handlers
  const openEditAddOnModal = (addOn?: AddOnOption) => {
    if (addOn) {
      setEditingAddOn(addOn);
      setIsNewAddOn(false);
      setAddOnName(addOn.name);
      setAddOnPriceNaira(koboToNairaNumber(addOn.priceInKobo));
      setAddOnIsAvailable(addOn.isAvailable !== false);
      setAddOnScope(addOn.scope || 'UNIVERSAL');
      setAddOnCategories(addOn.applicableCategories || ['rice', 'pasta']);
    } else {
      setEditingAddOn({ id: '', name: '', priceInKobo: 50000, isAvailable: true, scope: 'UNIVERSAL' });
      setIsNewAddOn(true);
      setAddOnName('');
      setAddOnPriceNaira(500);
      setAddOnIsAvailable(true);
      setAddOnScope('UNIVERSAL');
      setAddOnCategories(['rice', 'pasta']);
    }
  };

  const handleSaveAddOn = (e: React.FormEvent) => {
    e.preventDefault();
    const priceInKobo = nairaToKobo(addOnPriceNaira);

    if (isNewAddOn) {
      addAddOn({
        name: addOnName,
        priceInKobo,
        isAvailable: addOnIsAvailable,
        scope: addOnScope,
        applicableCategories: addOnScope === 'CATEGORY_SPECIFIC' ? addOnCategories : [],
      });
    } else if (editingAddOn) {
      updateAddOn({
        ...editingAddOn,
        name: addOnName,
        priceInKobo,
        isAvailable: addOnIsAvailable,
        scope: addOnScope,
        applicableCategories: addOnScope === 'CATEGORY_SPECIFIC' ? addOnCategories : [],
      });
    }

    setEditingAddOn(null);
  };

  const toggleCategorySelectionForAddOn = (catId: string) => {
    setAddOnCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const getCategoryLabel = (catId: string) => {
    const found = categories.find((c) => c.id === catId);
    return found ? found.label : catId;
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Menu & Add-ons Manager
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Manage storefront dishes, custom categories, universal & category-specific add-ons
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'items'
                ? 'bg-[#EB3223] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dishes ({items.length})
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'addons'
                ? 'bg-[#EB3223] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Add-on Extras ({addOns.length})
          </button>
        </div>
      </div>

      {/* DISHES TAB */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={() => openEditDishModal()}
              className="bg-[#EB3223] hover:bg-[#d62819] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add New Dish</span>
            </button>
          </div>

          {/* Dishes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isAvailable = item.isAvailable !== false;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border p-5 shadow-xs space-y-4 hover:shadow-md transition-all flex flex-col justify-between ${
                    !isAvailable ? 'border-red-200 bg-red-50/10' : 'border-slate-100'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Image Preview & Availability Badge */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100">
                      {item.badge && (
                        <span className="absolute top-3 left-3 z-10 bg-[#EB3223] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md">
                          {item.badge}
                        </span>
                      )}

                      {/* Prominent Availability Marker Tag */}
                      <span
                        className={`absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase flex items-center gap-1 shadow-sm ${
                          isAvailable
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            AVAILABLE
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            SOLD OUT
                          </>
                        )}
                      </span>

                      <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-opacity ${
                          !isAvailable ? 'opacity-50 grayscale-40' : ''
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                          {getCategoryLabel(item.category)}
                        </span>
                        <span className="text-[#EB3223] font-black text-lg">
                          {formatNairaFromKobo(item.priceInKobo)}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-lg">
                        {item.name}
                      </h3>

                      <p className="text-slate-500 text-xs line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Quick Availability Toggle Button */}
                    <div className="pt-1 flex items-center justify-between bg-slate-50 border border-slate-200/60 rounded-2xl p-2.5">
                      <span className="text-xs font-bold text-slate-700">Stock Availability:</span>
                      <button
                        type="button"
                        onClick={() => toggleMenuItemAvailability(item.id)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                          isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {isAvailable ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-red-600" />}
                        <span>{isAvailable ? 'In Stock' : 'Mark Sold Out'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Edit & Delete Action Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openEditDishModal(item)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Dish</span>
                    </button>

                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2.5 text-slate-400 hover:text-red-600 rounded-2xl hover:bg-red-50 transition-colors"
                      title="Delete Dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GLOBAL ADD-ONS TAB */}
      {activeTab === 'addons' && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Add-on Extras Catalog</h3>
              <p className="text-xs text-slate-500 font-medium">Separated into Food Extras & Chilled Drinks</p>
            </div>
            <button
              onClick={() => openEditAddOnModal()}
              className="bg-[#EB3223] hover:bg-[#d62819] text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Add-on</span>
            </button>
          </div>

          {(() => {
            const drinkAddOns = addOns.filter(
              (a) => a.categoryType === 'DRINK' || (a.scope === 'UNIVERSAL' && !a.categoryType)
            );
            const foodAddOns = addOns.filter(
              (a) => a.categoryType === 'FOOD' || (a.scope === 'CATEGORY_SPECIFIC' && !a.categoryType)
            );

            const renderAddOnGrid = (list: AddOnOption[]) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((addOn) => {
                  const isAvailable = addOn.isAvailable !== false;
                  const isUniversal = !addOn.scope || addOn.scope === 'UNIVERSAL';
                  return (
                    <div
                      key={addOn.id}
                      className={`bg-white rounded-3xl border p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                        !isAvailable ? 'border-red-200 bg-red-50/10' : 'border-slate-100'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-slate-900 text-base">
                              {addOn.name}
                            </h4>
                            <span className="text-[#EB3223] font-black text-sm">
                              +{formatNairaFromKobo(addOn.priceInKobo)}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {isAvailable ? 'AVAILABLE' : 'OUT OF STOCK'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                          {isUniversal ? (
                            <span className="bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Globe className="w-3 h-3 text-sky-600" />
                              Universal (All Meals)
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Layers className="w-3 h-3 text-amber-600" />
                              Category: {addOn.applicableCategories?.map(getCategoryLabel).join(', ') || 'Selected'}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => toggleAddOnAvailability(addOn.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                            isAvailable
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {isAvailable ? 'Mark Out of Stock' : 'Restock Item'}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditAddOnModal(addOn)}
                            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                            title="Edit Add-on"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAddOn(addOn.id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            title="Delete Add-on"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );

            return (
              <div className="space-y-8">
                {/* Food Add-ons Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="text-xl">🍲</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-700">
                      Food & Meal Add-ons ({foodAddOns.length})
                    </h4>
                  </div>
                  {renderAddOnGrid(foodAddOns)}
                </div>

                {/* Drinks & Beverages Section */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="text-xl">🥤</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-700">
                      Drinks & Beverages Add-ons ({drinkAddOns.length})
                    </h4>
                  </div>
                  {renderAddOnGrid(drinkAddOns)}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSaveDish}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {isNewDish ? 'Add New Dish' : `Edit Dish: ${editingItem.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {/* Dish Name & Dynamic Category Select with + Add New Category option */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-slate-500">
                    DISH NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={dishName}
                    onChange={(e) => setDishName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-slate-500">
                    CATEGORY
                  </label>
                  <select
                    value={isAddingCategory ? 'ADD_NEW' : dishCategory}
                    onChange={(e) => {
                      if (e.target.value === 'ADD_NEW') {
                        setIsAddingCategory(true);
                      } else {
                        setIsAddingCategory(false);
                        setDishCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                    <option value="ADD_NEW">+ Add New Category...</option>
                  </select>

                  {/* Inline Add New Category Box */}
                  {isAddingCategory && (
                    <div className="pt-2 space-y-2 animate-fade-in bg-slate-50 p-3 rounded-2xl border border-slate-200">
                      <label className="text-[11px] font-bold text-slate-700 block">
                        NEW CATEGORY NAME
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          placeholder="e.g. Swallow & Soups, Drinks"
                          value={newCategoryText}
                          onChange={(e) => setNewCategoryText(e.target.value)}
                          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#EB3223]"
                        />
                        <button
                          type="button"
                          onClick={handleCreateInlineCategory}
                          className="bg-[#EB3223] text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-[#d62819] shadow-2xs"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(false)}
                          className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Price in Naira & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-slate-500">
                    PRICE IN NAIRA (₦)
                  </label>
                  <input
                    type="number"
                    required
                    min="100"
                    step="50"
                    value={dishPriceNaira}
                    onChange={(e) => setDishPriceNaira(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#EB3223]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase text-slate-500">
                    BADGE TAG
                  </label>
                  <select
                    value={dishBadge}
                    onChange={(e) => setDishBadge(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                  >
                    <option value="POPULAR">POPULAR</option>
                    <option value="CHEF SPECIAL">CHEF SPECIAL</option>
                    <option value="NEW">NEW</option>
                    <option value="">None</option>
                  </select>
                </div>
              </div>

              {/* Availability Marker Checkbox Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-sm block">
                    Available for Ordering
                  </span>
                  <span className="text-slate-500 text-xs">
                    Uncheck to mark this dish as Sold Out on the storefront
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dishIsAvailable}
                  onChange={(e) => setDishIsAvailable(e.target.checked)}
                  className="w-5 h-5 accent-[#EB3223] cursor-pointer"
                />
              </div>

              {/* Dish Image Attachment URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  ATTACH DISH IMAGE URL
                </label>
                <input
                  type="url"
                  required
                  value={dishImage}
                  onChange={(e) => setDishImage(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                />

                {dishImage && (
                  <div className="pt-2 flex items-center gap-3">
                    <img
                      src={dishImage}
                      alt="Preview"
                      className="w-20 h-14 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="text-xs text-slate-400 font-medium">Image attached & verified</span>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  SHORT DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  required
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#EB3223] hover:bg-[#d62819] text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20"
              >
                Save Dish Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT ADD-ON MODAL */}
      {editingAddOn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <form
            onSubmit={handleSaveAddOn}
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 border border-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900">
                {isNewAddOn ? 'Create New Add-on' : `Edit Add-on: ${editingAddOn.name}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingAddOn(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  ADD-ON NAME
                </label>
                <input
                  type="text"
                  required
                  value={addOnName}
                  onChange={(e) => setAddOnName(e.target.value)}
                  placeholder="Extra Beef / Fried Plantain / Extra Cheese"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  PRICE IN NAIRA (₦)
                </label>
                <input
                  type="number"
                  required
                  min="50"
                  step="50"
                  value={addOnPriceNaira}
                  onChange={(e) => setAddOnPriceNaira(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-bold focus:outline-none focus:border-[#EB3223]"
                />
              </div>

              {/* Scope Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase text-slate-500">
                  ADD-ON APPLICABILITY SCOPE
                </label>
                <select
                  value={addOnScope}
                  onChange={(e) => setAddOnScope(e.target.value as AddOnScope)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#EB3223]"
                >
                  <option value="UNIVERSAL">Universal (Applies to All Meals & Drinks)</option>
                  <option value="CATEGORY_SPECIFIC">Specific Meal Categories Only</option>
                </select>
              </div>

              {/* Category Checkboxes if CATEGORY_SPECIFIC */}
              {addOnScope === 'CATEGORY_SPECIFIC' && (
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="text-xs font-extrabold uppercase text-slate-700 block">
                    SELECT APPLICABLE MEAL CATEGORIES:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => {
                      const isChecked = addOnCategories.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleCategorySelectionForAddOn(cat.id)}
                            className="w-4 h-4 accent-[#EB3223] rounded"
                          />
                          <span>{cat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">
                  Available in Stock
                </span>
                <input
                  type="checkbox"
                  checked={addOnIsAvailable}
                  onChange={(e) => setAddOnIsAvailable(e.target.checked)}
                  className="w-5 h-5 accent-[#EB3223] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingAddOn(null)}
                className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#EB3223] hover:bg-[#d62819] text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md shadow-red-500/20"
              >
                Save Add-on
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
