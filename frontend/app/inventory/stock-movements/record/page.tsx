'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { stockMovementsApi } from '@/lib/api/stock-movements';
import { productsApi, ProductData } from '@/lib/api/products';
import { purchaseOrdersApi, PurchaseOrderData } from '@/lib/api/purchase-orders';
import { casesApi, CaseData } from '@/lib/api/cases';

export default function RecordStockMovementPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductData[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderData[]>([]);
  const [cases, setCases] = useState<CaseData[]>([]);

  const [formData, setFormData] = useState({
    product: '',
    branch: '',
    movement_type: '',
    direction: '',
    quantity: 0,
    purchase_order: '',
    case_id: '',
    reason: '',
    movement_date: new Date().toISOString().slice(0, 16),
    additional_notes: '',
  });

  useEffect(() => {
    fetchProducts();
    fetchPurchaseOrders();
    fetchCases();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const data = await purchaseOrdersApi.getAll();
      setPurchaseOrders(data);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  };

  const fetchCases = async () => {
    try {
      const data = await casesApi.getAll();
      setCases(data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await stockMovementsApi.create({
        ...formData,
        product_sku: products.find(p => p.product_name === formData.product)?.sku || '',
        stock_before: 0,
        stock_after: formData.direction === 'IN' ? formData.quantity : -formData.quantity,
      });
      router.push('/inventory/stock-movements');
    } catch (error) {
      console.error('Error creating stock movement:', error);
      alert('Failed to record stock movement');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value,
    }));
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
                <a href="/inventory/stock-movements" className="text-blue-600 hover:underline">Stock Movements</a>
                <span>/</span>
                <span className="text-gray-900">Record Movement</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Record Stock Movement</h1>
              </div>
            </div>
            <button
              onClick={() => router.push('/inventory/stock-movements')}
              className="px-4 py-2 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to List
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Movement Details and References */}
              <div className="lg:col-span-2 space-y-6">
                {/* Movement Details */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Movement Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      >
                        <option value="">---------</option>
                        {products.map(product => (
                          <option key={product.id} value={product.product_name}>
                            {product.product_id} - {product.product_name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Select the product for this movement</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Branch <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      >
                        <option value="">---------</option>
                        <option value="Main Branch">Main Branch</option>
                        <option value="Branch 1">Branch 1</option>
                        <option value="Branch 2">Branch 2</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Movement Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="movement_type"
                        value={formData.movement_type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      >
                        <option value="">---------</option>
                        <option value="Purchase Receipt">Purchase Receipt</option>
                        <option value="Sale/Usage">Sale/Usage</option>
                        <option value="Stock Adjustment">Stock Adjustment</option>
                        <option value="Branch Transfer">Branch Transfer</option>
                        <option value="Supplier Return">Supplier Return</option>
                        <option value="Damage/Loss">Damage/Loss</option>
                      </select>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-xs text-gray-500">Select the type of stock movement</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Direction <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="direction"
                        value={formData.direction}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      >
                        <option value="">---------</option>
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="inline-flex items-center">
                          <svg className="w-3 h-3 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          IN = Stock coming in
                        </span>
                        <span className="inline-flex items-center ml-3">
                          <svg className="w-3 h-3 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          OUT = Stock going out
                        </span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Enter the quantity being moved</p>
                    </div>
                  </div>
                </div>

                {/* References and Reason */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">References and Reason</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Order (Optional)
                      </label>
                      <select
                        name="purchase_order"
                        value={formData.purchase_order}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">---------</option>
                        {purchaseOrders.map(po => (
                          <option key={po.id} value={po.po_number}>
                            {po.po_number}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Link to a purchase order if applicable</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Case (Optional)
                      </label>
                      <select
                        name="case_id"
                        value={formData.case_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="">---------</option>
                        {cases.map(c => (
                          <option key={c.id} value={c.case_id}>
                            {c.case_id}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Link to a case if product was used for a funeral</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Movement Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="movement_date"
                        value={formData.movement_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Brief reason for this movement</p>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="additional_notes"
                        value={formData.additional_notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Important Information */}
              <div className="space-y-6">
                {/* Stock Level Update */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-blue-800 mb-1">Stock Level Update</h3>
                      <p className="text-xs text-blue-700">
                        Recording this movement will automatically update the product's stock level.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-semibold text-yellow-800 mb-2">Important Notes:</h3>
                      <ul className="text-xs text-yellow-700 space-y-1 list-disc list-inside">
                        <li>Stock movements cannot be edited after creation</li>
                        <li>Ensure all details are correct before submitting</li>
                        <li>Stock levels will be updated immediately</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Movement Types */}
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-sm font-semibold text-gray-900">Movement Types</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium whitespace-nowrap">IN</span>
                      <span className="text-xs text-gray-700">Purchase Receipt:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium whitespace-nowrap">OUT</span>
                      <span className="text-xs text-gray-700">Sale/Usage:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-xs font-medium whitespace-nowrap">IN/OUT</span>
                      <span className="text-xs text-gray-700">Stock Adjustment:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded text-xs font-medium whitespace-nowrap">IN/OUT</span>
                      <span className="text-xs text-gray-700">Branch Transfer:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium whitespace-nowrap">OUT</span>
                      <span className="text-xs text-gray-700">Supplier Return:</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium whitespace-nowrap">OUT</span>
                      <span className="text-xs text-gray-700">Damage/Loss:</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Record Movement
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/inventory/stock-movements')}
                    className="w-full px-6 py-3 bg-yellow-500 text-gray-900 rounded hover:bg-yellow-600 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
