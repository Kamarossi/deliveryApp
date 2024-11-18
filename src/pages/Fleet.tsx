import React, { useState } from 'react';
import { Plus, FileText, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useFleetStore } from '../store/fleet';
import { BackButton } from '../components/BackButton';
import { TruckForm } from '../components/fleet/TruckForm';
import { TruckList } from '../components/fleet/TruckList';
import { IncidentList } from '../components/fleet/IncidentList';
import { IncidentForm } from '../components/fleet/IncidentForm';

export function Fleet() {
  const { user } = useAuthStore();
  const [isAddingTruck, setIsAddingTruck] = useState(false);
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const isSupervisor = user?.role === 'SUPERVISOR';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold text-gray-900">Fleet Management</h1>
        {isSupervisor && (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAddingIncident(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Report Incident
            </button>
            <button
              onClick={() => setIsAddingTruck(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </button>
          </div>
        )}
      </div>

      {isAddingTruck && isSupervisor && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Add New Vehicle
            </h3>
            <TruckForm onSubmit={() => setIsAddingTruck(false)} />
          </div>
        </div>
      )}

      {isAddingIncident && isSupervisor && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              Report Incident
            </h3>
            <IncidentForm onSubmit={() => setIsAddingIncident(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Fleet Vehicles</h2>
            <TruckList />
          </div>
        </div>

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Incident Reports</h2>
              {isSupervisor && (
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Reports
                </button>
              )}
            </div>
            <IncidentList />
          </div>
        </div>
      </div>
    </div>
  );
}