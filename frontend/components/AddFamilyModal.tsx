'use client';

import { useState, useEffect } from 'react';
import { familiesApi, FamilyData } from '@/lib/api/families';

interface AddFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  family?: FamilyData | null;
}

export default function AddFamilyModal({ isOpen, onClose, onSave, family }: AddFamilyModalProps) {
  const [formData, setFormData] = useState({
    primary_contact_name: '',
    phone: '',
    email: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    preferred_language: 'English',
    communication_preference: 'Email',
    tags: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (family) {
      setFormData({
        primary_contact_name: family.primary_contact_name || '',
        phone: family.phone || '',
        email: family.email || '',
        street_address: family.street_address || '',
        city: family.city || '',
        state: family.state || '',
        zip_code: family.zip_code || '',
        country: family.country || 'USA',
        preferred_language: family.preferred_language || 'English',
        communication_preference: family.communication_preference || 'Email',
        tags: family.tags ? JSON.stringify(family.tags) : '',
        notes: family.notes || ''
      });
    } else {
      resetForm();
    }
  }, [family, isOpen]);

  const resetForm = () => {
    setFormData({
      primary_contact_name: '',
      phone: '',
      email: '',
      street_address: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'USA',
      preferred_language: 'English',
      communication_preference: 'Email',
      tags: '',
      notes: ''
    });
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.primary_contact_name.trim()) newErrors.primary_contact_name = 'Primary contact name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.street_address.trim()) newErrors.street_address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let tagsArray: string[] = [];
      if (formData.tags) {
        try {
          tagsArray = JSON.parse(formData.tags);
        } catch {
          tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);
        }
      }

      const submitData: any = {
        primary_contact_name: formData.primary_contact_name,
        phone: formData.phone,
        email: formData.email,
        street_address: formData.street_address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country || null,
        preferred_language: formData.preferred_language || null,
        communication_preference: formData.communication_preference || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        notes: formData.notes || null
      };

      if (family?.id) {
        await familiesApi.update(family.id, submitData);
      } else {
        await familiesApi.create(submitData);
      }

      onSave();
      resetForm();
    } catch (error) {
      console.error('Error saving family:', error);
      alert('Failed to save family. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <h2 className="text-xl font-semibold text-gray-900">{family ? 'Edit Family' : 'Add Family'}</h2>
          <p className="text-sm text-gray-600">Add a new family to CRM</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👤 Primary Contact</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Name <span className="text-red-500">*</span></label>
                <input type="text" name="primary_contact_name" value={formData.primary_contact_name} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.primary_contact_name ? 'border-red-500' : 'border-gray-300')} />
                {errors.primary_contact_name && <p className="text-red-500 text-xs mt-1">{errors.primary_contact_name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-red-500">*</span></label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.phone ? 'border-red-500' : 'border-gray-300')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.email ? 'border-red-500' : 'border-gray-300')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📍 Address</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address <span className="text-red-500">*</span></label>
                <textarea name="street_address" value={formData.street_address} onChange={handleChange} rows={2} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.street_address ? 'border-red-500' : 'border-gray-300')} />
                {errors.street_address && <p className="text-red-500 text-xs mt-1">{errors.street_address}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.city ? 'border-red-500' : 'border-gray-300')} />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.state ? 'border-red-500' : 'border-gray-300')} />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code <span className="text-red-500">*</span></label>
                  <input type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} className={'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ' + (errors.zip_code ? 'border-red-500' : 'border-gray-300')} />
                  {errors.zip_code && <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
                <select name="preferred_language" value={formData.preferred_language} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Communication Preference</label>
                <select name="communication_preference" value={formData.communication_preference} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="SMS">SMS</option>
                  <option value="Mail">Mail</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Additional Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <textarea name="tags" value={formData.tags} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder='Enter tags as JSON array: ["tag1", "tag2"]' />
                <p className="text-xs text-gray-500 mt-1">Enter tags as JSON array: ["tag1", "tag2"]</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50" disabled={isSubmitting}>✖ Cancel</button>
            <button type="submit" className="px-6 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 disabled:bg-gray-400" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : (family ? '💾 Update Family' : '💾 Add Family')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
