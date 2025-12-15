'use client'

import React from 'react'
import { VehicleData } from '@/lib/api/vehicles'

interface ViewVehicleModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: VehicleData | null
}

export default function ViewVehicleModal({ isOpen, onClose, vehicle }: ViewVehicleModalProps) {
  if (!isOpen || !vehicle) return null

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString()
  }

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return 'N/A'
    return `$${typeof amount === 'number' ? amount.toFixed(2) : parseFloat(amount as any || '0').toFixed(2)}`
  }

  const InfoSection = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
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

  const InfoField = ({ label, value }: { label: string; value: string | number | undefined | null }) => (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value || 'N/A'}</p>
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
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
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

          {/* Content */}
          <div className="px-6 py-6">
            {/* Identification */}
            <InfoSection
              title="Identification"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
            >
              <InfoField label="Vehicle Type" value={vehicle.vehicle_type} />
              <InfoField label="Branch" value={vehicle.branch} />
            </InfoSection>

            {/* Vehicle Details */}
            <InfoSection
              title="Vehicle Details"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <InfoField label="Make" value={vehicle.make} />
              <InfoField label="Model" value={vehicle.model} />
              <InfoField label="Year" value={vehicle.year} />
              <InfoField label="Color" value={vehicle.color} />
              <InfoField label="VIN" value={vehicle.vin} />
              <InfoField label="License Plate" value={vehicle.license_plate} />
            </InfoSection>

            {/* Technical Specifications */}
            <InfoSection
              title="Technical Specifications"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <InfoField label="Fuel Type" value={vehicle.fuel_type} />
              <InfoField label="Tank Capacity" value={vehicle.tank_capacity ? `${vehicle.tank_capacity} L` : 'N/A'} />
              <InfoField label="Seating Capacity" value={vehicle.seating_capacity} />
              <InfoField label="Cargo Capacity" value={vehicle.cargo_capacity ? `${vehicle.cargo_capacity} L` : 'N/A'} />
            </InfoSection>

            {/* Status & Condition */}
            <InfoSection
              title="Status & Condition"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <InfoField label="Status" value={vehicle.status} />
              <InfoField label="Condition" value={vehicle.condition} />
              <InfoField label="Ownership Type" value={vehicle.ownership_type} />
            </InfoSection>

            {/* Mileage Tracking */}
            <InfoSection
              title="Mileage Tracking"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            >
              <InfoField label="Current Mileage" value={vehicle.current_mileage ? `${vehicle.current_mileage} km` : 'N/A'} />
              <InfoField label="Purchase Mileage" value={vehicle.purchase_mileage ? `${vehicle.purchase_mileage} km` : 'N/A'} />
            </InfoSection>

            {/* Financial Information */}
            <InfoSection
              title="Financial Information"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <InfoField label="Purchase Price" value={formatCurrency(vehicle.purchase_price)} />
              <InfoField label="Purchase Date" value={formatDate(vehicle.purchase_date)} />
              <InfoField label="Monthly Lease Amount" value={formatCurrency(vehicle.monthly_lease_amount)} />
            </InfoSection>

            {/* Insurance & Registration */}
            <InfoSection
              title="Insurance & Registration"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              <InfoField label="Insurance Company" value={vehicle.insurance_company} />
              <InfoField label="Policy Number" value={vehicle.policy_number} />
              <InfoField label="Insurance Expiry" value={formatDate(vehicle.insurance_expiry_date)} />
              <InfoField label="Registration Expiry" value={formatDate(vehicle.registration_expiry_date)} />
            </InfoSection>

            {/* Maintenance Tracking */}
            <InfoSection
              title="Maintenance Tracking"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <InfoField label="Last Service Date" value={formatDate(vehicle.last_service_date)} />
              <InfoField label="Last Service Mileage" value={vehicle.last_service_mileage ? `${vehicle.last_service_mileage} km` : 'N/A'} />
              <InfoField label="Next Service Due Date" value={formatDate(vehicle.next_service_due_date)} />
              <InfoField label="Next Service Due Mileage" value={vehicle.next_service_due_mileage ? `${vehicle.next_service_due_mileage} km` : 'N/A'} />
            </InfoSection>

            {/* Additional Information */}
            {vehicle.notes && (
              <InfoSection
                title="Additional Information"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                }
              >
                <div className="md:col-span-2">
                  <InfoField label="Notes" value={vehicle.notes} />
                </div>
              </InfoSection>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
