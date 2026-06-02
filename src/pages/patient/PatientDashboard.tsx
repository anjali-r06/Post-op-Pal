import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { Modal } from '../../components/common/Modal'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import DailyChecklist from '../../components/patient/DailyChecklist'
import QRAccess from '../../components/patient/QRAccess'
import DoctorSelection from '../../components/common/DoctorSelection'
import EmergencyAlertButton from '../../components/patient/EmergencyAlertButton'
import AlertHistory from '../../components/common/AlertHistory'
import { doctorService } from '../../services/doctor.service'
import { TrendingUp, Calendar, Bell, MessageSquare, Activity, Heart, Thermometer, Droplets, Wind, User } from 'lucide-react'
import toast from 'react-hot-toast'

const PatientDashboard: React.FC = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [showDoctorSelection, setShowDoctorSelection] = useState(false)

  const healthMetrics = [
    { label: 'Heart Rate', value: '72 bpm', trend: 'stable', icon: Heart },
    { label: 'Temperature', value: '98.6°F', trend: 'stable', icon: Thermometer },
    { label: 'Blood Pressure', value: '120/80', trend: 'stable', icon: Droplets },
    { label: 'Pain Level', value: '3/10', trend: 'down', icon: Wind },
  ]

  const upcomingEvents = [
    { time: 'Today, 10:00 AM', title: 'Physical Therapy Session', type: 'appointment' },
    { time: 'Tomorrow, 2:30 PM', title: 'Doctor Follow-up', type: 'appointment' },
    { time: 'In 3 days', title: 'Medication Refill', type: 'reminder' },
  ]

  // Doctor queries and mutations
  const { data: currentDoctor } = useQuery(
    ['patient-doctor', user?.id],
    () => doctorService.getPatientDoctor(user?.id || ''),
    { enabled: !!user?.id }
  )

  const assignDoctorMutation = useMutation(
    (doctorId: string) => doctorService.assignDoctorToPatient(user?.id || '', doctorId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['patient-doctor', user?.id])
        setShowDoctorSelection(false)
        toast.success('Doctor assigned successfully!')
      },
      onError: () => {
        toast.error('Failed to assign doctor')
      }
    }
  )

  const handleDoctorSelect = (doctor: any) => {
    assignDoctorMutation.mutate(doctor.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="lg:ml-64">
        <Navbar />
        
        <main className="p-4 lg:p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, <span className="text-blue-600">{user?.name}</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Track your recovery progress and stay on top of your health.
            </p>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {healthMetrics.map((metric) => (
              <Card key={metric.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {metric.label}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-blue-100">
                    <metric.icon className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {metric.trend === 'down' ? 'Improving' : 'Stable'}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Recovery Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyChecklist />
                </CardContent>
              </Card>

              {/* Recovery Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Recovery Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Recovery</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full w-2/3" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">7</div>
                        <div className="text-sm text-gray-600">Days Post-Op</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">14</div>
                        <div className="text-sm text-gray-600">Days to Full Recovery</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* My Doctor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    My Doctor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentDoctor ? (
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-xl mx-auto mb-4">
                        {currentDoctor.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <h3 className="font-semibold">{currentDoctor.name}</h3>
                      <p className="text-sm text-blue-600">{currentDoctor.specialization}</p>
                      <p className="text-sm text-gray-500">{currentDoctor.contactNumber}</p>
                      <Button
                        onClick={() => setShowDoctorSelection(true)}
                        variant="outline"
                        className="mt-4"
                        size="sm"
                      >
                        Change Doctor
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mb-4">No doctor assigned yet</p>
                      <Button onClick={() => setShowDoctorSelection(true)} size="sm">
                        Select Doctor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Access */}
              <QRAccess />

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="mt-1">
                          {event.type === 'appointment' ? (
                            <Calendar className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Bell className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-600">{event.time}</div>
                        </div>
                        <Badge variant={event.type === 'appointment' ? 'info' : 'warning'}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <EmergencyAlertButton category="other" description="Requesting emergency assistance" />
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Doctor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Report Symptom
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="h-4 w-4 mr-2" />
                    Update Pain Level
                  </Button>
                </CardContent>
              </Card>

              {/* Alert History */}
              {user?.id && <AlertHistory patientId={user.id} />}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Doctor Selection Modal */}
      {showDoctorSelection && (
        <Modal
          isOpen={showDoctorSelection}
          onClose={() => setShowDoctorSelection(false)}
          title="Select Your Doctor"
        >
          <DoctorSelection
            onDoctorSelect={handleDoctorSelect}
            selectedDoctorId={currentDoctor?.id}
            allowFilters={true}
          />
        </Modal>
      )}
    </div>
  )
}

export default PatientDashboard