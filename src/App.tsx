import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Fleet } from './pages/Fleet';
import { Users } from './pages/Users';
import { Layout } from './components/Layout';
import { useAuthStore } from './store/auth';

export default function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/deliveries" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}