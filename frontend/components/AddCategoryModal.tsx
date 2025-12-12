'use client';

import { useState, useEffect } from 'react';
import { CategoryData, categoriesApi } from '@/lib/api/categories';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: CategoryFormData) => void;
  editData?: CategoryData;
  isEditMode?: boolean;
}

interface CategoryFormData {
  category_id: string;
  category_name: string;
  category_type: string;
  parent_category: string;
  description: string;
  display_order: number;
  status: string;
}

export default function AddCategoryModal({ isOpen, onClose, onSave, editData, isEditMode = false }: AddCategoryModalProps) {
  const initialFormData: CategoryFormData = {
    category_id: '',
    category_name: '',
    category_type: '',
    parent_category: '',
    description: '',
    display_order: 0,
    status: 'Active',
  };

  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [existingCategories, setExistingCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (isEditMode && editData) {
        setFormData({
          category_id: editData.category_id || '',
          category_name: editData.category_name || '',
          category_type: editData.category_type || '',
          parent_category: editData.parent_category || '',
          description: editData.description || '',
          display_order: editData.display_order || 0,
          status: editData.status || 'Active',
        });
      } else {
        setFormData(initialFormData);
      }
    }
  }, [isEditMode, editData, isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setExistingCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'display_order' ? parseInt(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  const categoryTypes = [
    'Casket',
    'Urn',
    'Burial Vault',
    'Memorial Products',
    'Funeral Supplies',
    'Equipment',
    'Vehicle Parts',
    'Stationery & Programs',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Category</h2>
              <p className="text-sm text-gray-500 mt-1">Add a new category to organize your inventory</p>
            </div>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-180px)]">
          <div className="overflow-y-auto p-6 space-y-6">
            {/* Category Information Section */}
            <div className="border-l-4 border-yellow-400 pl-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">i</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Category Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="category_name"
                    value={formData.category_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category_type"
                    value={formData.category_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">---------</option>
                    {categoryTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <p className="text-xs text-blue-600 mt-1">Main classification for this category</p>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Brief description of what products belong in this category"
                />
              </div>
            </div>

            {/* Hierarchy & Organization Section */}
            <div className="border-l-4 border-yellow-400 pl-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">🏛</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Hierarchy & Organization</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Category
                  </label>
                  <select
                    name="parent_category"
                    value={formData.parent_category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">---------</option>
                    {existingCategories.map((cat) => (
                      <option key={cat.id} value={cat.category_name}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-start gap-2 mt-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs">i</span>
                    </div>
                    <p className="text-xs text-blue-600">Leave blank for top-level category, or select a parent to create a subcategory</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sort order in lists (lower numbers appear first)</p>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="border-l-4 border-yellow-400 pl-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold text-sm">●</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Status</h3>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === 'Active'}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.checked ? 'Active' : 'Inactive' }))}
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                  />
                  <span className="font-medium text-gray-700">Active Category</span>
                </label>
                <p className="text-xs text-gray-600 mt-2 ml-6">Inactive categories will not appear in dropdown lists when creating new products</p>
              </div>
            </div>

            {/* Category Hierarchy Tips */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Category Hierarchy Tips</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><strong>Top-level categories:</strong> Leave &quot;Parent Category&quot; blank (e.g., &quot;Caskets&quot;, &quot;Urns&quot;, &quot;Merchandise&quot;)</li>
                    <li><strong>Subcategories:</strong> Select a parent category (e.g., &quot;Wood Caskets&quot; under &quot;Caskets&quot;)</li>
                    <li><strong>Display Order:</strong> Use numbers like 10, 20, 30 to allow easy reordering later</li>
                    <li><strong>Category Types:</strong> Match the type to the products that will be in this category</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="border-t bg-gray-50 p-4 flex justify-start gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-800 text-white rounded hover:bg-gray-900 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Category
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
