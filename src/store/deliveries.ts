import { create } from 'zustand';
import { Delivery, DeliveryUpdate } from '../types';

interface DeliveriesState {
  deliveries: Delivery[];
  addDelivery: (delivery: Omit<Delivery, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateDelivery: (id: string, update: DeliveryUpdate) => void;
}

export const useDeliveriesStore = create<DeliveriesState>((set) => ({
  deliveries: [
    {
      id: '1',
      address: '123 Main St, City',
      customerName: 'John Doe',
      scheduledDate: '2024-03-20',
      status: 'PENDING',
      driverId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  addDelivery: (delivery) =>
    set((state) => ({
      deliveries: [
        ...state.deliveries,
        {
          ...delivery,
          id: Math.random().toString(36).substr(2, 9),
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateDelivery: (id, update) =>
    set((state) => ({
      deliveries: state.deliveries.map((delivery) =>
        delivery.id === id
          ? {
              ...delivery,
              ...update,
              updatedAt: new Date().toISOString(),
            }
          : delivery
      ),
    })),
}));