'use client'

import React, { useState, useEffect } from 'react'
import { VehicleData } from '@/lib/api/vehicles'

interface EditVehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehicleData: Partial<VehicleData>) => void
  vehicle: VehicleData | null
}

export default function EditVehicleModal({ isOpen, onClose, onSave, vehicle }: EditVehicleModalProps) {
  const [formData, setFormData] = useState<Partial<VehicleData>>({})

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle)
    }
  }, [vehicle])

  if (!isOpen || !vehicle) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const FormSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
        <div className="text-[#D4AF37]">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  )

  const InputField = ({
    label,
    name,
    type = 'text',
    required = false,
    placeholder = ''
  }: {
    label: string;
    name: string;
    type?: string;
    required?: boolean;
    placeholder?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name as keyof VehicleData] as string || ''}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
      />
    </div>
  )

  const SelectField = ({
    label,
    name,
    options,
    required = false
  }: {
    label: string;
    name: string;
    options: string[];
    required?: boolean
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name as keyof VehicleData] as string || ''}
        onChange={handleChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
      >
        <option value="">Select {label}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  )

  const TextAreaField = ({
    label,
    name,
    rows = 3
  }: {
    label: string;
    name: string;
    rows?: number
  }) => (
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={formData[name as keyof VehicleData] as string || ''}
        onChange={handleChange}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
      />
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />

        <div
          className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Vehicle</h2>
              <p className="text-sm text-gray-500 mt-1">Update vehicle information</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              {/* Identification */}
              <FormSection
                title="Identification"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                }
              >
                <SelectField
                  label="Vehicle Type"
                  name="vehicle_type"
                  options={['Hearse', 'Limousine', 'Van', 'SUV', 'Sedan', 'Truck', 'Other']}
                  required
                />
                <InputField label="Branch" name="branch" />
              </FormSection>

              {/* Vehicle Details */}
              <FormSection
                title="Vehicle Details"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                <InputField label="Make" name="make" required placeholder="e.g., Toyota" />
                <InputField label="Model" name="model" required placeholder="e.g., Camry" />
                <InputField label="Year" name="year" type="number" required placeholder="e.g., 2023" />
                <InputField label="Color" name="color" placeholder="e.g., Black" />
                <InputField label="VIN" name="vin" required placeholder="17-character VIN" />
                <InputField label="License Plate" name="license_plate" required placeholder="e.g., ABC-1234" />
              </FormSection>

              {/* Technical Specifications */}
              <FormSection
                title="Technical Specifications"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                <SelectField
                  label="Fuel Type"
                  name="fuel_type"
                  options={['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'CNG']}
                />
                <InputField label="Tank Capacity (L)" name="tank_capacity" type="number" placeholder="e.g., 60" />
                <InputField label="Seating Capacity" name="seating_capacity" type="number" placeholder="e.g., 5" />
                <InputField label="Cargo Capacity (L)" name="cargo_capacity" type="number" placeholder="e.g., 500" />
              </FormSection>

              {/* Status & Condition */}
              <FormSection
                title="Status & Condition"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <SelectField
                  label="Status"
                  name="status"
                  options={['Available', 'In Use', 'Maintenance', 'Out of Service']}
                />
                <SelectField
                  label="Condition"
                  name="condition"
                  options={['Excellent', 'Good', 'Fair', 'Poor']}
                />
                <SelectField
                  label="Ownership Type"
                  name="ownership_type"
                  options={['Owned', 'Leased', 'Rented']}
                />
              </FormSection>

              {/* Mileage Tracking */}
              <FormSection
                title="Mileage Tracking"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              >
                <InputField label="Current Mileage (km)" name="current_mileage" type="number" placeholder="e.g., 50000" />
                <InputField label="Purchase Mileage (km)" name="purchase_mileage" type="number" placeholder="e.g., 0" />
              </FormSection>

              {/* Financial Information */}
              <FormSection
                title="Financial Information"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <InputField label="Purchase Price ($)" name="purchase_price" type="number" placeholder="e.g., 25000" />
                <InputField label="Purchase Date" name="purchase_date" type="date" />
                <InputField label="Monthly Lease Amount ($)" name="monthly_lease_amount" type="number" placeholder="e.g., 500" />
              </FormSection>

              {/* Insurance & Registration */}
              <FormSection
                title="Insurance & Registration"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                <InputField label="Insurance Company" name="insurance_company" placeholder="e.g., State Farm" />
                <InputField label="Policy Number" name="policy_number" placeholder="e.g., POL-123456" />
                <InputField label="Insurance Expiry Date" name="insurance_expiry_date" type="date" />
                <InputField label="Registration Expiry Date" name="registration_expiry_date" type="date" />
              </FormSection>

              {/* Maintenance Tracking */}
              <FormSection
                title="Maintenance Tracking"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                <InputField label="Last Service Date" name="last_service_date" type="date" />
                <InputField label="Last Service Mileage (km)" name="last_service_mileage" type="number" placeholder="e.g., 45000" />
                <InputField label="Next Service Due Date" name="next_service_due_date" type="date" />
                <InputField label="Next Service Due Mileage (km)" name="next_service_due_mileage" type="number" placeholder="e.g., 55000" />
              </FormSection>

              {/* Additional Information */}
              <FormSection
                title="Additional Information"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                }
              >
                <TextAreaField label="Notes" name="notes" rows={4} />
              </FormSection>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
