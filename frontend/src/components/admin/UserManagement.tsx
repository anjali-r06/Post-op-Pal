import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Card, CardContent } from '../common/Card' // Removed CardHeader, CardTitle imports
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Badge } from '../common/Badge'
import { Table } from '../common/Table'
import { Modal } from '../common/Modal'
import { Loader } from '../common/Loader'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Shield,
  UserCheck,
  UserX,
  Save,
  AlertTriangle // Added missing imports
} from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'nurse' | 'staff' | 'patient'
  department?: string
  contactNumber?: string
  status: 'active' | 'inactive' | 'pending'
  lastLogin?: string
  createdAt: string
  avatar?: string
}

const UserManagement: React.FC = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)

  // Mock data - in production this would come from API
  const usersData: User[] = [
    {
      id: '1',
      name: 'Dr. Sharma',
      email: 'dr.sharma@hospital.com',
      role: 'doctor',
      department: 'Orthopedics',
      contactNumber: '+91 9876543210',
      status: 'active',
      lastLogin: '2024-01-20T10:30:00',
      createdAt: '2023-06-15',
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@hospital.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-20T09:15:00',
      createdAt: '2023-01-01',
    },
    {
      id: '3',
      name: 'Nurse Priya',
      email: 'nurse.priya@hospital.com',
      role: 'nurse',
      department: 'ICU',
      contactNumber: '+91 9876543211',
      status: 'active',
      lastLogin: '2024-01-19T14:20:00',
      createdAt: '2023-08-22',
    },
    {
      id: '4',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      role: 'patient',
      status: 'active',
      lastLogin: '2024-01-20T08:45:00',
      createdAt: '2024-01-15',
    },
    {
      id: '5',
      name: 'Reception Staff',
      email: 'reception@hospital.com',
      role: 'staff',
      department: 'Reception',
      status: 'inactive',
      lastLogin: '2024-01-18T17:30:00',
      createdAt: '2023-11-10',
    },
    {
      id: '6',
      name: 'Dr. Verma',
      email: 'dr.verma@hospital.com',
      role: 'doctor',
      department: 'Cardiology',
      contactNumber: '+91 9876543212',
      status: 'pending',
      createdAt: '2024-01-19',
    },
  ]

  const { data: users = usersData, isLoading } = useQuery('users', () =>
    new Promise<User[]>((resolve) => {
      setTimeout(() => resolve(usersData), 500)
    })
  )

  const updateUserMutation = useMutation(
    async (userData: Partial<User>) => {
      console.log('Updating user:', userData)
      // In production: await api.put(`/users/${userData.id}`, userData)
      return userData
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowEditModal(null)
        toast.success('User updated successfully')
      },
      onError: () => {
        toast.error('Failed to update user')
      }
    }
  )

  const deleteUserMutation = useMutation(
    async (userId: string) => {
      console.log('Deleting user:', userId)
      // In production: await api.delete(`/users/${userId}`)
      return userId
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowDeleteModal(null)
        toast.success('User deleted successfully')
      },
      onError: () => {
        toast.error('Failed to delete user')
      }
    }
  )

  const createUserMutation = useMutation(
    async (userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
      console.log('Creating user:', userData)
      // In production: await api.post('/users', userData)
      return { ...userData, id: 'new-id', createdAt: new Date().toISOString() }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        setShowAddModal(false)
        toast.success('User created successfully')
      },
      onError: () => {
        toast.error('Failed to create user')
      }
    }
  )

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleStatusToggle = (userId: string, currentStatus: User['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    updateUserMutation.mutate({ id: userId, status: newStatus })
  }

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'doctor': return 'bg-blue-100 text-blue-800'
      case 'nurse': return 'bg-green-100 text-green-800'
      case 'staff': return 'bg-yellow-100 text-yellow-800'
      case 'patient': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Fixed: Use 'destructive' instead of 'danger'
  const getStatusColor = (status: User['status']): 'success' | 'destructive' | 'warning' | 'secondary' => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'destructive'
      case 'pending': return 'warning'
      default: return 'secondary'
    }
  }

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'> = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as User['role'],
      department: formData.get('department') as string || undefined,
      contactNumber: formData.get('contactNumber') as string || undefined,
      status: 'active',
    }

    createUserMutation.mutate(userData)
  }

  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const userData: Partial<User> = {
      id: showEditModal!,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      role: formData.get('role') as User['role'],
      department: formData.get('department') as string || undefined,
      contactNumber: formData.get('contactNumber') as string || undefined,
    }

    updateUserMutation.mutate(userData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    )
  }

  const editUser = showEditModal ? users.find(u => u.id === showEditModal) : null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage hospital staff and patient accounts</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add New User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Doctors</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'doctor').length}
                </p>
              </div>
              <Shield className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Activation</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.status === 'pending').length}
                </p>
              </div>
              <UserX className="h-10 w-10 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
                <option value="patient">Patient</option>
              </select>

              <select
                className="border rounded-md px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>

              <Button variant="outline" leftIcon={<Filter className="h-4 w-4" />}>
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table
            headers={['User', 'Role', 'Status', 'Last Login', 'Created', 'Actions']}
            data={filteredUsers.map(user => [
              <div key={`user-${user.id}`} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  {user.department && (
                    <div className="text-xs text-gray-500">{user.department}</div>
                  )}
                </div>
              </div>,
              <Badge key={`role-${user.id}`} className={getRoleColor(user.role)}>
                {user.role.toUpperCase()}
              </Badge>,
              <div key={`status-${user.id}`} className="flex items-center gap-2">
                <Badge variant={getStatusColor(user.status)}>
                  {user.status.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStatusToggle(user.id, user.status)}
                  title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  {user.status === 'active' ? (
                    <UserX className="h-4 w-4 text-gray-400" />
                  ) : (
                    <UserCheck className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>,
              user.lastLogin ? (
                <div key={`login-${user.id}`}>
                  <div>{formatDate.relative(user.lastLogin)}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate.withTime(user.lastLogin)}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Never</span>
              ),
              <div key={`created-${user.id}`}>
                {formatDate.short(user.createdAt)}
              </div>,
              <div key={`actions-${user.id}`} className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowEditModal(user.id)}
                  title="Edit User"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(user.id)}
                  title="Delete User"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ])}
          />
        </CardContent>
      </Card>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
        size="lg"
      >
        <form onSubmit={handleAddUser} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input name="name" placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="staff">Staff</option>
                <option value="patient">Patient</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Input
                name="department"
                placeholder="e.g., Orthopedics, Cardiology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Number</label>
              <Input
                name="contactNumber"
                placeholder="+91 9876543210"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              A temporary password will be generated and sent to the user's email.
              They will be required to change it on first login.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createUserMutation.isLoading}
              leftIcon={<UserPlus className="h-4 w-4" />}
            >
              {createUserMutation.isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      {editUser && (
        <Modal
          isOpen={!!showEditModal}
          onClose={() => setShowEditModal(null)}
          title={`Edit User: ${editUser.name}`}
          size="lg"
        >
          <form onSubmit={handleEditUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  name="name"
                  defaultValue={editUser.name}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  name="email"
                  type="email"
                  defaultValue={editUser.email}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  name="role"
                  defaultValue={editUser.role}
                  className="w-full border rounded-md px-3 py-2"
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="staff">Staff</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <Input
                  name="department"
                  defaultValue={editUser.department || ''}
                  placeholder="e.g., Orthopedics, Cardiology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number</label>
                <Input
                  name="contactNumber"
                  defaultValue={editUser.contactNumber || ''}
                  placeholder="+91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  name="status"
                  defaultValue={editUser.status}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Account Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Created</div>
                  <div>{formatDate.long(editUser.createdAt)}</div>
                </div>
                {editUser.lastLogin && (
                  <div>
                    <div className="text-gray-600">Last Login</div>
                    <div>{formatDate.relative(editUser.lastLogin)}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateUserMutation.isLoading}
                leftIcon={<Save className="h-4 w-4" />}
              >
                {updateUserMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Warning</span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              Deleting a user will remove all their data from the system.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate(showDeleteModal!)}
              disabled={deleteUserMutation.isLoading}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UserManagement