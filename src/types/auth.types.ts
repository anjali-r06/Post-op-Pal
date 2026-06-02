 export type UserRole =
  | 'admin'
  | 'doctor'
  | 'patient'
  | 'nurse'
  | 'staff'



export interface User {
  id: string
  email?: string        // ✅ FIXED (optional)
  name: string
  role: UserRole
  avatar?: string
  hospitalId?: string
  department?: string
  specialization?: string
  contactNumber?: string
  createdAt: string
  updatedAt: string
}


export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<AuthResponse>
  logout: () => void
  updateUser: (user: User) => void
  isAuthenticated: boolean
  isLoading: boolean
}