'use client';

import { useState, useEffect } from 'react';
import { fuelLogsApi } from '@/lib/api/fuel-logs';
import { vehiclesApi, VehicleData } from '@/lib/api/vehicles';

interface NewFuelLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFuelLogCreated?: () => void;
}

const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];

export default function NewFuelLogModal({ isOpen, onClose, onFuelLogCreated }: NewFuelLogModalProps) {
  const [formData, setFormData] = useState({
    vehicle_id: '',
    date: new Date().toISOString().split('T')[0],
    fuel_type: 'Gasoline',
    quantity: '',
    cost: '',
    station: '',
    odometer_reading: '',
    mpg: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        vehicle_id: '',
        date: new Date().toISOString().split('T')[0],
        fuel_type: 'Gasoline',
        quantity: '',
        cost: '',
        station: '',
        odometer_reading: '',
        mpg: '',
        notes: '',
      });
      loadVehicles();
    }
  }, [isOpen]);

  const loadVehicles = async () => {
    try {
      const data = await vehiclesApi.getAll({ status: 'Available' });
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await fuelLogsApi.create({
        vehicle_id: parseInt(formData.vehicle_id),
        date: formData.date,
        fuel_type: formData.fuel_type,
        quantity: parseFloat(formData.quantity),
        cost: parseFloat(formData.cost),
        station: formData.station || undefined,
        odometer_reading: formData.odometer_reading ? parseInt(formData.odometer_reading) : undefined,
        mpg: formData.mpg ? parseFloat(formData.mpg) : undefined,
        notes: formData.notes || undefined,
      });
      alert('Fuel log created successfully!');
      onFuelLogCreated?.();
      onClose();
    } catch (error: any) {
      console.error('Error creating fuel log:', error);
      alert(error.response?.data?.detail || 'Failed to create fuel log. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center overflow-y-auto py-8">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.137 1.616.91 1.95l1.513.656a1 1 0 00.734.056L9.5 15.5v-1.323l-2.89-1.445A.996.996 0 015 13.274zm9.5 1.446A3.989 3.989 0 0013 12V8.777l-2 1v3.446l1.762.881a1 1 0 00.738-.034l1.5-.75z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">New Fuel Log</h2>
              <p className="text-sm text-gray-600">Record a new fuel transaction</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicle_id"
                value={formData.vehicle_id}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              >
                {FUEL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
                <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">gal</span>
              </div>
            </div>

            {/* Cost */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">$</span>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
                />
              </div>
            </div>

            {/* Station */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Station</label>
              <input
                type="text"
                name="station"
                value={formData.station}
                onChange={handleChange}
                placeholder="Gas station name/location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Odometer Reading */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Odometer Reading</label>
              <input
                type="number"
                name="odometer_reading"
                value={formData.odometer_reading}
                onChange={handleChange}
                min="0"
                placeholder="Miles"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* MPG */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">MPG</label>
              <input
                type="number"
                name="mpg"
                value={formData.mpg}
                onChange={handleChange}
                min="0"
                step="0.1"
                placeholder="Miles per gallon"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900"
              />
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this fuel transaction"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900"
              />
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
            {submitting ? 'Creating...' : 'Create Fuel Log'}
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
