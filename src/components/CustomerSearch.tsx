import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useCustomersStore } from '../store/customers';
import { Customer } from '../types';

interface Props {
  onSelect: (customer: Customer) => void;
}

export function CustomerSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { customers } = useCustomersStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeCustomers = customers.filter(c => !c.isArchived);

  const filteredCustomers = query
    ? activeCustomers.filter(customer =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.contactPerson.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search customers..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
        />
        <Search className="h-5 w-5 text-gray-400 absolute left-3 top-[50%] transform -translate-y-[50%]" />
      </div>

      {isOpen && filteredCustomers.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => {
                onSelect(customer);
                setQuery(customer.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              <div className="font-medium text-gray-900">{customer.name}</div>
              <div className="text-sm text-gray-500">{customer.contactPerson}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}