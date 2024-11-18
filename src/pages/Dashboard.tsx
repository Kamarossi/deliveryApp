import React from 'react';
import { useAuthStore } from '../store/auth';
import { DeliveryList } from '../components/DeliveryList';
import { AddDelivery } from '../components/AddDelivery';
import { BackButton } from '../components/BackButton';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold text-gray-900">Deliveries</h1>
        <div className="w-[88px]" /> {/* Spacer for alignment */}
      </div>
      {user?.role === 'SUPERVISOR' && <AddDelivery />}
      <DeliveryList />
    </div>
  );
}