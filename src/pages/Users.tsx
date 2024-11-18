import React, { useState } from 'react';
import { Plus, Edit2, Archive } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useUsersStore } from '../store/users';
import { BackButton } from '../components/BackButton';
import { UserForm } from '../components/users/UserForm';
import { User } from '../types';

export function Users() {
  const { user: currentUser } = useAuthStore();
  const { users, archiveUser } = useUsersStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  if (currentUser?.role !== 'SUPERVISOR') {
    return <div>Access denied</div>;
  }

  const activeUsers = users.filter(u => !u.isArchived);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <BackButton />
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {(isAdding || editingUser) && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {isAdding ? 'Add New User' : 'Edit User'}
            </h3>
            <UserForm
              onSubmit={() => {
                setIsAdding(false);
                setEditingUser(null);
              }}
              initialData={editingUser}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {activeUsers.map((user) => (
                <li key={user.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-3">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${user.role === 'SUPERVISOR' ? 'bg-purple-100 text-purple-800' : ''}
                          ${user.role === 'DRIVER' ? 'bg-green-100 text-green-800' : ''}
                          ${user.role === 'SALES' ? 'bg-blue-100 text-blue-800' : ''}
                        `}>
                          {user.role}
                        </span>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-500">
                          {user.email} • {user.phone}
                        </p>
                        <p className="text-sm text-gray-500">
                          Username: {user.username}
                        </p>
                      </div>
                    </div>
                    <div className="ml-4 flex shrink-0 space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => archiveUser(user.id)}
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