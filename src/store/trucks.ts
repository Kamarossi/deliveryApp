import { create } from 'zustand';
import { Truck } from '../types';

interface TrucksState {
  trucks: Truck[];
}

export const useTrucksStore = create<TrucksState>(() => ({
  trucks: [
    {
      id: '1',
      registrationNumber: 'ABC123',
      capacity: '5 tons',
      type: 'Box Truck',
    },
    {
      id: '2',
      registrationNumber: 'XYZ789',
      capacity: '10 tons',
      type: 'Semi-Trailer',
    },
  ],
}));