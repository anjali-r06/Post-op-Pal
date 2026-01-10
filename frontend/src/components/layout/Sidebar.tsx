import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  User,
  Calendar,
  MessageSquare,
  Bell,
  HelpCircle,
} from 'lucide-react'
import { Button } from '../common/Button'

interface SidebarItem {
  to: string
  icon: React.ElementType
  label: string
  roles: ('admin' | 'doctor' | 'patient')[]
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const adminItems: SidebarItem[] = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin'] },
    { to: '/admin/patients', icon: Users, label: 'Patients', roles: ['admin'] },
    { to: '/admin/staff', icon: User, label: 'Staff', roles: ['admin'] },
    { to: '/admin/care-plans', icon: FileText, label: 'Care Plans', roles: ['admin'] },
    { to: '/admin/alerts', icon: AlertTriangle, label: 'Alerts', roles: ['admin'] },
    { to: '/admin/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
  ]

  const doctorItems: SidebarItem[] = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['doctor'] },
    { to: '/doctor/patients', icon: Users, label: 'My Patients', roles: ['doctor'] },
    { to: '/doctor/schedule', icon: Calendar, label: 'Schedule', roles: ['doctor'] },
    { to: '/doctor/alerts', icon: AlertTriangle, label: 'Alerts', roles: ['doctor'] },
    { to: '/doctor/messages', icon: MessageSquare, label: 'Messages', roles: ['doctor'] },
    { to: '/doctor/settings', icon: Settings, label: 'Settings', roles: ['doctor'] },
  ]

  const patientItems: SidebarItem[] = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['patient'] },
    { to: '/patient/recovery', icon: Home, label: 'Recovery', roles: ['patient'] },
    { to: '/patient/checklist', icon: FileText, label: 'Daily Checklist', roles: ['patient'] },
    { to: '/patient/messages', icon: MessageSquare, label: 'Messages', roles: ['patient'] },
    { to: '/patient/notifications', icon: Bell, label: 'Notifications', roles: ['patient'] },
    { to: '/patient/help', icon: HelpCircle, label: 'Help', roles: ['patient'] },
  ]

  const getItemsForRole = () => {
    if (!user) return []
    
    switch (user.role) {
      case 'admin': return adminItems
      case 'doctor': return doctorItems
      case 'patient': return patientItems
      default: return []
    }
  }

  const sidebarItems = getItemsForRole()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white transition-transform lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">PP</span>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PostOpPal
              </span>
              <p className="text-xs text-gray-500">Recovery Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500"
                  : "hover:bg-gray-50 text-gray-700"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              {user?.department && (
                <p className="text-xs text-gray-500 truncate">{user.department}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar