'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { stockMovementsApi, StockMovementData } from '@/lib/api/stock-movements';
import { productsApi, ProductData } from '@/lib/api/products';

export default function StockMovementsPage() {
  const router = useRouter();
  const [movements, setMovements] = useState<StockMovementData[]>([]);
  const [filteredMovements, setFilteredMovements] = useState<StockMovementData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [movementTypeFilter, setMovementTypeFilter] = useState('All Movement Types');
  const [directionFilter, setDirectionFilter] = useState('All Directions');
  const [productFilter, setProductFilter] = useState('All Products');

  useEffect(() => {
    fetchMovements();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterMovements();
  }, [movements, searchQuery, movementTypeFilter, directionFilter, productFilter]);

  const fetchMovements = async () => {
    try {
      const data = await stockMovementsApi.getAll();
      setMovements(data);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterMovements = () => {
    let filtered = movements;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(m =>
        m.movement_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.product_sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Movement type filter
    if (movementTypeFilter !== 'All Movement Types') {
      filtered = filtered.filter(m => m.movement_type === movementTypeFilter);
    }

    // Direction filter
    if (directionFilter !== 'All Directions') {
      filtered = filtered.filter(m => m.direction === directionFilter);
    }

    // Product filter
    if (productFilter !== 'All Products') {
      filtered = filtered.filter(m => m.product === productFilter);
    }

    setFilteredMovements(filtered);
  };

  // Calculate stats
  const totalMovements = movements.length;
  const stockIn = movements.filter(m => m.direction === 'IN').length;
  const stockInUnits = movements.filter(m => m.direction === 'IN').reduce((sum, m) => sum + m.quantity, 0);
  const stockOut = movements.filter(m => m.direction === 'OUT').length;
  const stockOutUnits = movements.filter(m => m.direction === 'OUT').reduce((sum, m) => sum + m.quantity, 0);
  const netMovement = stockInUnits - stockOutUnits;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + ' ' +
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getDirectionBadge = (direction: string) => {
    if (direction === 'IN') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-white text-xs font-medium bg-green-500">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          IN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-white text-xs font-medium bg-red-500">
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        OUT
      </span>
    );
  };

  const getMovementTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Purchase Receipt': 'bg-blue-100 text-blue-800',
      'Sale/Usage': 'bg-purple-100 text-purple-800',
      'Stock Adjustment': 'bg-gray-100 text-gray-800',
      'Branch Transfer': 'bg-cyan-100 text-cyan-800',
      'Supplier Return': 'bg-orange-100 text-orange-800',
      'Damage/Loss': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
                <span>/</span>
                <a href="/inventory" className="text-blue-600 hover:underline">Inventory</a>
                <span>/</span>
                <span className="text-gray-900">Stock Movements</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Stock Movements</h1>
              </div>
            </div>
            <button
              onClick={() => router.push('/inventory/stock-movements/record')}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Record Stock Movement
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Movements</p>
                  <p className="text-2xl font-bold text-gray-900">{totalMovements}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock In</p>
                  <p className="text-2xl font-bold text-gray-900">{stockIn}</p>
                  <p className="text-xs text-gray-500">{stockInUnits} units</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Out</p>
                  <p className="text-2xl font-bold text-gray-900">{stockOut}</p>
                  <p className="text-xs text-gray-500">{stockOutUnits} units</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Net Movement</p>
                  <p className="text-2xl font-bold text-gray-900">{netMovement > 0 ? '+' : ''}{netMovement}</p>
                  <p className="text-xs text-gray-500">units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Search by Movement ID, product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
              <select
                value={movementTypeFilter}
                onChange={(e) => setMovementTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option>All Movement Types</option>
                <option>Purchase Receipt</option>
                <option>Sale/Usage</option>
                <option>Stock Adjustment</option>
                <option>Branch Transfer</option>
                <option>Supplier Return</option>
                <option>Damage/Loss</option>
              </select>
              <select
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option>All Directions</option>
                <option>IN</option>
                <option>OUT</option>
              </select>
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option>All Products</option>
                {products.map(product => (
                  <option key={product.id} value={product.product_name}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Stock Movements</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movement Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Direction</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Before/After</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-blue-600 font-medium text-sm">{movement.movement_id}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{movement.product}</div>
                        {movement.product_sku && (
                          <div className="text-xs text-gray-500">{movement.product_sku}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getMovementTypeBadge(movement.movement_type)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {getDirectionBadge(movement.direction)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{movement.quantity}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{movement.stock_before} → {movement.stock_after}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-900">{movement.reason || '-'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{movement.movement_date ? formatDate(movement.movement_date) : '-'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => router.push(`/inventory/stock-movements/${movement.id}`)}
                          title="View"
                          className="p-1.5 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredMovements.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No stock movements found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
