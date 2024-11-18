import React, { useState } from 'react';
import { Plus, Edit2, Archive, Upload } from 'lucide-react';
import { useCustomersStore } from '../store/customers';
import { CustomerForm } from '../components/CustomerForm';
import { Customer } from '../types';
import { BackButton } from '../components/BackButton';
import { ImportCustomers } from '../components/ImportCustomers';

export function Customers() {
  const { customers, addCustomer, updateCustomer, archiveCustomer } = useCustomersStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showImport, setShowImport] = useState(false);

  const activeCustomers = customers.filter(c => !c.isArchived);

  const handleAdd = (data: Omit<Customer, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'>) => {
    addCustomer(data);
    setIsAdding(false);
  };

  const handleEdit = (data: Partial<Customer>) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, data);
      setEditingCustomer(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import Excel
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {showImport && (
        <ImportCustomers onClose={() => setShowImport(false)} />
      )}

      {(isAdding || editingCustomer) && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isAdding ? 'Add New Customer' : 'Edit Customer'}
            </h3>
            <div className="mt-6">
              <CustomerForm
                onSubmit={isAdding ? handleAdd : handleEdit}
                initialData={editingCustomer || undefined}
              />
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {activeCustomers.map((customer) => (
                <li key={customer.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {customer.contactPerson} • {customer.phone}
                      </p>
                      <p className="truncate text-sm text-gray-500">
                        {customer.address}
                      </p>
                    </div>
                    <div className="ml-4 flex shrink-0 space-x-2">
                      <button
                        onClick={() => setEditingCustomer(customer)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => archiveCustomer(customer.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}