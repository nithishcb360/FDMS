'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { purchaseOrdersApi } from '@/lib/api/purchase-orders';
import { suppliersApi, SupplierData } from '@/lib/api/suppliers';
import { productsApi, ProductData } from '@/lib/api/products';

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  const [formData, setFormData] = useState({
    supplier: '',
    branch: '',
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery: '',
    tax_amount: 0,
    shipping_cost: 0,
    status: 'Draft',
    notes_to_supplier: '',
    internal_notes: '',
  });

  const [orderItems, setOrderItems] = useState([
    { product: '', quantity: 0, unit_price: 0, notes: '' },
    { product: '', quantity: 0, unit_price: 0, notes: '' },
    { product: '', quantity: 0, unit_price: 0, notes: '' },
    { product: '', quantity: 0, unit_price: 0, notes: '' },
    { product: '', quantity: 0, unit_price: 0, notes: '' },
  ]);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersApi.getAll();
      setSuppliers(data.filter(s => s.status === 'Active'));
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data.filter(p => p.status === 'Active'));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validItems = orderItems.filter(item => item.product && item.quantity > 0);
    const subtotal = validItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const total = subtotal + formData.tax_amount + formData.shipping_cost;

    try {
      await purchaseOrdersApi.create({
        ...formData,
        order_items: validItems,
        total_amount: total,
      });
      router.push('/inventory/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['tax_amount', 'shipping_cost'].includes(name) ? parseFloat(value) || 0 : value,
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrderItems(newItems);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
  };

  const calculateTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => {
      if (item.product && item.quantity > 0) {
        return sum + (item.quantity * item.unit_price);
      }
      return sum;
    }, 0);
    return subtotal + formData.tax_amount + formData.shipping_cost;
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
                <a href="/inventory/purchase-orders" className="text-blue-600 hover:underline">Purchase Orders</a>
                <span>/</span>
                <span className="text-gray-900">Create</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-800 p-2 rounded">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
              </div>
            </div>
            <button
              onClick={() => router.push('/inventory/purchase-orders')}
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
              {/* Left Column - Order Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Supplier <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      >
                        <option value="">---------</option>
                        {suppliers.map(supplier => (
                          <option key={supplier.id} value={supplier.supplier_name}>
                            {supplier.supplier_name}
                          </option>
                        ))}
                      </select>
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
                        Order Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="order_date"
                        value={formData.order_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Delivery Date
                      </label>
                      <input
                        type="date"
                        name="expected_delivery"
                        value={formData.expected_delivery}
                        onChange={handleChange}
                        placeholder="dd-mm-yyyy"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Product</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Quantity</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Unit Price</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Notes</th>
                          <th className="text-left text-sm font-medium text-gray-700 pb-2">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 pr-2">
                              <select
                                value={item.product}
                                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              >
                                <option value="">---------</option>
                                {products.map(product => (
                                  <option key={product.id} value={product.product_name}>
                                    {product.product_id} - {product.product_name}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="number"
                                step="0.01"
                                value={item.unit_price}
                                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              />
                            </td>
                            <td className="py-2 pr-2">
                              <input
                                type="text"
                                value={item.notes}
                                onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                              />
                            </td>
                            <td className="py-2 text-center">
                              <input
                                type="checkbox"
                                onChange={() => handleDeleteItem(index)}
                                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes (Visible to Supplier)
                      </label>
                      <textarea
                        name="notes_to_supplier"
                        value={formData.notes_to_supplier}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Internal Notes
                      </label>
                      <textarea
                        name="internal_notes"
                        value={formData.internal_notes}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Financial Details */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Financial Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tax Amount
                      </label>
                      <input
                        type="number"
                        name="tax_amount"
                        step="0.01"
                        value={formData.tax_amount}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Shipping Cost
                      </label>
                      <input
                        type="number"
                        name="shipping_cost"
                        step="0.01"
                        value={formData.shipping_cost}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Received">Received</option>
                      </select>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> Total amount will be calculated automatically from line items plus tax and shipping.
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Purchase Order
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/inventory/purchase-orders')}
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
