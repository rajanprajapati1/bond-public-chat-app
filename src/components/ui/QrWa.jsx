import { QrCode } from 'lucide-react'
import RandomQRCode from '../custom/Barcode'

export default function QrWa() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-[#00a884] p-2 rounded-lg mb-4">
          <QrCode size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Use WhatsApp on your computer</h2>
      </div>

      <ol className="list-decimal list-inside mb-6 text-gray-600">
        <li>Open WhatsApp on your phone</li>
        <li>Tap Menu or Settings and select Linked Devices</li>
        <li>Tap on Link a Device</li>
        <li>Point your phone to this screen to capture the QR code</li>
      </ol>

      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex items-center justify-center">
      <RandomQRCode/>
      </div>

      <div className="text-center text-sm text-gray-500">
        <a href="#" className="text-[#00a884] hover:underline">Need help to get started?</a>
      </div>
    </div>
  )
}

