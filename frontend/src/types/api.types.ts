export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface FileUploadResponse {
  fileName: string
  fileUrl: string
  fileSize: number
  mimeType: string
}

export interface StatsResponse {
  totalPatients: number
  activeRecoveries: number
  redFlagAlerts: number
  recoveryRate: number
  weeklyAdmissions: number
  avgRecoveryTime: number
  patientSatisfaction: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: 'admin' | 'doctor' | 'patient'
    avatar?: string
    hospitalId?: string
  }
  expiresIn: number
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role: 'admin' | 'doctor' | 'patient'
  hospitalId?: string
  department?: string
  specialization?: string
}

export interface RefreshTokenResponse {
  token: string
  expiresIn: number
}