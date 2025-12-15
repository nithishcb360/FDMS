'use client';

import { useEffect, useState } from 'react';
import { fuelLogsApi, FuelLogData } from '@/lib/api/fuel-logs';
import { vehiclesApi, VehicleData } from '@/lib/api/vehicles';

interface ViewFuelLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  fuelLogId: number | null;
}

export default function ViewFuelLogModal({ isOpen, onClose, fuelLogId }: ViewFuelLogModalProps) {
  const [fuelLog, setFuelLog] = useState<FuelLogData | null>(null);
  const [vehicle, setVehicle] = useState<VehicleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && fuelLogId) {
      loadFuelLog();
    }
  }, [isOpen, fuelLogId]);

  const loadFuelLog = async () => {
    if (!fuelLogId) return;
    setLoading(true);
    try {
      const data = await fuelLogsApi.getById(fuelLogId);
      setFuelLog(data);

      // Load vehicle details
      const vehicleData = await vehiclesApi.getById(data.vehicle_id);
      setVehicle(vehicleData);
    } catch (error) {
      console.error('Error loading fuel log:', error);
      alert('Failed to load fuel log details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L11 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c-.25.78.137 1.616.91 1.95l1.513.656a1 1 0 00.734.056L9.5 15.5v-1.323l-2.89-1.445A.996.996 0 015 13.274zm9.5 1.446A3.989 3.989 0 0013 12V8.777l-2 1v3.446l1.762.881a1 1 0 00.738-.034l1.5-.75z" clipRule="evenodd" />
            </svg>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Fuel Log Details</h2>
              <p className="text-sm text-gray-600">View fuel transaction information</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading fuel log details...</p>
            </div>
          ) : fuelLog ? (
            <div className="space-y-6">
              {/* Log ID */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Log ID</h3>
                <p className="text-lg font-semibold text-gray-900">#{fuelLog.id}</p>
              </div>

              {/* Vehicle Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-medium text-gray-900">
                      {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Loading...'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License Plate</p>
                    <p className="font-medium text-gray-900 font-mono">
                      {vehicle?.license_plate || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fuel Details */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Fuel Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formatDate(fuelLog.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium text-gray-900">{fuelLog.fuel_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium text-gray-900">{fuelLog.quantity} gal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cost</p>
                    <p className="font-medium text-gray-900">${fuelLog.cost}</p>
                  </div>
                </div>
              </div>

              {/* Station */}
              {fuelLog.station && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Station</h3>
                  <p className="text-gray-900">{fuelLog.station}</p>
                </div>
              )}

              {/* Mileage Info */}
              {(fuelLog.odometer_reading || fuelLog.mpg) && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Mileage Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {fuelLog.odometer_reading && (
                      <div>
                        <p className="text-sm text-gray-500">Odometer Reading</p>
                        <p className="font-medium text-gray-900">{fuelLog.odometer_reading.toLocaleString()} miles</p>
                      </div>
                    )}
                    {fuelLog.mpg && (
                      <div>
                        <p className="text-sm text-gray-500">MPG</p>
                        <p className="font-medium text-gray-900">{fuelLog.mpg}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {fuelLog.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Notes</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{fuelLog.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">
                      {fuelLog.created_at ? new Date(fuelLog.created_at).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  {fuelLog.updated_at && (
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {new Date(fuelLog.updated_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Fuel log not found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
