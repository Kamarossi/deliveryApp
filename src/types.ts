export type Role = 'SUPERVISOR' | 'DRIVER' | 'SALES';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  role: Role;
  phone: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Rest of the types remain the same...