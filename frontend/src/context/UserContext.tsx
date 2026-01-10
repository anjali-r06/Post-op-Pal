// src/context/UserContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react'
import type { User } from '../types/auth.types'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateUserProfile: (updates: Partial<User>) => void
  clearUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

const STORAGE_KEY = 'user'

const parseUserFromStorage = (): User | null => {
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    return stored ? JSON.parse(stored) as User : null
  } catch (e) {
    console.warn('Failed to parse user from storage', e)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(() => parseUserFromStorage())

  // central sync to localStorage whenever `user` changes
  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Failed to write user to storage', e)
    }
  }, [user])

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser)
  }, [])

  const updateUserProfile = useCallback((updates: Partial<User>) => {
    setUserState(prev => (prev ? ({ ...prev, ...updates }) : prev))
  }, [])

  const clearUser = useCallback(() => {
    setUserState(null)
  }, [])

  const value = useMemo(() => ({ user, setUser, updateUserProfile, clearUser }), [user, setUser, updateUserProfile, clearUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}



// import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'
// import type { AuthContextType, AuthResponse, User } from '../types/auth.types'
// import { authService } from '../services/auth.service'
// import toast from 'react-hot-toast'

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
//   const [isLoading, setIsLoading] = useState<boolean>(true)

//   // initialize from localStorage/user
//   useEffect(() => {
//     const init = async () => {
//       setIsLoading(true)
//       try {
//         const stored = localStorage.getItem('user')
//         if (stored) {
//           setUser(JSON.parse(stored) as User)
//         } else if (token) {
//           // optionally fetch /auth/me if your backend supports it
//           try {
//             const me = await authService.getCurrentUser()
//             setUser(me)
//           } catch {
//             // ignore
//           }
//         }
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     init()
//   }, [token])

//   // login function
//   const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
//     setIsLoading(true)
//     try {
//       const res = await authService.login({ email, password })
//       setUser(res.user)
//       setToken(res.token)
//       // persist
//       localStorage.setItem('token', res.token)
//       localStorage.setItem('user', JSON.stringify(res.user))
//       toast.success(`Welcome ${res.user.name}`)
//       return res
//     } finally {
//       setIsLoading(false)
//     }
//   }, [])

//   const logout = useCallback(async () => {
//     setIsLoading(true)
//     try {
//       await authService.logout()
//     } catch {
//       // ignore
//     } finally {
//       setUser(null)
//       setToken(null)
//       localStorage.removeItem('token')
//       localStorage.removeItem('user')
//       setIsLoading(false)
//       window.location.href = '/login'
//     }
//   }, [])

//   const updateUser = useCallback((u: User) => {
//     setUser(u)
//     localStorage.setItem('user', JSON.stringify(u))
//   }, [])

//   // optional: token refresh loop (only if backend supports refresh)
//   useEffect(() => {
//     let mounted = true
//     let timer: number | undefined

//     const startRefresh = async () => {
//       if (!token) return
//       try {
//         // try a refresh periodically — adjust interval as you need
//         const res = await authService.refreshToken()
//         if (!mounted) return
//         setToken(res.token)
//         localStorage.setItem('token', res.token)
//       } catch (err) {
//         // refresh failed — do not crash; you may logout if you prefer
//         console.warn('token refresh failed', err)
//       } finally {
//         // schedule next refresh in 12 minutes (example)
//         timer = window.setTimeout(startRefresh, 12 * 60 * 1000)
//       }
//     }

//     startRefresh()
//     return () => {
//       mounted = false
//       if (timer) clearTimeout(timer)
//     }
//   }, [token])

//   const value = useMemo<AuthContextType>(() => ({
//     user,
//     token,
//     login,
//     logout,
//     updateUser,
//     isAuthenticated: !!token,
//     isLoading,
//   }), [user, token, login, logout, updateUser, isLoading])

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export default AuthContext
