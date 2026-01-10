import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { patientService } from '../../services/patient.service'
import { Table } from '../common/Table'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import { Modal } from '../common/Modal'
import { Loader } from '../common/Loader'
import { Eye, MessageSquare, Filter, Search, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const PatientList: React.FC = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const { data: patients, isLoading, error } = useQuery(
    ['patients', statusFilter],
    () => patientService.getAll()
  )

  const filteredPatients = patients?.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.surgeryType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return <Badge variant="success">Normal</Badge>
      case 'attention':
        return <Badge variant="warning">Attention</Badge>
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleViewPatient = (patientId: string) => {
    navigate(`/doctor/patients/${patientId}`)
  }

  const handleSendMessage = (patientId: string) => {
    // In production, this would open a message modal
    console.log('Send message to patient:', patientId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error loading patients</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients by name, surgery type, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filters
          </Button>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('all')}
        >
          All Patients
        </Button>
        <Button
          variant={statusFilter === 'normal' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('normal')}
        >
          Normal
        </Button>
        <Button
          variant={statusFilter === 'attention' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('attention')}
        >
          Needs Attention
        </Button>
        <Button
          variant={statusFilter === 'critical' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter('critical')}
        >
          Critical
        </Button>
      </div>

      {/* Patients Table */}
      {filteredPatients && filteredPatients.length > 0 ? (
        <Table
          headers={['Patient', 'Age/Gender', 'Surgery', 'Recovery Day', 'Status', 'Language', 'Actions']}
          data={filteredPatients.map(patient => [
            <div key={`name-${patient.id}`}>
              <div className="font-medium">{patient.name}</div>
              <div className="text-sm text-gray-500">ID: {patient.id}</div>
            </div>,
            <div key={`age-${patient.id}`}>
              {patient.age} yrs • {patient.gender}
            </div>,
            patient.surgeryType,
            <div key={`recovery-${patient.id}`}>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min(100, (patient.recoveryDay / 30) * 100)}%` }}
                  />
                </div>
                <span>Day {patient.recoveryDay}</span>
              </div>
            </div>,
            getStatusBadge(patient.status),
            <div key={`lang-${patient.id}`} className="flex items-center">
              <span className="text-xl mr-2">
                {patient.language === 'hindi' ? '🇮🇳' : '🇬🇧'}
              </span>
              <span className="capitalize">{patient.language}</span>
            </div>,
            <div key={`actions-${patient.id}`} className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewPatient(patient.id)}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(patient.id)}
                leftIcon={<MessageSquare className="h-4 w-4" />}
              >
                Message
              </Button>
            </div>
          ])}
        />
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No patients found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Showing {filteredPatients?.length || 0} of {patients?.length || 0} patients
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>Normal: {patients?.filter(p => p.status === 'normal').length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span>Attention: {patients?.filter(p => p.status === 'attention').length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span>Critical: {patients?.filter(p => p.status === 'critical').length || 0}</span>
          </div>
        </div>
      </div>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter Patients"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <div className="space-y-2">
              {['all', 'normal', 'attention', 'critical'].map(status => (
                <label key={status} className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={statusFilter === status}
                    onChange={() => setStatusFilter(status)}
                    className="mr-2"
                  />
                  <span className="capitalize">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Surgery Type</label>
            <select className="w-full border rounded-md px-3 py-2">
              <option value="">All Types</option>
              <option value="Knee Replacement">Knee Replacement</option>
              <option value="Hip Replacement">Hip Replacement</option>
              <option value="Cataract Surgery">Cataract Surgery</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Recovery Day Range</label>
            <div className="flex items-center gap-2">
              <Input type="number" placeholder="Min" />
              <span>to</span>
              <Input type="number" placeholder="Max" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setStatusFilter('all')
                setSearchTerm('')
              }}
            >
              Clear All
            </Button>
            <Button
              className="flex-1"
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PatientList