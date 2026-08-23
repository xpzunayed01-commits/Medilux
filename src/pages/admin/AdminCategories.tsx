import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Layers, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  X, 
  Check, 
  Package
} from 'lucide-react';
import { subscribeToCategories, subscribeToProducts, saveCategory, deleteCategory } from '../../lib/dataService';
import { Category, Product } from '../../types';

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formId, setFormId] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIsHidden, setFormIsHidden] = useState(false);

  useEffect(() => {
    const unsubCats = subscribeToCategories((data) => setCategories(data));
    const unsubProds = subscribeToProducts((data) => setProducts(data));
    return () => {
      unsubCats();
      unsubProds();
    };
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormId('');
    setFormDescription('');
    setFormImage('https://picsum.photos/id/292/800/1200');
    setFormIsHidden(false);
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormId(category.id);
    setFormDescription(category.description || '');
    setFormImage(category.image || '');
    setFormIsHidden(Boolean(category.isHidden));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      alert('Please enter a category name.');
      return;
    }

    try {
      setSaving(true);
      const cleanSlug = (formId || formName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await saveCategory({
        id: editingCategory ? editingCategory.id : cleanSlug,
        name: formName.toUpperCase(),
        description: formDescription,
        image: formImage || 'https://picsum.photos/id/292/800/1200',
        isHidden: formIsHidden,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const attachedProds = products.filter((p) => p.category === id);
    if (attachedProds.length > 0) {
      if (!window.confirm(`Warning: There are ${attachedProds.length} products currently in this category. Are you sure you want to delete "${name}"?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    }

    try {
      await deleteCategory(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  const toggleHide = async (category: Category) => {
    try {
      await saveCategory({
        ...category,
        isHidden: !category.isHidden,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-xs text-gray-500">Organize store collections, navigation tabs, and cover imagery</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0F2417] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Create New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((category) => {
          const count = products.filter((p) => p.category === category.id).length;
          return (
            <div
              key={category.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                category.isHidden ? 'border-gray-200 opacity-70 bg-gray-50' : 'border-gray-100'
              }`}
            >
              {/* Image & Badges */}
              <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                <img
                  referrerPolicy="no-referrer"
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg tracking-wider">
                    {count} Products
                  </span>
                </div>
                {category.isHidden && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold rounded-lg">
                      Hidden from Store
                    </span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
                      {category.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">/{category.id}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.description || 'No description provided'}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => toggleHide(category)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                      category.isHidden
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{category.isHidden ? 'Show on Site' : 'Hide'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1.5 text-gray-600 hover:text-emerald-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FOOD or ORGANIC CARE"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Everyday nutritional rituals"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cover Image URL
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {formImage && (
                    <img
                      referrerPolicy="no-referrer"
                      src={formImage}
                      alt="Preview"
                      className="w-10 h-10 object-cover rounded-xl border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-gray-800">
                  <input
                    type="checkbox"
                    checked={formIsHidden}
                    onChange={(e) => setFormIsHidden(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Hide this category from storefront navigation</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#0F2417] text-white rounded-xl text-xs font-bold hover:bg-emerald-900 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
