import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Textarea } from '../common/Textarea'
import { Badge } from '../common/Badge'
import { Modal } from '../common/Modal'
import { Tabs } from '../common/Tabs'
import {
  Activity,
  Heart,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Plus,
  Download,
  Filter,
  Edit,
  Save,
  LineChart,
  BarChart3,
  Target,
  ActivitySquare,
  Weight,
  Pill,
  Dumbbell,
} from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

interface VitalSigns {
  id: string
  patientId: string
  date: string
  time: string
  temperature: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  heartRate: number
  oxygenSaturation: number
  respiratoryRate: number
  weight: number
  painLevel: number
  notes?: string
  recordedBy: string
}

interface RecoveryMilestone {
  id: string
  patientId: string
  title: string
  description: string
  targetDate: string
  actualDate?: string
  status: 'pending' | 'in_progress' | 'completed' | 'delayed'
  priority: 'low' | 'medium' | 'high'
}

const RecoveryMonitoring: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState('vitals')
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false)
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  // Mock vital signs data
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([
    {
      id: '1',
      patientId: id!,
      date: '2024-01-20',
      time: '10:00',
      temperature: 98.6,
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      oxygenSaturation: 98,
      respiratoryRate: 16,
      weight: 75,
      painLevel: 3,
      notes: 'Patient is stable. No abnormalities detected.',
      recordedBy: 'Dr. Sharma'
    },
    {
      id: '2',
      patientId: id!,
      date: '2024-01-19',
      time: '09:30',
      temperature: 99.1,
      bloodPressure: { systolic: 125, diastolic: 82 },
      heartRate: 75,
      oxygenSaturation: 97,
      respiratoryRate: 18,
      weight: 75.2,
      painLevel: 4,
      notes: 'Mild fever. Monitoring closely.',
      recordedBy: 'Nurse Priya'
    },
    {
      id: '3',
      patientId: id!,
      date: '2024-01-18',
      time: '11:00',
      temperature: 98.8,
      bloodPressure: { systolic: 118, diastolic: 78 },
      heartRate: 70,
      oxygenSaturation: 98,
      respiratoryRate: 15,
      weight: 75.5,
      painLevel: 5,
      notes: 'Pain level increased during physical therapy.',
      recordedBy: 'Dr. Sharma'
    },
  ])

  // Mock milestones data
  const [milestones, setMilestones] = useState<RecoveryMilestone[]>([
    {
      id: '1',
      patientId: id!,
      title: 'Hospital Discharge',
      description: 'Patient cleared for discharge from hospital',
      targetDate: '2024-01-16',
      actualDate: '2024-01-16',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '2',
      patientId: id!,
      title: 'First Follow-up',
      description: 'First post-operative follow-up appointment',
      targetDate: '2024-01-20',
      actualDate: '2024-01-20',
      status: 'completed',
      priority: 'high'
    },
    {
      id: '3',
      patientId: id!,
      title: 'Physical Therapy Start',
      description: 'Begin physical therapy sessions',
      targetDate: '2024-01-22',
      actualDate: '2024-01-22',
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: '4',
      patientId: id!,
      title: 'Medication Reduction',
      description: 'Begin tapering off pain medication',
      targetDate: '2024-01-25',
      status: 'pending',
      priority: 'medium'
    },
    {
      id: '5',
      patientId: id!,
      title: 'Full Mobility',
      description: 'Regain full range of motion',
      targetDate: '2024-02-01',
      status: 'pending',
      priority: 'low'
    },
  ])

  // Mock recovery metrics
  const recoveryMetrics = {
    overallProgress: 65,
    painTrend: -2, // Decreased by 2 points
    medicationAdherence: 100,
    exerciseCompletion: 85,
    sleepQuality: 7.5,
    complianceRate: 92,
    last7Days: [65, 62, 60, 58, 55, 60, 65],
    targetProgress: 70
  }

  const tabs = [
    { id: 'vitals', label: 'Vital Signs', icon: Activity },
    { id: 'milestones', label: 'Milestones', icon: Target },
    { id: 'trends', label: 'Trends', icon: LineChart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ]

  const handleAddVitalSigns = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newVital: VitalSigns = {
      id: Date.now().toString(),
      patientId: id!,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      temperature: parseFloat(formData.get('temperature') as string),
      bloodPressure: {
        systolic: parseInt(formData.get('systolic') as string),
        diastolic: parseInt(formData.get('diastolic') as string)
      },
      heartRate: parseInt(formData.get('heartRate') as string),
      oxygenSaturation: parseInt(formData.get('oxygenSaturation') as string),
      respiratoryRate: parseInt(formData.get('respiratoryRate') as string),
      weight: parseFloat(formData.get('weight') as string),
      painLevel: parseInt(formData.get('painLevel') as string),
      notes: formData.get('notes') as string,
      recordedBy: 'Dr. Current User'
    }

    setVitalSigns([newVital, ...vitalSigns])
    setShowAddVitalsModal(false)
    toast.success('Vital signs recorded successfully')
  }

  const handleAddMilestone = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newMilestone: RecoveryMilestone = {
      id: Date.now().toString(),
      patientId: id!,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      targetDate: formData.get('targetDate') as string,
      status: 'pending',
      priority: formData.get('priority') as 'low' | 'medium' | 'high'
    }

    setMilestones([...milestones, newMilestone])
    setShowAddMilestoneModal(false)
    toast.success('Recovery milestone added')
  }

  const handleUpdateMilestone = (milestoneId: string, updates: Partial<RecoveryMilestone>) => {
    setMilestones(milestones.map(m => 
      m.id === milestoneId ? { ...m, ...updates } : m
    ))
    toast.success('Milestone updated')
  }

  const getVitalStatus = (vital: VitalSigns) => {
    if (vital.temperature > 100.4 || vital.painLevel > 7) return 'critical'
    if (vital.temperature > 99.5 || vital.painLevel > 5) return 'warning'
    return 'normal'
  }

  const getMilestoneStatusColor = (status: RecoveryMilestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'delayed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: RecoveryMilestone['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Calculate statistics
  const calculateStats = () => {
    if (vitalSigns.length === 0) return null

    const latestVital = vitalSigns[0]
    const previousVital = vitalSigns[1] || vitalSigns[0]

    return {
      temperature: {
        current: latestVital.temperature,
        trend: latestVital.temperature - previousVital.temperature,
        status: latestVital.temperature > 100.4 ? 'high' : latestVital.temperature < 97 ? 'low' : 'normal'
      },
      bloodPressure: {
        current: latestVital.bloodPressure,
        trend: {
          systolic: latestVital.bloodPressure.systolic - previousVital.bloodPressure.systolic,
          diastolic: latestVital.bloodPressure.diastolic - previousVital.bloodPressure.diastolic
        },
        status: latestVital.bloodPressure.systolic > 140 || latestVital.bloodPressure.diastolic > 90 ? 'high' : 'normal'
      },
      heartRate: {
        current: latestVital.heartRate,
        trend: latestVital.heartRate - previousVital.heartRate,
        status: latestVital.heartRate > 100 ? 'high' : latestVital.heartRate < 60 ? 'low' : 'normal'
      },
      painLevel: {
        current: latestVital.painLevel,
        trend: latestVital.painLevel - previousVital.painLevel,
        status: latestVital.painLevel > 7 ? 'high' : latestVital.painLevel < 3 ? 'low' : 'normal'
      }
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Recovery Monitoring</h1>
          <p className="text-gray-600">Track and monitor patient recovery progress</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowAddVitalsModal(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Record Vitals
          </Button>
          <Button
            onClick={() => setShowAddMilestoneModal(true)}
            leftIcon={<Target className="h-4 w-4" />}
          >
            Add Milestone
          </Button>
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overall Recovery</p>
                <p className="text-2xl font-bold">{recoveryMetrics.overallProgress}%</p>
                <div className="flex items-center gap-1 text-sm">
                  {recoveryMetrics.overallProgress >= recoveryMetrics.targetProgress ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">On Track</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600">Behind Target</span>
                    </>
                  )}
                </div>
              </div>
              <ActivitySquare className="h-10 w-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pain Level</p>
                <p className="text-2xl font-bold">{stats?.painLevel.current || 'N/A'}/10</p>
                <div className="flex items-center gap-1 text-sm">
                  {stats?.painLevel.trend && stats.painLevel.trend < 0 ? (
                    <>
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Improving</span>
                    </>
                  ) : stats?.painLevel.trend && stats.painLevel.trend > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">Worsening</span>
                    </>
                  ) : (
                    <span className="text-gray-600">Stable</span>
                  )}
                </div>
              </div>
              <Activity className="h-10 w-10 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medication Adherence</p>
                <p className="text-2xl font-bold">{recoveryMetrics.medicationAdherence}%</p>
                <div className="text-sm text-green-600">Excellent</div>
              </div>
              <Pill className="h-10 w-10 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Exercise Completion</p>
                <p className="text-2xl font-bold">{recoveryMetrics.exerciseCompletion}%</p>
                <div className="flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">+10% this week</span>
                </div>
              </div>
              <Dumbbell className="h-10 w-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'vitals' && (
        <div className="space-y-6">
          {/* Latest Vitals Summary */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Latest Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-orange-500" />
                      <span className="font-medium">Temperature</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stats.temperature.current}°F</div>
                    <div className="flex items-center gap-1 text-sm">
                      {stats.temperature.trend > 0 ? (
                        <span className="text-red-600">↑ {Math.abs(stats.temperature.trend).toFixed(1)}°F</span>
                      ) : stats.temperature.trend < 0 ? (
                        <span className="text-green-600">↓ {Math.abs(stats.temperature.trend).toFixed(1)}°F</span>
                      ) : (
                        <span className="text-gray-600">No change</span>
                      )}
                    </div>
                    <Badge variant={stats.temperature.status === 'normal' ? 'success' : 'destructive'} className="mt-2">
                      {stats.temperature.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      <span className="font-medium">Blood Pressure</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {stats.bloodPressure.current.systolic}/{stats.bloodPressure.current.diastolic}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stats.bloodPressure.trend.systolic > 0 ? '↑' : '↓'} {Math.abs(stats.bloodPressure.trend.systolic)}/
                      {stats.bloodPressure.trend.diastolic > 0 ? '↑' : '↓'} {Math.abs(stats.bloodPressure.trend.diastolic)}
                    </div>
                    <Badge variant={stats.bloodPressure.status === 'normal' ? 'success' : 'destructive'} className="mt-2">
                      {stats.bloodPressure.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-pink-500" />
                      <span className="font-medium">Heart Rate</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{stats.heartRate.current} BPM</div>
                    <div className="flex items-center gap-1 text-sm">
                      {stats.heartRate.trend > 0 ? (
                        <span className="text-red-600">↑ {stats.heartRate.trend} BPM</span>
                      ) : stats.heartRate.trend < 0 ? (
                        <span className="text-green-600">↓ {Math.abs(stats.heartRate.trend)} BPM</span>
                      ) : (
                        <span className="text-gray-600">No change</span>
                      )}
                    </div>
                    <Badge variant={stats.heartRate.status === 'normal' ? 'success' : 'warning'} className="mt-2">
                      {stats.heartRate.status.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Weight className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Weight</span>
                    </div>
                    <div className="text-2xl font-bold mb-1">{vitalSigns[0]?.weight || 'N/A'} kg</div>
                    <div className="text-sm text-gray-600">Stable</div>
                    <Badge variant="success" className="mt-2">
                      NORMAL
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vitals History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vital Signs History</CardTitle>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded-md px-3 py-1 text-sm"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="all">All time</option>
                </select>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitalSigns.map((vital) => (
                  <div
                    key={vital.id}
                    className={`p-4 border rounded-lg ${
                      getVitalStatus(vital) === 'critical' ? 'bg-red-50 border-red-200' :
                      getVitalStatus(vital) === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{vital.date}</span>
                          <Clock className="h-4 w-4 text-gray-400 ml-2" />
                          <span>{vital.time}</span>
                        </div>
                        {getVitalStatus(vital) === 'critical' && (
                          <Badge variant="destructive">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        )}
                        {getVitalStatus(vital) === 'warning' && (
                          <Badge variant="warning">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Warning
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        Recorded by {vital.recordedBy}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="font-medium">{vital.temperature}°F</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="font-medium">
                          {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="font-medium">{vital.heartRate} BPM</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">O₂ Saturation</p>
                        <p className="font-medium">{vital.oxygenSaturation}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pain Level</p>
                        <div className="flex items-center">
                          <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${
                                vital.painLevel <= 3 ? 'bg-green-500' :
                                vital.painLevel <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${(vital.painLevel / 10) * 100}%` }}
                            />
                          </div>
                          <span className="font-medium">{vital.painLevel}/10</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Respiratory Rate</p>
                        <p className="font-medium">{vital.respiratoryRate} breaths/min</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Weight</p>
                        <p className="font-medium">{vital.weight} kg</p>
                      </div>
                    </div>

                    {vital.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="text-sm">{vital.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-6">
          {/* Milestones Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Recovery Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-green-100' :
                      milestone.status === 'in_progress' ? 'bg-blue-100' :
                      milestone.status === 'delayed' ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : milestone.status === 'in_progress' ? (
                        <Clock className="h-6 w-6 text-blue-600" />
                      ) : milestone.status === 'delayed' ? (
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      ) : (
                        <Target className="h-6 w-6 text-gray-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getMilestoneStatusColor(milestone.status)}>
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getPriorityColor(milestone.priority)}>
                            {milestone.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Target Date: </span>
                          <span className="font-medium">{formatDate.long(milestone.targetDate)}</span>
                        </div>
                        {milestone.actualDate && (
                          <div>
                            <span className="text-gray-500">Completed: </span>
                            <span className="font-medium">{formatDate.long(milestone.actualDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {milestone.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateMilestone(milestone.id, { status: 'in_progress' })}
                        >
                          Start
                        </Button>
                      )}
                      {milestone.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateMilestone(milestone.id, { 
                            status: 'completed',
                            actualDate: new Date().toISOString().split('T')[0]
                          })}
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Edit milestone */}}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Milestone Statistics</h4>
                    <p className="text-sm text-gray-600">
                      {milestones.filter(m => m.status === 'completed').length} of {milestones.length} completed
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((milestones.filter(m => m.status === 'completed').length / milestones.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {milestones.filter(m => m.status === 'in_progress').length}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {milestones.filter(m => m.status === 'pending').length}
                      </div>
                      <div className="text-sm text-gray-600">Pending</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'trends' && (
        <Card>
          <CardHeader>
            <CardTitle>Recovery Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Pain Level Trend */}
              <div>
                <h4 className="font-medium mb-4">Pain Level Trend</h4>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Pain level decreasing over time</p>
                    <div className="flex items-center justify-center mt-2">
                      {[5, 4, 3, 2, 3, 4, 3].map((level, index) => (
                        <div key={index} className="flex flex-col items-center mx-2">
                          <div
                            className={`w-6 rounded-t-sm ${
                              level <= 3 ? 'bg-green-500' :
                              level <= 6 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ height: `${level * 10}px` }}
                          />
                          <span className="text-xs mt-1">Day {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vital Signs Trends */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Temperature Trend</h4>
                  <div className="h-32 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end h-full">
                      {[99.1, 98.8, 98.6, 98.4, 98.6, 98.5, 98.6].map((temp, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-4 rounded-t-sm ${
                              temp > 100.4 ? 'bg-red-500' :
                              temp > 99.5 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ height: `${(temp - 97) * 20}px` }}
                          />
                          <span className="text-xs mt-1">{temp}°</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">Heart Rate Trend</h4>
                  <div className="h-32 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-end h-full">
                      {[75, 70, 72, 70, 68, 70, 72].map((rate, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-4 rounded-t-sm ${
                              rate > 100 ? 'bg-red-500' :
                              rate > 90 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ height: `${rate}px` }}
                          />
                          <span className="text-xs mt-1">{rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Vitals Modal */}
      <Modal
        isOpen={showAddVitalsModal}
        onClose={() => setShowAddVitalsModal(false)}
        title="Record Vital Signs"
        size="lg"
      >
        <form onSubmit={handleAddVitalSigns} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                name="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <Input
                type="time"
                name="time"
                defaultValue={new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
              <Input
                type="number"
                step="0.1"
                name="temperature"
                placeholder="98.6"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Pain Level (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                name="painLevel"
                placeholder="3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Blood Pressure (Systolic)</label>
              <Input
                type="number"
                name="systolic"
                placeholder="120"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Blood Pressure (Diastolic)</label>
              <Input
                type="number"
                name="diastolic"
                placeholder="80"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heart Rate (BPM)</label>
              <Input
                type="number"
                name="heartRate"
                placeholder="72"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Oxygen Saturation (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                name="oxygenSaturation"
                placeholder="98"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Respiratory Rate</label>
              <Input
                type="number"
                name="respiratoryRate"
                placeholder="16"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                name="weight"
                placeholder="75"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              name="notes"
              placeholder="Additional observations..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddVitalsModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
              Save Vital Signs
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Milestone Modal */}
      <Modal
        isOpen={showAddMilestoneModal}
        onClose={() => setShowAddMilestoneModal(false)}
        title="Add Recovery Milestone"
        size="md"
      >
        <form onSubmit={handleAddMilestone} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Milestone Title</label>
            <Input
              name="title"
              placeholder="e.g., Physical Therapy Completion"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              name="description"
              placeholder="Describe what this milestone represents..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Date</label>
              <Input
                type="date"
                name="targetDate"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                name="priority"
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddMilestoneModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" leftIcon={<Target className="h-4 w-4" />}>
              Add Milestone
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default RecoveryMonitoring