import React from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import PatientList from '../../components/doctor/PatientList'
import AlertsPanel from '../../components/doctor/AlertsPanel'
import {
  Users,
  Activity,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  Stethoscope,
} from 'lucide-react'

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth()

  const stats = [
    { label: 'My Patients', value: '24', icon: Users, change: '+2' },
    { label: 'Active Cases', value: '18', icon: Activity, change: '-1' },
    { label: 'Today\'s Appointments', value: '8', icon: Calendar, change: '+1' },
    { label: 'Pending Messages', value: '12', icon: MessageSquare, change: '+3' },
  ]

  const upcomingAppointments = [
    { time: '09:00 AM', patient: 'Rajesh Kumar', type: 'Follow-up', status: 'confirmed' },
    { time: '10:30 AM', patient: 'Priya Sharma', type: 'Check-up', status: 'confirmed' },
    { time: '02:00 PM', patient: 'Amit Patel', type: 'Emergency', status: 'pending' },
    { time: '04:15 PM', patient: 'Suresh Verma', type: 'Consultation', status: 'confirmed' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        <Navbar />
        
        <main className="p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, <span className="text-blue-600">Dr. {user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Here's your daily overview and patient updates.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <stat.icon className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <Badge variant={stat.change.startsWith('+') ? 'success' : 'warning'} className="ml-2">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Patient List */}
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Patients</CardTitle>
                  <Button size="sm" leftIcon={<Stethoscope className="h-4 w-4" />}>
                    New Patient
                  </Button>
                </CardHeader>
                <CardContent>
                  <PatientList />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recovery Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[70, 85, 45, 90].map((progress, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Patient {index + 1}</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              progress >= 70 ? 'bg-green-500' : 
                              progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Alerts Panel */}
              <AlertsPanel />

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div>
                          <div className="font-medium">{appointment.time}</div>
                          <div className="text-sm text-gray-600">{appointment.patient}</div>
                          <div className="text-xs text-gray-500">{appointment.type}</div>
                        </div>
                        <Badge
                          variant={
                            appointment.status === 'confirmed' ? 'success' : 'warning'
                          }
                        >
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Appointments
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Bulk Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default DoctorDashboard