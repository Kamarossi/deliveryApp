import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Truck, Incident, IncidentType } from '../types';

interface FleetState {
  trucks: Truck[];
  incidents: Incident[];
  addTruck: (truck: Omit<Truck, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateTruck: (id: string, update: Partial<Truck>) => void;
  addIncident: (incident: Omit<Incident, 'id' | 'reportNumber' | 'createdAt' | 'updatedAt'>) => Incident;
  updateIncident: (id: string, update: Partial<Incident>) => void;
  getTruckById: (id: string) => Truck | undefined;
  getIncidentById: (id: string) => Incident | undefined;
}

const generateReportNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INC-${year}${month}-${random}`;
};

export const useFleetStore = create<FleetState>((set, get) => ({
  trucks: [],
  incidents: [],
  addTruck: (truck) =>
    set((state) => ({
      trucks: [
        ...state.trucks,
        {
          ...truck,
          id: uuidv4(),
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateTruck: (id, update) =>
    set((state) => ({
      trucks: state.trucks.map((truck) =>
        truck.id === id
          ? {
              ...truck,
              ...update,
              updatedAt: new Date().toISOString(),
            }
          : truck
      ),
    })),
  addIncident: (incident) => {
    const newIncident: Incident = {
      ...incident,
      id: uuidv4(),
      reportNumber: generateReportNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      incidents: [...state.incidents, newIncident],
    }));
    return newIncident;
  },
  updateIncident: (id, update) =>
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              ...update,
              updatedAt: new Date().toISOString(),
            }
          : incident
      ),
    })),
  getTruckById: (id) => get().trucks.find((t) => t.id === id),
  getIncidentById: (id) => get().incidents.find((i) => i.id === id),
}));