import { User } from './auth.types'

export interface Staff extends User {
  employeeId: string
  department: string
  specialization?: string
  licenseNumber?: string
  yearsOfExperience?: number
  availableDays: string[]
  workingHours: {
    start: string
    end: string
  }
  assignedPatients: string[]
  qualifications?: string[]
  certifications?: string[]
  notes?: string
  status: 'active' | 'on_leave' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface Hospital {
  id: string
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  contactNumber: string
  emergencyNumber: string
  email: string
  website?: string
  logo?: string
  departments: string[]
  totalBeds: number
  occupiedBeds: number
  availableBeds: number
  icuBeds: number
  operationTheaters: number
  amenities: string[]
  accreditations: string[]
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: string
  hospitalId: string
  name: string
  headDoctorId?: string
  headDoctorName?: string
  totalStaff: number
  totalBeds: number
  availableBeds: number
  specializations: string[]
  description?: string
  contactExtension?: string
  floor?: string
  wing?: string
  services: string[]
  equipment: string[]
  createdAt: string
  updatedAt: string
}

export interface RolePermission {
role: 'admin' | 'doctor' | 'patient' | 'nurse' | 'staff'

  permissions: string[]
  description?: string
  level: number // 1-10, where 10 is highest
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  newUsersThisWeek: number
  userGrowthRate: number
  activeSessions: number
  roleDistribution: {
    admin: number
    doctor: number
    nurse: number
    patient: number
    staff: number
  }
  departmentDistribution?: Record<string, number>
  lastUpdated: string
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
  status: 'success' | 'failure' | 'warning'
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  whatsapp: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
  categories: {
    alerts: boolean
    appointments: boolean
    messages: boolean
    reminders: boolean
    updates: boolean
  }
  quietHours?: {
    enabled: boolean
    start: string
    end: string
  }
}

export interface UserSession {
  id: string
  userId: string
  device: string
  browser: string
  os: string
  ipAddress: string
  location?: string
  loginTime: string
  lastActive: string
  expiresAt: string
  isActive: boolean
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  details?: string
  timestamp: string
  duration?: number // in seconds
  success: boolean
}

export interface PasswordPolicy {
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  expireDays: number
  maxAttempts: number
  lockoutMinutes: number
}

export interface SystemSettings {
  hospitalName: string
  hospitalLogo?: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  language: string
  theme: 'light' | 'dark' | 'auto'
  maintenanceMode: boolean
  allowRegistrations: boolean
  requireEmailVerification: boolean
  requirePhoneVerification: boolean
  enableTwoFactor: boolean
  sessionTimeout: number // in minutes
  backupFrequency: 'daily' | 'weekly' | 'monthly'
  dataRetentionDays: number
  privacyPolicyUrl?: string
  termsOfServiceUrl?: string
  contactEmail: string
  supportPhone: string
  emergencyContact: string
}

// Type guards
export const isStaff = (user: User | Staff): user is Staff => {
  return 'employeeId' in user && 'department' in user
}

export const isDoctor = (user: User | Staff): boolean => {
  return user.role === 'doctor'
}


export const hasPermission = (user: User, permission: string): boolean => {
  // This would normally check against user's permissions
  // For now, return based on role
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    doctor: ['view_patients', 'edit_patients', 'view_records', 'prescribe_medication'],
    patient: ['view_own_records', 'update_checkins', 'send_messages'],
    nurse: ['view_patients', 'update_vitals', 'administer_medication'],
    staff: ['view_schedule', 'manage_appointments'],
  }
  
  const permissions = rolePermissions[user.role] || []
  return permissions.includes('*') || permissions.includes(permission)
}

// User helper functions
export const getUserFullName = (user: User | Staff): string => {
  if (user.role === 'doctor' || user.role === 'nurse') {
    return `${user.role === 'doctor' ? 'Dr.' : 'Nurse'} ${user.name}`
  }
  return user.name
}

export const getUserInitials = (user: User): string => {
  return user.name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const getUserContactInfo = (user: User | Staff): {
  email?: string
  phone?: string
  emergencyContact?: string
} => {
  return {
    email: user.email,
    phone: 'contactNumber' in user ? user.contactNumber : undefined,
    emergencyContact: 'emergencyContact' in user ? (user as any).emergencyContact : undefined,
  }
}
