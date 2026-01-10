
import React, { useState, useRef, useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { Button } from './Button'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { X, Camera, CheckCircle } from 'lucide-react'

interface QRCodeScannerProps {
  onScan: (data: string) => void
  onClose: () => void
  title?: string
  description?: string
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onClose,
  title = 'Scan QR Code',
  description = 'Position the QR code within the frame to scan'
}) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)

  useEffect(() => {
    if (!scannerRef.current && isScanning) {
      scannerRef.current = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        },
        false
      )

      scannerRef.current.render(
        (decodedText) => {
          setScannedData(decodedText)
          setIsScanning(false)
          if (scannerRef.current) {
            scannerRef.current.clear()
          }
          onScan(decodedText)
        },
        (error) => {
          console.warn('QR Scan error:', error)
        }
      )
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
        scannerRef.current = null
      }
    }
  }, [isScanning, onScan])

  const startScanning = () => {
    setIsScanning(true)
    setScannedData(null)
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (scannerRef.current) {
      scannerRef.current.clear()
      scannerRef.current = null
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        
        <div className="relative">
          <div id="qr-reader" className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
            {!isScanning && !scannedData && (
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Camera not active</p>
              </div>
            )}
            
            {scannedData && (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium">QR Code Scanned Successfully!</p>
                <p className="text-xs text-gray-500 truncate max-w-xs">{scannedData}</p>
              </div>
            )}
          </div>
          
          {isScanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse"></div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {!isScanning ? (
            <Button onClick={startScanning} leftIcon={<Camera className="h-4 w-4" />}>
              Start Scanning
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopScanning}>
              Stop Scanning
            </Button>
          )}
          
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default QRCodeScanner