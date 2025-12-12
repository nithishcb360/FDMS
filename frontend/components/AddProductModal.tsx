'use client';

import { useState, useEffect } from 'react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: any;
  isEditMode?: boolean;
}

export default function AddProductModal({ isOpen, onClose, onSave, editData, isEditMode = false }: AddProductModalProps) {
  const initialFormData = {
    // Basic fields supported by backend
    product_id: '',
    sku: '',
    product_name: '',
    category: '',
    product_type: '',
    stock: 0,
    cost_price: 0,
    selling_price: 0,
    status: 'Active',
    unit: 'Each',
    description: '',
    supplier: '',
    reorder_level: 5,
    // Extended fields for comprehensive form
    barcode: '',
    supplier_sku: '',
    primary_supplier: '',
    reorder_quantity: 10,
    minimum_stock: 0,
    maximum_stock: 100,
    weight: 0,
    dimensions: '',
    manufacturer: '',
    model_number: '',
    material: '',
    color: '',
    is_featured: false,
    is_taxable: true,
    lead_time_days: 0,
    internal_notes: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [trackInventory, setTrackInventory] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && editData) {
        setFormData({ ...initialFormData, ...editData });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isOpen, isEditMode, editData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      // Send only backend-supported fields
      const dataToSave = {
        product_id: formData.product_id,
        sku: formData.sku,
        product_name: formData.product_name,
        category: formData.category,
        product_type: formData.product_type,
        stock: formData.stock,
        cost_price: formData.cost_price,
        selling_price: formData.selling_price,
        status: formData.status,
        unit: formData.unit,
        description: formData.description,
        supplier: formData.supplier,
        reorder_level: formData.reorder_level,
      };

      const finalData = isEditMode && editData?.id
        ? { ...dataToSave, id: editData.id }
        : dataToSave;
      onSave(finalData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isEditMode ? 'Edit Product' : 'New Product'}
                </h2>
                <p className="text-xs text-white/90">
                  {isEditMode ? 'Update product to inventory' : 'Add a new product to inventory'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">ℹ️</span>
                <h3 className="font-semibold text-gray-800">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Barcode (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="product_type"
                    value={formData.product_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm bg-white"
                  >
                    <option value="">----------</option>
                    <option value="Casket">Casket</option>
                    <option value="Urn">Urn</option>
                    <option value="Vault">Vault</option>
                    <option value="Memorial">Memorial</option>
                    <option value="Supply">Supply</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm bg-white"
                  >
                    <option value="">----------</option>
                    <option value="Caskets - Metal">Caskets - Metal</option>
                    <option value="Caskets - Wood">Caskets - Wood</option>
                    <option value="Caskets - Oak">Caskets - Oak</option>
                    <option value="Urns - Brass">Urns - Brass</option>
                    <option value="Urns - Ceramic">Urns - Ceramic</option>
                    <option value="Burial Vaults">Burial Vaults</option>
                    <option value="Memorial Stones">Memorial Stones</option>
                    <option value="Embalming Supplies">Embalming Supplies</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none text-sm"
                  placeholder="Product description"
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">🏢</span>
                <h3 className="font-semibold text-gray-800">Supplier Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Supplier</label>
                  <select
                    name="primary_supplier"
                    value={formData.primary_supplier}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm bg-white"
                  >
                    <option value="">----------</option>
                    <option value="Supplier A">Supplier A</option>
                    <option value="Supplier B">Supplier B</option>
                    <option value="Supplier C">Supplier C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier SKU</label>
                  <input
                    type="text"
                    name="supplier_sku"
                    value={formData.supplier_sku}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Supplier SKU"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">💲</span>
                <h3 className="font-semibold text-gray-800">Pricing</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      name="cost_price"
                      value={formData.cost_price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Purchase cost from supplier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      name="selling_price"
                      value={formData.selling_price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Price to customers</p>
                </div>
              </div>
            </div>

            {/* Inventory Tracking */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">📊</span>
                <h3 className="font-semibold text-gray-800">Inventory Tracking</h3>
              </div>

              <div className="mb-3">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={trackInventory}
                    onChange={(e) => setTrackInventory(e.target.checked)}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="font-medium text-gray-700">Track inventory for this product</span>
                </label>
              </div>

              {trackInventory && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
                      <input
                        type="number"
                        name="reorder_level"
                        value={formData.reorder_level}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                        placeholder="5"
                      />
                      <p className="text-xs text-gray-500 mt-1">Alert when stock reaches this level</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Quantity</label>
                      <input
                        type="number"
                        name="reorder_quantity"
                        value={formData.reorder_quantity}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                      <input
                        type="number"
                        name="minimum_stock"
                        value={formData.minimum_stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Stock</label>
                      <input
                        type="number"
                        name="maximum_stock"
                        value={formData.maximum_stock}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                        placeholder="100"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Unit & Measurements */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">📏</span>
                <h3 className="font-semibold text-gray-800">Unit & Measurements</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm bg-white"
                  >
                    <option value="Each">Each</option>
                    <option value="Box">Box</option>
                    <option value="Pack">Pack</option>
                    <option value="Set">Set</option>
                    <option value="Gallon">Gallon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="L x W x H"
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">📋</span>
                <h3 className="font-semibold text-gray-800">Product Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Manufacturer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model Number</label>
                  <input
                    type="text"
                    name="model_number"
                    value={formData.model_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Model #"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="e.g., Steel, Wood, Brass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                    placeholder="Product color"
                  />
                </div>
              </div>
            </div>

            {/* Status & Additional */}
            <div>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-yellow-500">
                <span className="text-yellow-600">⚙️</span>
                <h3 className="font-semibold text-gray-800">Status & Additional</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Active Product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Product</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_taxable"
                    checked={formData.is_taxable}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Taxable</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Time (days)</label>
                <input
                  type="number"
                  name="lead_time_days"
                  value={formData.lead_time_days}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Days required to receive from supplier</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea
                  name="internal_notes"
                  value={formData.internal_notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none resize-none text-sm"
                  placeholder="Internal notes (not visible to customers)"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium transition-colors"
            >
              <span className="mr-2">✕</span>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-800 text-white rounded hover:bg-slate-900 font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isEditMode ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
