import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import { QrCode, Download, Share2, Eye, EyeOff } from 'lucide-react'
import { Modal } from '../common/Modal'

const QRAccess: React.FC = () => {
  const [showQR, setShowQR] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const patientDetails = {
    name: 'Rajesh Kumar',
    patientId: 'PID-2024-001',
    surgery: 'Knee Replacement',
    doctor: 'Dr. Sharma',
    emergencyContact: '+91 9876543210',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Sulfa']
  }

  const qrValue = JSON.stringify({
    patientId: patientDetails.patientId,
    name: patientDetails.name,
    emergencyContact: patientDetails.emergencyContact
  })

  const handleDownloadQR = () => {
    // In production, generate and download QR code image
    console.log('Download QR code')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Medical QR Code',
        text: `Patient: ${patientDetails.name}, ID: ${patientDetails.patientId}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(qrValue)
      alert('QR code data copied to clipboard!')
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Quick Access QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Show this QR code to healthcare providers for quick access to your medical information.
          </p>

          <div className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              {showQR ? (
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">QR Code Preview</div>
                  <div className="bg-white p-2 rounded">
                    {/* In production, use a QR code library */}
                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR code hidden for privacy</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(!showQR)}
                leftIcon={showQR ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              >
                {showQR ? 'Hide' : 'Show'} QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadQR}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                leftIcon={<Share2 className="h-4 w-4" />}
              >
                Share
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Patient ID</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {patientDetails.patientId}
              </code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowDetails(true)}
            >
              View Medical Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Medical Details"
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium">{patientDetails.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Patient ID</label>
              <p className="font-medium">{patientDetails.patientId}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Surgery Type</label>
              <p className="font-medium">{patientDetails.surgery}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Attending Doctor</label>
              <p className="font-medium">{patientDetails.doctor}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Blood Group</label>
              <p className="font-medium">{patientDetails.bloodGroup}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Emergency Contact</label>
              <p className="font-medium">{patientDetails.emergencyContact}</p>
            </div>
          </div>
          
          {patientDetails.allergies.length > 0 && (
            <div>
              <label className="text-sm text-gray-500">Allergies</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {patientDetails.allergies.map((allergy, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              This information is encrypted and only accessible to authorized healthcare providers.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default QRAccess