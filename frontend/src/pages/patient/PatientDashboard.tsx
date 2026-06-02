import React from 'react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/layout/Sidebar'
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import DailyChecklist from '../../components/patient/DailyChecklist'
import QRAccess from '../../components/patient/QRAccess'
import {
  Activity,
  Calendar,
  Heart,
  Pill,
  Thermometer,
  TrendingUp,
  MessageSquare,
  Bell,
} from 'lucide-react'

const PatientDashboard: React.FC = () => {
  const { user } = useAuth()

  const healthMetrics = [
    { label: 'Pain Level', value: '3/10', icon: Activity, trend: 'down' },
    { label: 'Medication', value: 'On Track', icon: Pill, trend: 'stable' },
    { label: 'Temperature', value: '98.6°F', icon: Thermometer, trend: 'normal' },
    { label: 'Heart Rate', value: '72 BPM', icon: Heart, trend: 'stable' },
  ]

  const upcomingEvents = [
    { time: 'Today, 10:00 AM', title: 'Physical Therapy Session', type: 'appointment' },
    { time: 'Tomorrow, 2:30 PM', title: 'Doctor Follow-up', type: 'appointment' },
    { time: 'In 3 days', title: 'Medication Refill', type: 'reminder' },
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
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default PatientDashboard