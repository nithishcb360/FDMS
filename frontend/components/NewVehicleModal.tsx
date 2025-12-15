'use client';

import { useState, useEffect } from 'react';
import { vehiclesApi } from '@/lib/api/vehicles';

interface NewVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated?: () => void;
}

const VEHICLE_TYPES = [
  'Hearse',
  'Limousine',
  'Service Van',
  'Flower Car',
  'Lead Car',
  'Family Car',
];

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
const STATUSES = ['Available', 'In Use', 'Maintenance', 'Retired'];
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Poor'];
const OWNERSHIP_TYPES = ['Owned', 'Leased', 'Rented'];

export default function NewVehicleModal({ isOpen, onClose, onVehicleCreated }: NewVehicleModalProps) {
  const [formData, setFormData] = useState({
    // Identification
    vehicle_type: '',
    branch: '',

    // Vehicle Details
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    color: 'Black',
    vin: '',
    license_plate: '',

    // Technical Specifications
    fuel_type: 'Gasoline',
    tank_capacity: '0',
    seating_capacity: '0',
    cargo_capacity: '0',

    // Status & Condition
    status: 'Available',
    condition: 'Good',
    ownership_type: 'Owned',

    // Mileage Tracking
    current_mileage: '0',
    purchase_mileage: '0',

    // Financial Information
    purchase_price: '0',
    purchase_date: '',
    monthly_lease_amount: '0',

    // Insurance & Registration
    insurance_company: '',
    policy_number: '',
    insurance_expiry_date: '',
    registration_expiry_date: '',

    // Maintenance Tracking
    last_service_date: '',
    last_service_mileage: '0',
    next_service_due_date: '',
    next_service_due_mileage: '0',

    // Additional Information
    notes: '',
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        vehicle_type: '',
        branch: '',
        make: '',
        model: '',
        year: new Date().getFullYear().toString(),
        color: 'Black',
        vin: '',
        license_plate: '',
        fuel_type: 'Gasoline',
        tank_capacity: '0',
        seating_capacity: '0',
        cargo_capacity: '0',
        status: 'Available',
        condition: 'Good',
        ownership_type: 'Owned',
        current_mileage: '0',
        purchase_mileage: '0',
        purchase_price: '0',
        purchase_date: '',
        monthly_lease_amount: '0',
        insurance_company: '',
        policy_number: '',
        insurance_expiry_date: '',
        registration_expiry_date: '',
        last_service_date: '',
        last_service_mileage: '0',
        next_service_due_date: '',
        next_service_due_mileage: '0',
        notes: '',
        is_active: true,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await vehiclesApi.create({
        vehicle_type: formData.vehicle_type,
        branch: formData.branch || undefined,
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        color: formData.color || undefined,
        vin: formData.vin,
        license_plate: formData.license_plate,
        fuel_type: formData.fuel_type || undefined,
        tank_capacity: parseFloat(formData.tank_capacity),
        seating_capacity: parseInt(formData.seating_capacity),
        cargo_capacity: parseFloat(formData.cargo_capacity),
        status: formData.status,
        condition: formData.condition,
        ownership_type: formData.ownership_type,
        current_mileage: parseInt(formData.current_mileage),
        purchase_mileage: parseInt(formData.purchase_mileage),
        purchase_price: parseFloat(formData.purchase_price),
        purchase_date: formData.purchase_date || undefined,
        monthly_lease_amount: parseFloat(formData.monthly_lease_amount),
        insurance_company: formData.insurance_company || undefined,
        policy_number: formData.policy_number || undefined,
        insurance_expiry_date: formData.insurance_expiry_date || undefined,
        registration_expiry_date: formData.registration_expiry_date || undefined,
        last_service_date: formData.last_service_date || undefined,
        last_service_mileage: formData.last_service_mileage ? parseInt(formData.last_service_mileage) : undefined,
        next_service_due_date: formData.next_service_due_date || undefined,
        next_service_due_mileage: formData.next_service_due_mileage ? parseInt(formData.next_service_due_mileage) : undefined,
        notes: formData.notes || undefined,
        is_active: formData.is_active,
      });
      alert('Vehicle created successfully!');
      onVehicleCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating vehicle:', error);
      alert(error.response?.data?.detail || 'Failed to create vehicle. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checkbox.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-5xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Vehicle</h2>
              <p className="text-sm text-gray-600">Add a new vehicle to the fleet</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Identification */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Identification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  <option value="">---------</option>
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Vehicle Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g., Cadillac, Lincoln"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., XTS, Continental"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  placeholder="17-character Vehicle Identification Number"
                  required
                  maxLength={17}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">17-character VIN</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Plate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  placeholder="ABC-1234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Technical Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                <select
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  {FUEL_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tank Capacity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="tank_capacity"
                    value={formData.tank_capacity}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">Gallons</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                <input
                  type="number"
                  name="seating_capacity"
                  value={formData.seating_capacity}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cargo Capacity</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="cargo_capacity"
                    value={formData.cargo_capacity}
                    onChange={handleChange}
                    min="0"
                    step="0.1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  />
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">Cubic feet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Condition */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Status & Condition</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  {CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Type</label>
                <select
                  name="ownership_type"
                  value={formData.ownership_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                >
                  {OWNERSHIP_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mileage Tracking */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Mileage Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Mileage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="current_mileage"
                  value={formData.current_mileage}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Mileage</label>
                <input
                  type="number"
                  name="purchase_mileage"
                  value={formData.purchase_mileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Financial Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">$</span>
                  <input
                    type="number"
                    name="purchase_price"
                    value={formData.purchase_price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                <input
                  type="date"
                  name="purchase_date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Lease Amount</label>
                <div className="flex gap-2">
                  <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">$</span>
                  <input
                    type="number"
                    name="monthly_lease_amount"
                    value={formData.monthly_lease_amount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Insurance & Registration */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Insurance & Registration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Company</label>
                <input
                  type="text"
                  name="insurance_company"
                  value={formData.insurance_company}
                  onChange={handleChange}
                  placeholder="Insurance company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Policy Number</label>
                <input
                  type="text"
                  name="policy_number"
                  value={formData.policy_number}
                  onChange={handleChange}
                  placeholder="Policy number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Expiry Date</label>
                <input
                  type="date"
                  name="insurance_expiry_date"
                  value={formData.insurance_expiry_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Expiry Date</label>
                <input
                  type="date"
                  name="registration_expiry_date"
                  value={formData.registration_expiry_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Maintenance Tracking */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Maintenance Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Date</label>
                <input
                  type="date"
                  name="last_service_date"
                  value={formData.last_service_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Service Mileage</label>
                <input
                  type="number"
                  name="last_service_mileage"
                  value={formData.last_service_mileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Service Due Date</label>
                <input
                  type="date"
                  name="next_service_due_date"
                  value={formData.next_service_due_date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Next Service Due Mileage</label>
                <input
                  type="number"
                  name="next_service_due_mileage"
                  value={formData.next_service_due_mileage}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Additional Information</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this vehicle"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Active Vehicle</span>
              </label>
              <p className="text-xs text-gray-500 ml-6">Uncheck to deactivate this vehicle</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {submitting ? 'Creating...' : 'Create Vehicle'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-medium border border-gray-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
