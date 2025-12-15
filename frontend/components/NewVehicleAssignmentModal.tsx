'use client'

import React, { useState, useCallback, memo } from 'react'
import { vehicleAssignmentsApi, VehicleAssignmentData } from '@/lib/api/vehicle-assignments'
import { VehicleData } from '@/lib/api/vehicles'

interface NewVehicleAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssignmentCreated: () => void
  vehicles: VehicleData[]
}

const FormSection = memo(({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
      <div className="text-[#D4AF37]">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
))

export default function NewVehicleAssignmentModal({ isOpen, onClose, onAssignmentCreated, vehicles }: NewVehicleAssignmentModalProps) {
  const [formData, setFormData] = useState<Partial<VehicleAssignmentData>>({
    vehicle_id: 0,
    assignment_type: '',
    case_reference: '',
    service_reference: '',
    scheduled_start: '',
    scheduled_end: '',
    actual_start: '',
    actual_end: '',
    pickup_location: '',
    dropoff_location: '',
    estimated_distance: 0,
    actual_distance: 0,
    driver: '',
    backup_driver: '',
    start_mileage: 0,
    end_mileage: 0,
    status: 'Scheduled',
    priority: 'Normal',
    notes: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.vehicle_id || formData.vehicle_id === 0) {
      alert('Please select a vehicle')
      return
    }
    if (!formData.assignment_type) {
      alert('Please select an assignment type')
      return
    }
    if (!formData.scheduled_start) {
      alert('Please enter scheduled start time')
      return
    }
    if (!formData.scheduled_end) {
      alert('Please enter scheduled end time')
      return
    }
    if (!formData.pickup_location) {
      alert('Please enter pickup location')
      return
    }
    if (!formData.dropoff_location) {
      alert('Please enter dropoff location')
      return
    }

    try {
      // Convert datetime-local values to ISO format for backend
      const submitData = {
        ...formData,
        scheduled_start: formData.scheduled_start ? new Date(formData.scheduled_start).toISOString() : '',
        scheduled_end: formData.scheduled_end ? new Date(formData.scheduled_end).toISOString() : '',
        actual_start: formData.actual_start ? new Date(formData.actual_start).toISOString() : undefined,
        actual_end: formData.actual_end ? new Date(formData.actual_end).toISOString() : undefined,
      }

      await vehicleAssignmentsApi.create(submitData as Omit<VehicleAssignmentData, 'id' | 'created_at' | 'updated_at'>)
      onAssignmentCreated()
      // Reset form
      setFormData({
        vehicle_id: 0,
        assignment_type: '',
        case_reference: '',
        service_reference: '',
        scheduled_start: '',
        scheduled_end: '',
        actual_start: '',
        actual_end: '',
        pickup_location: '',
        dropoff_location: '',
        estimated_distance: 0,
        actual_distance: 0,
        driver: '',
        backup_driver: '',
        start_mileage: 0,
        end_mileage: 0,
        status: 'Scheduled',
        priority: 'Normal',
        notes: '',
      })
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Failed to create assignment. Please try again.')
    }
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : 0 }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }, [])

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
              <h2 className="text-2xl font-bold text-gray-900">New Vehicle Assignment</h2>
              <p className="text-sm text-gray-500 mt-1">Create a new vehicle assignment</p>
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
              {/* Basic Information */}
              <FormSection
                title="Basic Information"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="vehicle_id"
                    value={formData.vehicle_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value={0}>---------</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assignment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assignment_type"
                    value={formData.assignment_type}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value="">---------</option>
                    <option value="Service">Service</option>
                    <option value="Transport">Transport</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Case Reference</label>
                  <input
                    type="text"
                    name="case_reference"
                    value={formData.case_reference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Reference</label>
                  <input
                    type="text"
                    name="service_reference"
                    value={formData.service_reference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </FormSection>

              {/* Schedule */}
              <FormSection
                title="Schedule"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Start <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_start"
                    value={formData.scheduled_start || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled End <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_end"
                    value={formData.scheduled_end || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Start</label>
                  <input
                    type="datetime-local"
                    name="actual_start"
                    value={formData.actual_start || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual End</label>
                  <input
                    type="datetime-local"
                    name="actual_end"
                    value={formData.actual_end || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </FormSection>

              {/* Location & Distance */}
              <FormSection
                title="Location & Distance"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pickup_location"
                    value={formData.pickup_location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dropoff Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dropoff_location"
                    value={formData.dropoff_location}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Distance (miles)</label>
                  <input
                    type="number"
                    name="estimated_distance"
                    value={formData.estimated_distance}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Distance (miles)</label>
                  <input
                    type="number"
                    name="actual_distance"
                    value={formData.actual_distance}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </FormSection>

              {/* Driver & Mileage */}
              <FormSection
                title="Driver & Mileage"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver</label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="---------"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup Driver</label>
                  <input
                    type="text"
                    name="backup_driver"
                    value={formData.backup_driver}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                    placeholder="---------"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Mileage</label>
                  <input
                    type="number"
                    name="start_mileage"
                    value={formData.start_mileage}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Mileage</label>
                  <input
                    type="number"
                    name="end_mileage"
                    value={formData.end_mileage}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </FormSection>

              {/* Status & Priority */}
              <FormSection
                title="Status & Priority"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </FormSection>

              {/* Notes */}
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
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  />
                </div>
              </div>
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
                Create Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
