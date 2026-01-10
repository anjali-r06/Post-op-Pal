import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Badge } from '../common/Badge'
import { Tabs } from '../common/Tabs'
import {
  Building2,
  Settings,
  Shield,
  Bell,
  Database,
  Upload,
  Download,
  Save,
  RefreshCw,
  AlertTriangle,
  Plus // Added Plus icon
} from 'lucide-react'
import toast from 'react-hot-toast'

const HospitalSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const [hospitalInfo, setHospitalInfo] = useState({
    name: 'City General Hospital',
    address: '123 Healthcare Avenue',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    postalCode: '400001',
    contactNumber: '+91 22 1234 5678',
    emergencyNumber: '+91 22 1234 9999',
    email: 'info@citygeneralhospital.com',
    website: 'https://citygeneralhospital.com',
    registrationNumber: 'HOSP/MH/2024/001',
    accreditation: 'NABH, JCI',
    foundedYear: '1995',
    totalBeds: '500',
    icuBeds: '50',
    operationTheaters: '15',
  })

  const [departments, setDepartments] = useState([
    { id: '1', name: 'Cardiology', head: 'Dr. Sharma', beds: '50', staff: '25' },
    { id: '2', name: 'Orthopedics', head: 'Dr. Verma', beds: '40', staff: '20' },
    { id: '3', name: 'Neurology', head: 'Dr. Patel', beds: '35', staff: '18' },
    { id: '4', name: 'Pediatrics', head: 'Dr. Gupta', beds: '30', staff: '15' },
    { id: '5', name: 'Oncology', head: 'Dr. Reddy', beds: '25', staff: '12' },
  ])

  const [systemSettings, setSystemSettings] = useState({
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    language: 'en',
    theme: 'light',
    sessionTimeout: '30',
    backupFrequency: 'daily',
    dataRetentionDays: '365',
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSSAlerts: false,
    enableWhatsAppAlerts: true,
    maintenanceMode: false,
    allowRegistrations: true,
  })

  const [newDepartment, setNewDepartment] = useState({
    name: '',
    head: '',
    beds: '',
    staff: '',
  })

  const handleSaveSettings = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  const handleAddDepartment = () => {
    if (!newDepartment.name.trim()) {
      toast.error('Department name is required')
      return
    }

    const department = {
      id: Date.now().toString(),
      ...newDepartment,
    }

    setDepartments([...departments, department])
    setNewDepartment({ name: '', head: '', beds: '', staff: '' })
    toast.success('Department added successfully')
  }

  const handleRemoveDepartment = (id: string) => {
    if (window.confirm('Are you sure you want to remove this department?')) {
      setDepartments(departments.filter(dept => dept.id !== id))
      toast.success('Department removed')
    }
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'departments', label: 'Departments', icon: Settings },
    { id: 'system', label: 'System', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hospital Settings</h1>
          <p className="text-gray-600">Manage hospital information and system configuration</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          leftIcon={isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Hospital Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Hospital Name</label>
                  <Input
                    value={hospitalInfo.name}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Registration Number</label>
                  <Input
                    value={hospitalInfo.registrationNumber}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, registrationNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    value={hospitalInfo.address}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <Input
                    value={hospitalInfo.city}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <Input
                    value={hospitalInfo.state}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, state: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <Input
                    value={hospitalInfo.postalCode}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, postalCode: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Number</label>
                  <Input
                    value={hospitalInfo.contactNumber}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, contactNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Emergency Number</label>
                  <Input
                    value={hospitalInfo.emergencyNumber}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergencyNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={hospitalInfo.email}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    type="url"
                    value={hospitalInfo.website}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Accreditations</label>
                  <Input
                    value={hospitalInfo.accreditation}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, accreditation: e.target.value })}
                    placeholder="Separate with commas"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Founded Year</label>
                  <Input
                    type="number"
                    value={hospitalInfo.foundedYear}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, foundedYear: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-4">Hospital Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Beds</label>
                    <Input
                      type="number"
                      value={hospitalInfo.totalBeds}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, totalBeds: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ICU Beds</label>
                    <Input
                      type="number"
                      value={hospitalInfo.icuBeds}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, icuBeds: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Operation Theaters</label>
                    <Input
                      type="number"
                      value={hospitalInfo.operationTheaters}
                      onChange={(e) => setHospitalInfo({ ...hospitalInfo, operationTheaters: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-4">Hospital Logo</h3>
                <div className="flex items-center gap-6">
                  <div className="h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Upload Logo</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" leftIcon={<Upload className="h-4 w-4" />}>
                      Upload Logo
                    </Button>
                    <p className="text-sm text-gray-600">
                      Recommended: 512x512 pixels, PNG format, max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Department Name</label>
                  <Input
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    placeholder="e.g., Cardiology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Head of Department</label>
                  <Input
                    value={newDepartment.head}
                    onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                    placeholder="e.g., Dr. Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Total Beds</label>
                  <Input
                    type="number"
                    value={newDepartment.beds}
                    onChange={(e) => setNewDepartment({ ...newDepartment, beds: e.target.value })}
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Staff Count</label>
                  <Input
                    type="number"
                    value={newDepartment.staff}
                    onChange={(e) => setNewDepartment({ ...newDepartment, staff: e.target.value })}
                    placeholder="25"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleAddDepartment} leftIcon={<Plus className="h-4 w-4" />}>
                  Add Department
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Departments List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{dept.name}</h4>
                        <p className="text-sm text-gray-600">Head: {dept.head}</p>
                        <div className="flex gap-4 mt-1">
                          <Badge variant="outline">{dept.beds} Beds</Badge>
                          <Badge variant="outline">{dept.staff} Staff</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveDepartment(dept.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={systemSettings.timezone}
                    onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                  >
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Date Format</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={systemSettings.dateFormat}
                    onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time Format</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={systemSettings.timeFormat}
                    onChange={(e) => setSystemSettings({ ...systemSettings, timeFormat: e.target.value })}
                  >
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={systemSettings.language}
                    onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({ ...systemSettings, sessionTimeout: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                  <select
                    className="w-full border rounded-md px-3 py-2"
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({ ...systemSettings, backupFrequency: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-4">Data Retention</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Patient Data Retention (days)
                    </label>
                    <Input
                      type="number"
                      value={systemSettings.dataRetentionDays}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dataRetentionDays: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allowRegistrations"
                      checked={systemSettings.allowRegistrations}
                      onChange={(e) => setSystemSettings({ ...systemSettings, allowRegistrations: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="allowRegistrations" className="text-sm">
                      Allow new patient registrations
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="maintenanceMode" className="text-sm">
                      Enable maintenance mode
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup & Restore */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Automatic Backup Schedule
                  </label>
                  <select className="w-full border rounded-md px-3 py-2">
                    <option>Daily at 2:00 AM</option>
                    <option>Weekly (Sunday at 3:00 AM)</option>
                    <option>Monthly (1st at 4:00 AM)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Last Backup</h4>
                    <p className="text-sm text-gray-600">January 20, 2024 02:00 AM</p>
                    <p className="text-sm text-green-600">Success</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Next Backup</h4>
                    <p className="text-sm text-gray-600">January 21, 2024 02:00 AM</p>
                    <p className="text-sm text-blue-600">Scheduled</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" leftIcon={<Database className="h-4 w-4" />}>
                    Create Manual Backup
                  </Button>
                  <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
                    Download Latest Backup
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-medium mb-4">Restore Backup</h3>
                <div className="space-y-4">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Upload backup file to restore system data
                    </p>
                    <Button variant="outline">Choose Backup File</Button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Important Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Restoring from backup will replace all current data. This action cannot be undone.
                          Ensure you have a current backup before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default HospitalSettings