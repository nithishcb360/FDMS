'use client'

import React from 'react'
import { VehicleAssignmentData } from '@/lib/api/vehicle-assignments'
import { VehicleData } from '@/lib/api/vehicles'

interface ViewVehicleAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  assignment: VehicleAssignmentData | null
  vehicles: VehicleData[]
}

export default function ViewVehicleAssignmentModal({ isOpen, onClose, assignment, vehicles }: ViewVehicleAssignmentModalProps) {
  if (!isOpen || !assignment) return null

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return 'Unknown Vehicle'
    return `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
  }

  const formatDateTime = (date: string | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
              <h2 className="text-2xl font-bold text-gray-900">Assignment Details</h2>
              <p className="text-sm text-gray-500 mt-1">Assignment #{assignment.id}</p>
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
            {/* Basic Information */}
            <InfoSection
              title="Basic Information"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <InfoField label="Vehicle" value={getVehicleInfo(assignment.vehicle_id)} />
              <InfoField label="Assignment Type" value={assignment.assignment_type} />
              <InfoField label="Case Reference" value={assignment.case_reference} />
              <InfoField label="Service Reference" value={assignment.service_reference} />
            </InfoSection>

            {/* Schedule */}
            <InfoSection
              title="Schedule"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            >
              <InfoField label="Scheduled Start" value={formatDateTime(assignment.scheduled_start)} />
              <InfoField label="Scheduled End" value={formatDateTime(assignment.scheduled_end)} />
              <InfoField label="Actual Start" value={formatDateTime(assignment.actual_start)} />
              <InfoField label="Actual End" value={formatDateTime(assignment.actual_end)} />
            </InfoSection>

            {/* Location & Distance */}
            <InfoSection
              title="Location & Distance"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <InfoField label="Pickup Location" value={assignment.pickup_location} />
              <InfoField label="Dropoff Location" value={assignment.dropoff_location} />
              <InfoField
                label="Estimated Distance"
                value={assignment.estimated_distance ? `${assignment.estimated_distance} miles` : 'N/A'}
              />
              <InfoField
                label="Actual Distance"
                value={assignment.actual_distance ? `${assignment.actual_distance} miles` : 'N/A'}
              />
            </InfoSection>

            {/* Driver & Mileage */}
            <InfoSection
              title="Driver & Mileage"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              <InfoField label="Driver" value={assignment.driver} />
              <InfoField label="Backup Driver" value={assignment.backup_driver} />
              <InfoField label="Start Mileage" value={assignment.start_mileage} />
              <InfoField label="End Mileage" value={assignment.end_mileage} />
            </InfoSection>

            {/* Status & Priority */}
            <InfoSection
              title="Status & Priority"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  assignment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  assignment.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  assignment.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {assignment.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Priority</p>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                  assignment.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                  assignment.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                  assignment.priority === 'Normal' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {assignment.priority}
                </span>
              </div>
            </InfoSection>

            {/* Notes */}
            {assignment.notes && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <div className="text-[#D4AF37]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                </div>
                <div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.notes}</p>
                </div>
              </div>
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
