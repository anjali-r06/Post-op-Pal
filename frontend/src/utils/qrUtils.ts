import QRCode from 'qrcode'

export interface QRPatientData {
  patientId: string
  name: string
  emergencyContact?: string
  bloodGroup?: string
  allergies?: string[]
  doctorId?: string
  timestamp: string
  type: 'patient_identification' | 'medical_access' | 'quick_info'
}

export interface QRFacilityData {
  facilityId: string
  name: string
  department?: string
  location?: string
  contact?: string
  type: 'facility_access' | 'room_access' | 'equipment_access'
}

export class QRUtils {
  // Generate QR code as data URL
  static async generateQRCode(data: string | object): Promise<string> {
    try {
      const dataString = typeof data === 'string' ? data : JSON.stringify(data)
      return await QRCode.toDataURL(dataString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H' // High error correction for medical use
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
      throw new Error('Failed to generate QR code')
    }
  }

  // Generate patient QR data
  static generatePatientQRData(patient: {
    id: string
    name: string
    emergencyContact?: string
    bloodGroup?: string
    allergies?: string[]
    doctorId?: string
  }): QRPatientData {
    return {
      patientId: patient.id,
      name: patient.name,
      emergencyContact: patient.emergencyContact,
      bloodGroup: patient.bloodGroup,
      allergies: patient.allergies,
      doctorId: patient.doctorId,
      timestamp: new Date().toISOString(),
      type: 'patient_identification'
    }
  }

  // Generate facility QR data
  static generateFacilityQRData(facility: {
    id: string
    name: string
    department?: string
    location?: string
    contact?: string
  }): QRFacilityData {
    return {
      facilityId: facility.id,
      name: facility.name,
      department: facility.department,
      location: facility.location,
      contact: facility.contact,
      type: 'facility_access'
    }
  }

  // Parse QR code data
  static parseQRData(data: string): QRPatientData | QRFacilityData | string {
    try {
      const parsed = JSON.parse(data)
      
      // Validate patient data
      if (parsed.patientId && parsed.type?.includes('patient')) {
        return parsed as QRPatientData
      }
      
      // Validate facility data
      if (parsed.facilityId && parsed.type?.includes('access')) {
        return parsed as QRFacilityData
      }
      
      return data // Return as string if not recognized format
    } catch {
      return data // Return as string if not JSON
    }
  }

  // Validate patient QR data
  static validatePatientQR(data: QRPatientData): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (!data.patientId) errors.push('Patient ID is required')
    if (!data.name) errors.push('Patient name is required')
    if (!data.timestamp) errors.push('Timestamp is required')
    
    // Check if timestamp is valid and not expired (older than 24 hours)
    if (data.timestamp) {
      const timestamp = new Date(data.timestamp)
      const now = new Date()
      const hoursDiff = Math.abs(now.getTime() - timestamp.getTime()) / 36e5
      
      if (hoursDiff > 24) {
        errors.push('QR code has expired (older than 24 hours)')
      }
      
      if (timestamp > now) {
        errors.push('QR code timestamp is in the future')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Generate download link for QR code
  static downloadQRCode(dataUrl: string, filename: string = 'qrcode.png'): void {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Generate QR code for printing
  static async generatePrintableQR(data: string | object, includeText: boolean = true): Promise<string> {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data)
    
    // Generate QR code
    const qrDataUrl = await QRCode.toDataURL(dataString, {
      width: 400,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    // Create printable HTML with QR code and text
    const printableHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical QR Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            text-align: center;
          }
          .qr-container {
            max-width: 500px;
            margin: 0 auto;
            padding: 20px;
            border: 2px solid #333;
            border-radius: 10px;
          }
          .qr-code {
            margin: 20px 0;
          }
          .patient-info {
            text-align: left;
            margin-top: 20px;
            font-size: 14px;
          }
          .instruction {
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
          .timestamp {
            font-size: 11px;
            color: #999;
            margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="qr-container">
          <h2>Medical Access QR Code</h2>
          <div class="qr-code">
            <img src="${qrDataUrl}" alt="QR Code" />
          </div>
          ${includeText ? `
            <div class="instruction">
              <strong>Instructions:</strong> Scan this QR code to access patient medical information.
              Valid for 24 hours from generation.
            </div>
            <div class="timestamp">
              Generated on: ${new Date().toLocaleString()}
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `
    
    return printableHTML
  }

  // Print QR code
  static printQRCode(data: string | object): void {
    this.generatePrintableQR(data).then(html => {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        printWindow.focus()
        setTimeout(() => {
          printWindow.print()
          printWindow.close()
        }, 250)
      }
    })
  }

  // Generate multiple QR codes for batch printing
  static async generateBatchQRCodes(
    items: Array<{ data: string | object; label?: string }>
  ): Promise<Array<{ dataUrl: string; label?: string }>> {
    const promises = items.map(async (item) => {
      const dataUrl = await this.generateQRCode(item.data)
      return {
        dataUrl,
        label: item.label
      }
    })
    
    return Promise.all(promises)
  }

  // Create QR code with logo
  // Remove the logoUrl parameter
static async generateQRWithLogo(
  data: string | object,
  // logoUrl: string // Remove this unused parameter
): Promise<string> {
  // This would require a more complex implementation with canvas
  // For now, we'll return a regular QR code
  console.warn('QR code with logo feature requires additional implementation')
  return this.generateQRCode(data)
}

  // Calculate QR code size based on data length
  static calculateOptimalSize(data: string): number {
    const length = data.length
    if (length < 50) return 200
    if (length < 100) return 250
    if (length < 200) return 300
    return 350
  }
}

// Export utility functions
export const qrUtils = {
  generatePatientQR: (patientData: any) => QRUtils.generatePatientQRData(patientData),
  parseQR: (data: string) => QRUtils.parseQRData(data),
  validateQR: (data: any) => QRUtils.validatePatientQR(data),
  download: (dataUrl: string, filename: string) => QRUtils.downloadQRCode(dataUrl, filename),
  print: (data: string | object) => QRUtils.printQRCode(data),
}