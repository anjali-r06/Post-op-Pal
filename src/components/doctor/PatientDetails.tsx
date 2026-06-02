import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { patientService } from '../../services/patient.service'
import { doctorService } from '../../services/doctor.service'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { Input } from '../common/Input'
import { Textarea } from '../common/Textarea'
import { Modal } from '../common/Modal'
import { Loader } from '../common/Loader'
import { Tabs } from '../common/Tabs'
import {
  ArrowLeft,
  User,
  Calendar,
  Activity,
  Pill,
  FileText,
  MessageSquare,
  Phone,
  AlertTriangle,
  Edit,
  Save,
  Download,
  Printer,
  Camera,
  TrendingUp,
  Heart,
  Stethoscope,
  Clipboard,
  FileUp
} from 'lucide-react'
import { formatDate } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCarePlanModal, setShowCarePlanModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [newNote, setNewNote] = useState('')

  // Fetch patient data
  const { data: patient, isLoading: patientLoading } = useQuery(
    ['patient', id],
    () => patientService.getById(id!),
    { enabled: !!id }
  )

  // Fetch patient check-ins
  const { data: checkIns, isLoading: checkInsLoading } = useQuery(
    ['check-ins', id],
    () => patientService.getCheckIns(id!),
    { enabled: !!id }
  )

  // Fetch patient alerts
  const { data: alerts } = useQuery(  // Removed unused alertsLoading
    ['alerts', id],
    () => patientService.getAlerts(id!),
    { enabled: !!id }
  )

  // Update status mutation
  const updateStatusMutation = useMutation(
    (status: 'normal' | 'attention' | 'critical') =>
      doctorService.updatePatientStatus(id!, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['patient', id])
        toast.success('Patient status updated')
      },
      onError: () => {
        toast.error('Failed to update status')
      }
    }
  )

  // Add note mutation
  const addNoteMutation = useMutation(
    (note: string) => doctorService.addPatientNote(id!, note),
    {
      onSuccess: () => {
        setNewNote('')
        queryClient.invalidateQueries(['patient', id])
        toast.success('Note added successfully')
      },
      onError: () => {
        toast.error('Failed to add note')
      }
    }
  )

  // Update care plan mutation
  const updateCarePlanMutation = useMutation(
    (formData: FormData) => patientService.uploadCarePlan({
      patientId: id!,
      file: formData.get('file') as File,
      title: formData.get('title') as string,
      notes: formData.get('notes') as string
    }),
    {
      onSuccess: () => {
        setShowCarePlanModal(false)
        toast.success('Care plan uploaded successfully')
      },
      onError: () => {
        toast.error('Failed to upload care plan')
      }
    }
  )

  const handleUpdateStatus = (status: 'normal' | 'attention' | 'critical') => {
    if (window.confirm(`Change patient status to ${status}?`)) {
      updateStatusMutation.mutate(status)
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote)
    }
  }

  const handleSendMessage = () => {
    // Implement message sending
    setShowMessageModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800'
      case 'attention': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateRecoveryProgress = () => {
    if (!patient) return 0
    // Simple calculation based on recovery day (assuming 30-day recovery)
    return Math.min(100, (patient.recoveryDay / 30) * 100)
  }

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" />
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Patient not found</h2>
        <Button onClick={() => navigate('/doctor/patients')}>
          Back to Patients
        </Button>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'checkins', label: 'Daily Check-ins', icon: Activity },
    { id: 'vitals', label: 'Vitals History', icon: Heart },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'careplan', label: 'Care Plan', icon: FileText },
    { id: 'notes', label: 'Notes', icon: Clipboard },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/doctor/patients')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{patient.name}</h1>
            <p className="text-gray-600">
              Patient ID: {patient.id} • {patient.age} years • {patient.gender}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(patient.status)}>
            {patient.status.toUpperCase()}
          </Badge>
          <Button
            variant="outline"
            onClick={() => setShowEditModal(true)}
            leftIcon={<Edit className="h-4 w-4" />}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleSendMessage}
            leftIcon={<MessageSquare className="h-4 w-4" />}
          >
            Message
          </Button>
          <Button
            onClick={() => window.print()}
            leftIcon={<Printer className="h-4 w-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Status Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={patient.status === 'normal' ? 'default' : 'outline'}
          onClick={() => handleUpdateStatus('normal')}
        >
          Mark as Normal
        </Button>
        <Button
          variant={patient.status === 'attention' ? 'default' : 'outline'}
          onClick={() => handleUpdateStatus('attention')}
        >
          Needs Attention
        </Button>
        <Button
          variant={patient.status === 'critical' ? 'default' : 'outline'}
          onClick={() => handleUpdateStatus('critical')}
        >
          Critical
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(`/doctor/patients/${id}/qr`)}
          leftIcon={<Camera className="h-4 w-4" />}
        >
          View QR Code
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Surgery Type</p>
                      <p className="font-medium">{patient.surgeryType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Surgery Date</p>
                      <p className="font-medium">
                        {formatDate.long(patient.surgeryDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recovery Day</p>
                      <p className="font-medium">Day {patient.recoveryDay}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Language</p>
                      <p className="font-medium capitalize">{patient.language}</p>
                    </div>
                    {patient.roomNumber && (
                      <div>
                        <p className="text-sm text-gray-600">Room/Bed</p>
                        <p className="font-medium">
                          {patient.roomNumber}/{patient.bedNumber}
                        </p>
                      </div>
                    )}
                    {patient.bloodGroup && (
                      <div>
                        <p className="text-sm text-gray-600">Blood Group</p>
                        <p className="font-medium">{patient.bloodGroup}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recovery Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recovery Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Recovery</span>
                        <span className="font-bold">
                          {calculateRecoveryProgress().toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-1000"
                          style={{ width: `${calculateRecoveryProgress()}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Activity className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">85%</div>
                        <div className="text-sm text-gray-600">Exercise</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Pill className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">100%</div>
                        <div className="text-sm text-gray-600">Medication</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Heart className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">92%</div>
                        <div className="text-sm text-gray-600">Vitals</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Calendar className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <div className="text-xl font-bold">7</div>
                        <div className="text-sm text-gray-600">Recovery Days</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'checkins' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Daily Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent>
                {checkInsLoading ? (
                  <Loader />
                ) : checkIns && checkIns.length > 0 ? (
                  <div className="space-y-4">
                    {checkIns.map((checkIn) => (
                      <div
                        key={checkIn.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {formatDate.long(checkIn.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Pill className="h-4 w-4 text-gray-400" />
                              <span
                                className={`text-sm ${checkIn.medicationCompliance ? 'text-green-600' : 'text-red-600'
                                  }`}
                              >
                                {checkIn.medicationCompliance ? 'Med Taken' : 'Missed'}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4 text-gray-400" />
                              <span
                                className={`text-sm ${checkIn.exercisesCompleted ? 'text-green-600' : 'text-red-600'
                                  }`}
                              >
                                {checkIn.exercisesCompleted ? 'Exercises Done' : 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Pain Level</p>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full mx-0.5 ${i < checkIn.painLevel ? 'bg-red-500' : 'bg-gray-300'
                                      }`}
                                  />
                                ))}
                                <span className="ml-2 text-sm">
                                  ({checkIn.painLevel}/10)
                                </span>
                              </div>
                            </div>
                            {checkIn.temperature && (
                              <div>
                                <p className="text-sm text-gray-600">Temperature</p>
                                <p className="font-medium">{checkIn.temperature}°F</p>
                              </div>
                            )}
                            {checkIn.bloodPressure && (
                              <div>
                                <p className="text-sm text-gray-600">Blood Pressure</p>
                                <p className="font-medium">{checkIn.bloodPressure}</p>
                              </div>
                            )}
                            {checkIn.heartRate && (
                              <div>
                                <p className="text-sm text-gray-600">Heart Rate</p>
                                <p className="font-medium">{checkIn.heartRate} BPM</p>
                              </div>
                            )}
                          </div>
                          {checkIn.symptoms && checkIn.symptoms.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-600">Symptoms</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {checkIn.symptoms.map((symptom: string, index: number) => (
                                  <Badge key={index} variant="outline">
                                    {symptom}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {checkIn.notes && (
                            <div>
                              <p className="text-sm text-gray-600">Notes</p>
                              <p className="text-sm">{checkIn.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No check-ins yet</h3>
                    <p className="text-gray-600">Patient hasn't submitted any daily check-ins</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'notes' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clipboard className="h-5 w-5" />
                  Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add Note Form */}
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a clinical note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || addNoteMutation.isLoading}
                        leftIcon={<Save className="h-4 w-4" />}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  {patient.notes ? (
                    <div className="border-t pt-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Latest Note</span>
                          <span className="text-sm text-gray-500">
                            {formatDate.relative(patient.updatedAt)}
                          </span>
                        </div>
                        <p className="text-sm">{patient.notes}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clipboard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No clinical notes yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowCarePlanModal(true)}
                leftIcon={<FileText className="h-4 w-4" />}
              >
                Update Care Plan
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleSendMessage}
                leftIcon={<MessageSquare className="h-4 w-4" />}
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.open(`tel:${patient.contactNumber}`)}
                leftIcon={<Phone className="h-4 w-4" />}
              >
                Call Patient
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Schedule Follow-up
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download Report
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">{patient.contactNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preferred Language</p>
                <p className="font-medium capitalize">{patient.language}</p>
              </div>
              {patient.doctorName && (
                <div>
                  <p className="text-sm text-gray-600">Assigned Doctor</p>
                  <p className="font-medium">{patient.doctorName}</p>
                </div>
              )}
              {patient.emergencyContact && (
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium">{patient.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">
                    {patient.emergencyContact.relationship} •{' '}
                    {patient.emergencyContact.phone}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          {alerts && alerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts
                    .filter((alert: any) => !alert.resolved)
                    .map((alert: any) => (
                      <div
                        key={alert.id}
                        className="p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">{alert.type}</p>
                            <p className="text-sm text-red-700">{alert.message}</p>
                            <p className="text-xs text-red-600 mt-1">
                              {formatDate.relative(alert.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Medical Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.allergies && patient.allergies.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.allergies.map((allergy: string, index: number) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient.comorbidities && patient.comorbidities.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600">Comorbidities</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {patient.comorbidities.map((condition: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Admission Date</p>
                <p className="font-medium">
                  {formatDate.long(patient.admissionDate)}
                </p>
              </div>
              {patient.dischargeDate && (
                <div>
                  <p className="text-sm text-gray-600">Discharge Date</p>
                  <p className="font-medium">
                    {formatDate.long(patient.dischargeDate)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Patient Information"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input defaultValue={patient.name} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Age</label>
              <Input type="number" defaultValue={patient.age} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Contact Number</label>
              <Input defaultValue={patient.contactNumber} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                className="w-full border rounded-md px-3 py-2"
                defaultValue={patient.language}
              >
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Care Plan Upload Modal */}
      <Modal
        isOpen={showCarePlanModal}
        onClose={() => setShowCarePlanModal(false)}
        title="Upload Care Plan"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            updateCarePlanMutation.mutate(formData)
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              name="title"
              placeholder="e.g., Post-Op Knee Replacement Recovery Plan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">File (PDF)</label>
            <Input
              type="file"
              name="file"
              accept=".pdf"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Textarea
              name="notes"
              placeholder="Additional instructions or notes..."
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowCarePlanModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateCarePlanMutation.isLoading}
              leftIcon={<FileUp className="h-4 w-4" />}
            >
              {updateCarePlanMutation.isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Send Message Modal */}
      <Modal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title={`Send Message to ${patient.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              placeholder="Type your message here..."
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setShowMessageModal(false)}
            >
              Cancel
            </Button>
            <Button leftIcon={<MessageSquare className="h-4 w-4" />}>
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PatientDetails