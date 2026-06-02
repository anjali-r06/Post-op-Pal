import React from 'react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import { Badge } from './Badge'
import { Star, Clock, Users } from 'lucide-react'
import type { Doctor } from '../../types/doctor.types'

interface DoctorListProps {
  doctors: Doctor[]
  onSelectDoctor?: (doctor: Doctor) => void
  selectedDoctorId?: string
  showSelectButton?: boolean
  compact?: boolean
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  onSelectDoctor,
  selectedDoctorId,
  showSelectButton = true,
  compact = false
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className={selectedDoctorId === doctor.id ? 'ring-2 ring-blue-500' : ''}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                {getInitials(doctor.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  {doctor.rating && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{doctor.rating}</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-sm text-gray-500">{doctor.department} • {doctor.experience} years exp.</p>

                {!compact && (
                  <>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{doctor.currentPatientLoad}/{doctor.maxPatientCapacity} patients</span>
                    </div>

                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{doctor.availability.days.join(', ')} • {doctor.availability.hours.start}-{doctor.availability.hours.end}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctor.languages.map(lang => (
                        <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {showSelectButton && onSelectDoctor && (
                <Button
                  onClick={() => onSelectDoctor(doctor)}
                  disabled={doctor.status !== 'available'}
                  variant={selectedDoctorId === doctor.id ? 'default' : 'outline'}
                  size="sm"
                >
                  {selectedDoctorId === doctor.id ? 'Selected' : 'Select'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DoctorList