import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDeliveriesStore } from '../store/deliveries';
import { CustomerSearch } from './CustomerSearch';
import { Customer } from '../types';

const schema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  customerName: z.string().min(1, 'Customer name is required'),
  address: z.string().min(1, 'Address is required'),
  scheduledDate: z.string().min(1, 'Date is required'),
  driverId: z.string().min(1, 'Driver is required'),
});

type FormData = z.infer<typeof schema>;

export function AddDelivery() {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const addDelivery = useDeliveriesStore((state) => state.addDelivery);

  const handleCustomerSelect = (customer: Customer) => {
    setValue('customerId', customer.id);
    setValue('customerName', customer.name);
    setValue('address', customer.address);
  };

  const onSubmit = (data: FormData) => {
    addDelivery(data);
    reset();
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Delivery</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <CustomerSearch onSelect={handleCustomerSelect} />
            <input type="hidden" {...register('customerId')} />
            <input type="hidden" {...register('customerName')} />
            {errors.customerId && (
              <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              readOnly
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scheduled Date
            </label>
            <input
              type="date"
              {...register('scheduledDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.scheduledDate && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Assign Driver
            </label>
            <select
              {...register('driverId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Select a driver</option>
              <option value="2">Dave Driver</option>
            </select>
            {errors.driverId && (
              <p className="mt-1 text-sm text-red-600">{errors.driverId.message}</p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}