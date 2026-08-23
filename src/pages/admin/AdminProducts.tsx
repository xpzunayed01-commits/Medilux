import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Package, 
  Check, 
  X, 
  Sparkles, 
  Tag, 
  Image as ImageIcon,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { subscribeToProducts, subscribeToCategories, saveProduct, deleteProduct } from '../../lib/dataService';
import { Product, Category } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescriptor, setFormDescriptor] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formRegularPrice, setFormRegularPrice] = useState('');
  const [formStock, setFormStock] = useState('25');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formHowToUse, setFormHowToUse] = useState('');
  const [formIsNew, setFormIsNew] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  useEffect(() => {
    const unsubProds = subscribeToProducts((data) => setProducts(data));
    const unsubCats = subscribeToCategories((data) => setCategories(data));
    return () => {
      unsubProds();
      unsubCats();
    };
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDescriptor('');
    setFormCategory(categories[0]?.id || 'food');
    setFormPrice('');
    setFormRegularPrice('');
    setFormStock('25');
    setFormDescription('');
    setFormImage('https://picsum.photos/id/292/800/1200');
    setFormIngredients('');
    setFormHowToUse('');
    setFormIsNew(false);
    setFormIsBestseller(false);
    setFormIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormDescriptor(product.descriptor || '');
    setFormCategory(product.category);
    setFormPrice(String(product.price));
    setFormRegularPrice(String(product.regularPrice || product.price));
    setFormStock(String(product.stock ?? 25));
    setFormDescription(product.description || '');
    setFormImage(product.image || '');
    setFormIngredients(product.ingredients || '');
    setFormHowToUse(product.howToUse || '');
    setFormIsNew(Boolean(product.isNew));
    setFormIsBestseller(Boolean(product.isBestseller));
    setFormIsFeatured(Boolean(product.isFeatured));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) {
      alert('Please fill in Product Name and Price');
      return;
    }

    try {
      setSaving(true);
      await saveProduct({
        id: editingProduct ? editingProduct.id : undefined,
        name: formName,
        descriptor: formDescriptor,
        category: formCategory || 'food',
        price: Number(formPrice),
        regularPrice: formRegularPrice ? Number(formRegularPrice) : Number(formPrice),
        stock: Number(formStock),
        description: formDescription,
        image: formImage,
        images: [formImage],
        ingredients: formIngredients,
        howToUse: formHowToUse,
        isNew: formIsNew,
        isBestseller: formIsBestseller,
        isFeatured: formIsFeatured,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error(err);
        alert('Failed to delete product.');
      }
    }
  };

  const toggleBadge = async (product: Product, badge: 'isNew' | 'isBestseller' | 'isFeatured') => {
    try {
      await saveProduct({
        ...product,
        [badge]: !product[badge],
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.descriptor && p.descriptor.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Catalog</h1>
          <p className="text-xs text-gray-500">Add, edit, change prices, photos and badges of all products</p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#0F2417] hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-gray-200/80">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all' ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap uppercase transition-colors ${
                selectedCategory === c.id ? 'bg-emerald-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name} ({products.filter((p) => p.category === c.id).length})
            </button>
          ))}
        </div>
      </div>

      {/* Product List Grid / Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Package size={44} className="mx-auto text-gray-300 mb-3" />
            <p className="text-base font-bold text-gray-800">No products found</p>
            <p className="text-xs text-gray-400 mt-1">Try changing filters or add your first product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Badges / Flags</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Product Name & Image */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          referrerPolicy="no-referrer"
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-14 object-cover rounded-xl bg-gray-100 border border-gray-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-xs">{product.name}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-1">{product.descriptor || product.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600 uppercase">
                      <span className="px-2 py-1 bg-gray-100 rounded-md">{product.category}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-bold text-gray-900">{formatPrice(product.price)}</div>
                      {product.regularPrice && product.regularPrice > product.price && (
                        <div className="text-[10px] text-gray-400 line-through">
                          {formatPrice(product.regularPrice)}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          (product.stock ?? 25) <= 0
                            ? 'bg-rose-100 text-rose-800'
                            : (product.stock ?? 25) <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {product.stock ?? 25} in stock
                      </span>
                    </td>

                    {/* Badges Toggles */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleBadge(product, 'isBestseller')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            product.isBestseller
                              ? 'bg-amber-500 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Bestseller"
                        >
                          <Flame size={12} />
                          <span>Best</span>
                        </button>
                        <button
                          onClick={() => toggleBadge(product, 'isNew')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            product.isNew
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle New Arrival"
                        >
                          <Sparkles size={12} />
                          <span>New</span>
                        </button>
                        <button
                          onClick={() => toggleBadge(product, 'isFeatured')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                            product.isFeatured
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star size={12} />
                          <span>Featured</span>
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-gray-600 hover:text-emerald-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
              <h2 className="text-lg font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Product Name & Descriptor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Herbal Face Serum"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deep hydration & barrier support"
                    value={formDescriptor}
                    onChange={(e) => setFormDescriptor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Sale Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1250"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Regular Price (৳)
                  </label>
                  <input
                    type="number"
                    placeholder="1450"
                    value={formRegularPrice}
                    onChange={(e) => setFormRegularPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL with Preview */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Product Image URL
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
                      className="w-11 h-11 object-cover rounded-xl border border-gray-200 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed product story and benefits..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              {/* Ingredients & How to Use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Ingredients (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="100% Organic Extracts..."
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    How To Use (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Apply 2-3 drops morning and night..."
                    value={formHowToUse}
                    onChange={(e) => setFormHowToUse(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Badges / Highlights */}
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                  Highlights & Badges
                </label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formIsBestseller}
                      onChange={(e) => setFormIsBestseller(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>🔥 Best Seller</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formIsNew}
                      onChange={(e) => setFormIsNew(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>✨ New Arrival</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={formIsFeatured}
                      onChange={(e) => setFormIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>⭐ Homepage Featured</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3">
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
                  {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
