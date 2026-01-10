// import React, { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { useAuth } from '../../context/AuthContext'
// import { Button } from '../common/Button'
// import { Input } from '../common/Input'
// import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
// import { Alert } from '../common/Alert'
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
// import toast from 'react-hot-toast'

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// })

// type LoginFormData = z.infer<typeof loginSchema>

// const LoginForm: React.FC = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { login } = useAuth()

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   })

//   const onSubmit = async (data: LoginFormData) => {
//     setIsLoading(true)
//     try {
//       await login(data.email, data.password)
//     } catch (error) {
//       console.error('Login error:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="space-y-1">
//           <div className="flex flex-col items-center mb-6">
//             <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
//               <span className="text-white text-2xl font-bold">PP</span>
//             </div>
//             <CardTitle className="text-2xl">PostOpPal</CardTitle>
//             <p className="text-sm text-muted-foreground text-center">
//               Post-Operative Recovery Management System
//             </p>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             {errors.root && (
//               <Alert variant="destructive">{errors.root.message}</Alert>
//             )}
            
//             <div className="space-y-2">
//               <label htmlFor="email" className="text-sm font-medium">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="admin@hospital.com"
//                   className="pl-10"
//                   {...register('email')}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="text-sm text-red-600">{errors.email.message}</p>
//               )}
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="password" className="text-sm font-medium">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <Input
//                   id="password"
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="••••••••"
//                   className="pl-10 pr-10"
//                   {...register('password')}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-gray-400" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-sm text-red-600">{errors.password.message}</p>
//               )}
//             </div>

//             <Button type="submit" className="w-full" isLoading={isLoading}>
//               Sign In
//             </Button>
//           </form>

//           <div className="mt-6 border-t pt-6">
//             <h3 className="text-sm font-medium mb-3">Demo Credentials</h3>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Admin:</span>
//                 <span>admin@hospital.com / admin123</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Doctor:</span>
//                 <span>doctor@hospital.com / doctor123</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-muted-foreground">Patient:</span>
//                 <span>patient@example.com / patient123</span>
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 text-center text-sm text-muted-foreground">
//             <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default LoginForm

// src/pages/auth/LoginForm.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { useAuth } from '../../hooks/useAuth' // <<--- correct hook import (from hooks folder)
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Alert } from '../common/Alert'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth() // login(email, password) — provided by AuthContext wrapper
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    try {
      // AuthContext.login expects (email, password)
      const res = await login(data.email.trim(), data.password.trim())

      // res should contain user + token (AuthResponse)
      const role = res?.user?.role

      if (role === 'admin') navigate('/admin')
      else if (role === 'doctor') navigate('/doctor')
      else navigate('/patient')
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error(err?.message || 'Login failed. Check credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">PP</span>
            </div>
            <CardTitle className="text-2xl">PostOpPal</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Post-Operative Recovery Management System
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errors.root && (
              <Alert variant="destructive">{errors.root.message}</Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hospital.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-sm font-medium mb-3">Demo Credentials</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Admin:</span>
                <span>admin@hospital.com / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Doctor:</span>
                <span>doctor@hospital.com / doctor123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Patient:</span>
                <span>patient@example.com / patient123</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginForm
