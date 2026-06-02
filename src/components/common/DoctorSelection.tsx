import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Input } from './Input'
import { Loader } from './Loader'
import DoctorList from './DoctorList'
import { Search } from 'lucide-react'
import { doctorService } from '../../services/doctor.service'
import type { Doctor } from '../../types/doctor.types'

interface DoctorSelectionProps {
  onDoctorSelect: (doctor: Doctor) => void
  selectedDoctorId?: string
  specialization?: string
  allowFilters?: boolean
}

const DoctorSelection: React.FC<DoctorSelectionProps> = ({
  onDoctorSelect,
  selectedDoctorId,
  specialization,
  allowFilters = true
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [specializationFilter, setSpecializationFilter] = useState(specialization || '')
  const [departmentFilter, setDepartmentFilter] = useState('')

  const { data: doctors = [], isLoading, error } = useQuery(
    ['doctors', specializationFilter, departmentFilter],
    () => doctorService.getAllDoctors({
      specialization: specializationFilter || undefined,
      department: departmentFilter || undefined
    })
  )

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <Loader />
  if (error) return <div className="text-red-500">Error loading doctors</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Doctor</CardTitle>
      </CardHeader>
      <CardContent>
        {allowFilters && (
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search doctors by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Specializations</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                <option value="Surgery">Surgery</option>
                <option value="Medicine">Medicine</option>
              </select>
            </div>
          </div>
        )}

        <DoctorList
          doctors={filteredDoctors}
          onSelectDoctor={onDoctorSelect}
          selectedDoctorId={selectedDoctorId}
        />

        {filteredDoctors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No doctors found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DoctorSelection