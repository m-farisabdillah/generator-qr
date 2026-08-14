import { useRef, useState } from 'react'
import QRCode from 'react-qr-code'

function App() {
  const [input, setInput] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const qrRef = useRef(null)

  const handleCreate = () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setQrUrl(trimmed)
    setShowResult(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowResult(true)
    }, 1500)
  }

  const handleBack = () => {
    setShowResult(false)
    setLoading(false)
  }

  const downloadQR = () => {
    const svg = qrRef.current
    if (!svg) return
    const seralized = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([seralized], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const objectUrl = URL.createObjectURL(svgBlob)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(objectUrl)
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = 'qr-code.png'
      link.click()
    }
    img.src = objectUrl
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-10 font-sans text-black sm:px-10">
      <div className="w-full max-w-sm sm:max-w-md">
        {!loading && !showResult && (
          <div className="flex flex-col gap-4 sm:gap-5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Masukkan URL Anda..."
              className="w-full rounded-xl border border-black bg-white px-5 py-3.5 text-base text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-black sm:py-4 sm:text-lg"
            />
            <button
              type="button"
              onClick={handleCreate}
              className="w-full rounded-xl bg-black py-3.5 text-base font-bold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
            >
              Buat
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-5 py-8">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
            <p className="animate-pulse text-lg font-medium text-black sm:text-xl">
              Memproses...
            </p>
          </div>
        )}

        {showResult && (
          <div className="flex flex-col items-center gap-6">
            <div className="rounded-xl border border-black bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:p-8">
              <QRCode
                ref={qrRef}
                value={qrUrl}
                size={256}
                className="h-auto w-full max-w-[256px]"
              />
            </div>
            <button
              type="button"
              onClick={downloadQR}
              className="w-full rounded-xl bg-black py-3.5 text-base font-bold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
            >
              Download
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="w-full rounded-xl border border-black bg-white py-3.5 text-base font-bold text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
            >
              Kembali
            </button>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 left-0 w-full text-center text-sm text-gray-500 sm:bottom-6">
        Dibuat oleh Muhamad Faris Abdillah
      </footer>
    </div>
  )
}

export default App