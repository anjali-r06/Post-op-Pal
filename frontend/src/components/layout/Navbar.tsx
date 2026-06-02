import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react' // Removed unused Menu import
import Dropdown from '../common/Dropdown'

interface DropdownItem {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning' | 'info'
  type?: never
}

interface DropdownDivider {
  type: 'divider'
  label?: never
  icon?: never
  onClick?: never
  variant?: never
}

type DropdownMenuItem = DropdownItem | DropdownDivider

const Navbar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality
    }
  }

  const userMenuItems: DropdownMenuItem[] = [
  {
    label: 'Profile',
    icon: <User className="h-4 w-4" />,
    onClick: () => navigate('/profile'),
  },
  {
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    onClick: () => navigate('/settings'),
  },
  {
    type: 'divider',
  },
  {
    label: 'Logout',
    icon: <LogOut className="h-4 w-4" />,
    onClick: logout,
    variant: 'destructive' as const, // Make sure this is 'danger' not 'destructive'
  },
]

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center">
            <div className="hidden lg:flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome back, <span className="text-blue-600">{user?.name}</span>
              </h1>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search patients, records, or messages..."
                className="pl-10 pr-4 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                5
              </span>
            </Button>

            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>

            <Dropdown
              trigger={
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              }
              items={userMenuItems}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar