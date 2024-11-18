import { create } from 'zustand';
import { User, Role } from '../types';

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'isArchived' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, update: Partial<User>) => void;
  archiveUser: (id: string) => void;
  getActiveUsers: () => User[];
  getUsersByRole: (role: Role) => User[];
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [
    {
      id: '1',
      name: 'John Supervisor',
      email: 'supervisor@demo.com',
      username: 'supervisor',
      password: 'password123',
      role: 'SUPERVISOR',
      phone: '555-0100',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Dave Driver',
      email: 'driver@demo.com',
      username: 'driver',
      password: 'password123',
      role: 'DRIVER',
      phone: '555-0101',
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  addUser: (user) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...user,
          id: Math.random().toString(36).substr(2, 9),
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })),
  updateUser: (id, update) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? {
              ...user,
              ...update,
              updatedAt: new Date().toISOString(),
            }
          : user
      ),
    })),
  archiveUser: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? { ...user, isArchived: true, updatedAt: new Date().toISOString() }
          : user
      ),
    })),
  getActiveUsers: () => get().users.filter((user) => !user.isArchived),
  getUsersByRole: (role) => get().users.filter((user) => user.role === role && !user.isArchived),
}));