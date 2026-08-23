import { useState, useEffect } from 'react';
import { 
  Boxes, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Minus, 
  Save, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { subscribeToProducts, updateProductStock } from '../../lib/dataService';
import { Product } from '../../types';
import { formatPrice } from '../../lib/utils';

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToProducts((data) => {
      setProducts(data);
      // Initialize inputs
      const initial: Record<string, number> = {};
      data.forEach((p) => {
        initial[p.id] = p.stock ?? 25;
      });
      setStockInputs((prev) => ({ ...initial, ...prev }));
    });
    return () => unsub();
  }, []);

  const handleStockChange = (id: string, value: number) => {
    setStockInputs((prev) => ({
      ...prev,
      [id]: Math.max(0, value),
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = stockInputs[product.id] ?? (product.stock ?? 25);
    try {
      setSavingId(product.id);
      await updateProductStock(product.id, newStock);
    } catch (err) {
      console.error(err);
      alert('Failed to update stock.');
    } finally {
      setSavingId(null);
    }
  };

  const filteredProducts = products.filter((p) => {
    const stock = p.stock ?? 25;
    const matchesFilter =
      filterType === 'all'
        ? true
        : filterType === 'low'
        ? stock > 0 && stock <= 5
        : stock <= 0;

    const q = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const lowStockCount = products.filter((p) => (p.stock ?? 25) > 0 && (p.stock ?? 25) <= 5).length;
  const outOfStockCount = products.filter((p) => (p.stock ?? 25) <= 0).length;
  const inStockCount = products.filter((p) => (p.stock ?? 25) > 5).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory & Stock Control</h1>
          <p className="text-xs text-gray-500">Monitor real-time warehouse inventory and set threshold alerts</p>
        </div>
      </div>

      {/* Real-time stock automation banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0 mt-0.5">
          <Sparkles size={18} />
        </div>
        <div className="text-xs text-emerald-900">
          <p className="font-bold">Automated Stock Reduction is Active</p>
          <p className="mt-0.5 text-emerald-800/90">
            Whenever a customer places an order on the storefront, the inventory stock is automatically deducted in real-time. If stock reaches 0, the product will be labeled "Out of Stock".
          </p>
        </div>
      </div>

      {/* Inventory Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterType('all')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filterType === 'all'
              ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Products</span>
            <Boxes size={18} className="text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{products.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">{inStockCount} healthy stock</p>
        </button>

        <button
          onClick={() => setFilterType('low')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filterType === 'low'
              ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Low Stock Alert</span>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">{lowStockCount}</p>
          <p className="text-xs text-amber-600 font-medium mt-0.5">Stock ≤ 5 units</p>
        </button>

        <button
          onClick={() => setFilterType('out')}
          className={`p-5 rounded-2xl border text-left transition-all ${
            filterType === 'out'
              ? 'bg-rose-50/50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Out of Stock</span>
            <XCircle size={18} className="text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700 mt-2">{outOfStockCount}</p>
          <p className="text-xs text-rose-600 font-medium mt-0.5">Needs immediate restocking</p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-gray-200/80 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search products in inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <span className="text-xs text-gray-500 font-medium hidden sm:block">
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock Status</th>
                <th className="py-3.5 px-4">Quick Adjust Stock</th>
                <th className="py-3.5 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const currentVal = stockInputs[product.id] ?? (product.stock ?? 25);
                const hasChanged = currentVal !== (product.stock ?? 25);

                return (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Thumbnail & Title */}
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
                          <p className="text-[11px] text-gray-400 font-mono">SKU: {product.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600 uppercase">
                      <span className="px-2 py-0.5 bg-gray-100 rounded">{product.category}</span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 text-xs font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </td>

                    {/* Stock status indicator */}
                    <td className="py-3.5 px-4">
                      {currentVal <= 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <XCircle size={13} />
                          <span>Out of Stock</span>
                        </span>
                      ) : currentVal <= 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          <AlertTriangle size={13} />
                          <span>Low Stock ({currentVal})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 size={13} />
                          <span>In Stock ({currentVal})</span>
                        </span>
                      )}
                    </td>

                    {/* Quick Stepper & Direct Input */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStockChange(product.id, currentVal - 1)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                          title="Decrease Stock"
                        >
                          <Minus size={13} />
                        </button>

                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />

                        <button
                          type="button"
                          onClick={() => handleStockChange(product.id, currentVal + 1)}
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                          title="Increase Stock"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </td>

                    {/* Save Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleSaveStock(product)}
                        disabled={!hasChanged || savingId === product.id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ml-auto ${
                          hasChanged
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs animate-pulse'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Save size={13} />
                        <span>{savingId === product.id ? 'Saving...' : 'Save'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
