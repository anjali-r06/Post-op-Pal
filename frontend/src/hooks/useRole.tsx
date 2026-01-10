import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../types/auth.types'

interface UseRoleReturn {
  hasRole: (role: UserRole | UserRole[]) => boolean
  isAdmin: boolean
  isDoctor: boolean
  isPatient: boolean
  currentRole: UserRole | null
  canAccess: (allowedRoles: UserRole[]) => boolean
}

export const useRole = (): UseRoleReturn => {
  const { user } = useAuth()

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false
    
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    
    return user.role === role
  }

  const canAccess = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  const isAdmin = hasRole('admin')
  const isDoctor = hasRole('doctor')
  const isPatient = hasRole('patient')

  return {
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
    currentRole: user?.role || null,
    canAccess,
  }
}

// Role-based component wrapper
export const withRole = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: UserRole[]
) => {
  return function WithRoleComponent(props: P) {
    const { canAccess } = useRole()
    
    if (!canAccess(allowedRoles)) {
      return null
    }
    
    return <Component {...props} />
  }
}

// Role-based hook for conditional rendering
export const useRoleCheck = () => {
  const { user } = useAuth()
  
  return {
    canViewPatientList: user?.role === 'admin' || user?.role === 'doctor',
    canEditPatient: user?.role === 'admin' || user?.role === 'doctor',
    canDeletePatient: user?.role === 'admin',
    canUploadCarePlan: user?.role === 'admin' || user?.role === 'doctor',
    canViewAnalytics: user?.role === 'admin',
    canManageUsers: user?.role === 'admin',
    canScheduleAppointments: user?.role === 'admin' || user?.role === 'doctor',
    canSendMessages: user?.role === 'admin' || user?.role === 'doctor' || user?.role === 'patient',
    canViewOwnData: true, // All roles can view their own data
  }
}

// Custom hook for patient-specific permissions
export const usePatientPermissions = (patientId?: string) => {
  const { user } = useAuth()
  
  // Mock function to check if patient belongs to doctor
  const isPatientsDoctor = (doctorId: string, patientId: string): boolean => {
    // This would normally check from API
    return doctorId === 'doc1' && patientId === '1'
  }
  
  return {
    canViewPatientDetails: user?.role === 'admin' || 
      (user?.role === 'doctor' && patientId && isPatientsDoctor(user.id, patientId)) ||
      (user?.role === 'patient' && user.id === patientId),
    
    canEditPatientDetails: user?.role === 'admin' || 
      (user?.role === 'doctor' && patientId && isPatientsDoctor(user.id, patientId)),
    
    canUpdatePatientStatus: user?.role === 'admin' || 
      (user?.role === 'doctor' && patientId && isPatientsDoctor(user.id, patientId)),
    
    canViewMedicalHistory: user?.role === 'admin' || 
      (user?.role === 'doctor' && patientId && isPatientsDoctor(user.id, patientId)) ||
      (user?.role === 'patient' && user.id === patientId),
    
    canSendMessageToPatient: user?.role === 'admin' || 
      (user?.role === 'doctor' && patientId && isPatientsDoctor(user.id, patientId)),
  }
}
