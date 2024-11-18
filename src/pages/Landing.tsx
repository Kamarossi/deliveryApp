import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Users, Package, ArrowRight, FileText, UserPlus } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export function Landing() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const navigationItems = [
    {
      title: 'Deliveries',
      description: 'View and manage all deliveries',
      icon: Package,
      path: '/deliveries',
      roles: ['SUPERVISOR', 'DRIVER', 'SALES'],
    },
    {
      title: 'Customers',
      description: 'Manage customer database',
      icon: Users,
      path: '/customers',
      roles: ['SUPERVISOR'],
    },
    {
      title: 'Reports',
      description: 'Generate and export delivery reports',
      icon: FileText,
      path: '/reports',
      roles: ['SUPERVISOR', 'SALES'],
    },
    {
      title: 'Fleet Management',
      description: 'Manage vehicles and incidents',
      icon: Truck,
      path: '/fleet',
      roles: ['SUPERVISOR'],
    },
    {
      title: 'User Management',
      description: 'Manage system users',
      icon: UserPlus,
      path: '/users',
      roles: ['SUPERVISOR'],
    },
  ].filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Delivery Management System
        </h1>
        <p className="mt-3 text-xl text-gray-500 sm:mt-4">
          Welcome, {user?.name}. What would you like to do today?
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {navigationItems.map((item) => (
          <div
            key={item.path}
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <button
                  onClick={() => navigate(item.path)}
                  className="focus:outline-none w-full text-left"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  {item.title}
                </button>
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {item.description}
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <ArrowRight className="h-6 w-6" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}