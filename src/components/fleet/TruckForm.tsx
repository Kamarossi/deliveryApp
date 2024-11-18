import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFleetStore } from '../../store/fleet';
import { useAuthStore } from '../../store/auth';

const schema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required'),
  fleetNumber: z.string().min(1, 'Fleet number is required'),
  type: z.string().min(1, 'Type is required'),
  size: z.string().min(1, 'Size is required'),
  color: z.string().min(1, 'Color is required'),
  driverId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: () => void;
  initialData?: FormData;
}

export function TruckForm({ onSubmit, initialData }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });
  const addTruck = useFleetStore((state) => state.addTruck);
  const { user } = useAuthStore();

  const handleFormSubmit = (data: FormData) => {
    addTruck(data);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration Number
          </label>
          <input
            type="text"
            {...register('registrationNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.registrationNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fleet Number
          </label>
          <input
            type="text"
            {...register('fleetNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.fleetNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.fleetNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            {...register('type')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select type</option>
            <option value="BOX_TRUCK">Box Truck</option>
            <option value="FLATBED">Flatbed</option>
            <option value="SEMI_TRAILER">Semi-Trailer</option>
            <option value="VAN">Van</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Size
          </label>
          <select
            {...register('size')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select size</option>
            <option value="SMALL">Small</option>
            <option value="MEDIUM">Medium</option>
            <option value="LARGE">Large</option>
          </select>
          {errors.size && (
            <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color
          </label>
          <input
            type="text"
            {...register('color')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          {errors.color && (
            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Assigned Driver
          </label>
          <select
            {...register('driverId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Unassigned</option>
            <option value="2">Dave Driver</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Vehicle
        </button>
      </div>
    </form>
  );
}