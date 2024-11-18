import React from 'react';
import { useFleetStore } from '../../store/fleet';
import { Truck, AlertTriangle, Wrench } from 'lucide-react';
import { useAuthStore } from '../../store/auth';

export function TruckList() {
  const { trucks, updateTruck } = useFleetStore();
  const { user } = useAuthStore();
  const isSupervisor = user?.role === 'SUPERVISOR';

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_SERVICE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vehicle
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Driver
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {isSupervisor && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {trucks.map((truck) => (
            <tr key={truck.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {truck.registrationNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      Fleet #{truck.fleetNumber}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{truck.type}</div>
                <div className="text-sm text-gray-500">
                  {truck.size} • {truck.color}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {truck.driverId ? 'Dave Driver' : 'Unassigned'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(truck.status)}`}>
                  {truck.status.replace('_', ' ')}
                </span>
              </td>
              {isSupervisor && (
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateTruck(truck.id, { status: 'MAINTENANCE' })}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      <Wrench className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateTruck(truck.id, { status: 'OUT_OF_SERVICE' })}
                      className="text-red-600 hover:text-red-900"
                    >
                      <AlertTriangle className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}