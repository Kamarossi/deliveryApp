import { create } from 'zustand';
import { Customer } from '../types';

interface CustomersState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  archiveCustomer: (id: string) => void;
  getActiveCustomers: () => Customer[];
  bulkAddCustomers: (customers: Omit<Customer, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'>[]) => void;
}

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: [
    {
      id: '1',
      name: 'ABC Corporation',
      address: '123 Business Park, City',
      contactPerson: 'John Smith',
      phone: '555-0123',
      email: 'contact@abc.com',
      specialRequirements: {
        ppe: ['Safety Boots', 'High-Vis Vest'],
        handlingInstructions: 'Fragile items require careful handling',
        accessInstructions: 'Report to security desk on arrival',
      },
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  addCustomer: (customer) =>
    set((state) => ({
      customers: [
        ...state.customers,
        {
          ...customer,
          id: Math.random().toString(36).substr(2, 9),
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateCustomer: (id, customerUpdate) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...customerUpdate,
              updatedAt: new Date().toISOString(),
            }
          : customer
      ),
    })),
  archiveCustomer: (id) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? { ...customer, isArchived: true, updatedAt: new Date().toISOString() }
          : customer
      ),
    })),
  getActiveCustomers: () => get().customers.filter((customer) => !customer.isArchived),
  bulkAddCustomers: (customers) =>
    set((state) => ({
      customers: [
        ...state.customers,
        ...customers.map((customer) => ({
          ...customer,
          id: Math.random().toString(36).substr(2, 9),
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      ],
    })),
}));