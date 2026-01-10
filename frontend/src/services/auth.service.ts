
import type { LoginCredentials, AuthResponse, User } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // In production, this would be:
    // const response = await api.post('/auth/login', credentials)
    // return response.data

    // Mock implementation for development
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = [
          {
            email: 'admin@hospital.com',
            password: 'admin123',
            user: {
              id: '1',
              name: 'Admin User',
              role: 'admin' as const,
              hospitalId: 'HOSP001',
              department: 'Administration',
              contactNumber: '+91 9876543210',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-20',
            },
            token: 'mock-jwt-token-admin',
          },
          {
            email: 'doctor@hospital.com',
            password: 'doctor123',
            user: {
              id: '2',
              email: 'doctor@hospital.com',
              name: 'Dr. Sharma',
              role: 'doctor' as const,
              hospitalId: 'HOSP001',
              department: 'Orthopedics',
              specialization: 'Orthopedic Surgery',
              contactNumber: '+91 9876543211',
              createdAt: '2024-01-01',
              updatedAt: '2024-01-20',
            },
            token: 'mock-jwt-token-doctor',
          },
          {
            email: 'patient@example.com',
            password: 'patient123',
            user: {
              id: '3',
              email: 'patient@example.com',
              name: 'Rajesh Kumar',
              role: 'patient' as const,
              hospitalId: 'HOSP001',
              contactNumber: '+91 9876543212',
              createdAt: '2024-01-15',
              updatedAt: '2024-01-20',
            },
            token: 'mock-jwt-token-patient',
          },
        ]

        const user = users.find(
          u =>
  u.email === credentials.email.trim() &&
  u.password === credentials.password.trim()

        )

        if (user) {
          resolve({
            token: user.token,
            user: user.user,
          })
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1000)
    })
  },

  async logout(): Promise<void> {
    // In production:
    // await api.post('/auth/logout')
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  async getCurrentUser(): Promise<User> {
    // In production:
    // const response = await api.get('/auth/me')
    // return response.data

    const userStr = localStorage.getItem('user')
    if (!userStr) throw new Error('No user found')
    
    return JSON.parse(userStr)
  },

  async refreshToken(): Promise<{ token: string }> {
    // In production:
    // const response = await api.post('/auth/refresh')
    // return response.data

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'new-mock-jwt-token' })
      }, 500)
    })
  },
}