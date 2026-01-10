import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/auth/Login'
import AdminDashboard from '../pages/admin/AdminDashboard'
import DoctorDashboard from '../pages/doctor/DoctorDashboard'
import PatientDashboard from '../pages/patient/PatientDashboard'
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import RoleBasedRoute from '../components/auth/RoleBasedRoute'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/*"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes