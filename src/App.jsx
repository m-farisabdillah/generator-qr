import { useRef, useState } from 'react'
import QRCode from 'react-qr-code'

const steps = [
  {
    number: '1',
    title: 'Masukkan Data',
    description: 'Ketik atau tempel URL maupun teks Anda.',
  },
  {
    number: '2',
    title: 'Buat Kode',
    description: 'Klik tombol untuk memproses data tersebut.',
  },
  {
    number: '3',
    title: 'Unduh & Bagikan',
    description: 'Simpan hasil QR dalam format PNG resolusi tinggi.',
  },
]

const inputTypes = [
  { id: 'link', label: 'Link' },
  { id: 'text', label: 'Text' },
]

function App() {
  const [inputType, setInputType] = useState('link')
  const [input, setInput] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const qrRef = useRef(null)

  const trackGenerateEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "klik_buat_qr", {
        event_category: "Engagement",
        event_label: "Tombol Buat QR",
      });
    }
  };

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

  const trackDownloadEvent = () => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "klik_download_qr", {
        event_category: "Engagement",
        event_label: "Tombol Download QR",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black">
      <main className="flex w-full flex-1 flex-col items-center justify-start px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex w-full max-w-3xl flex-col gap-10 sm:gap-12">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl">
              QR Code Generator
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Ubah tautan web, portofolio, hingga teks biasa menjadi kode QR
              minimalis yang siap dibagikan dalam hitungan detik. Cepat, gratis,
              dan tanpa batasan.
            </p>
          </header>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-gray-300 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {step.number}
                </span>
                <h2 className="mt-4 text-sm font-bold text-black sm:text-base">
                  {step.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </section>

          <section className="rounded-2xl border border-gray-300 bg-white p-6 shadow-md sm:p-10">
            {!loading && !showResult && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-2">
                  {inputTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setInputType(type.id)}
                      className={`rounded-xl py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-3.5 sm:text-base ${inputType === type.id
                        ? 'border border-black bg-black text-white'
                        : 'border border-gray-300 bg-white text-gray-600 hover:border-black hover:text-black'
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {inputType === 'link' ? (
                  <div>
                    <label
                      htmlFor="qr-input"
                      className="mb-2 block text-sm font-bold text-black sm:text-base"
                    >
                      Tautan
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-600">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.828 10.172a4 4 0 010 5.656l-3.414 3.414a4 4 0 01-5.657-5.657l1.172-1.172M10.172 13.828a4 4 0 010-5.656l3.414-3.414a4 4 0 015.657 5.657L18.07 10.586"
                          />
                        </svg>
                      </span>
                      <input
                        id="qr-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        placeholder="Masukkan URL (contoh: https://...)"
                        className="w-full rounded-xl border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-base text-black placeholder-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black sm:py-4 sm:text-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="qr-text"
                      className="mb-2 block text-sm font-bold text-black sm:text-base"
                    >
                      Teks
                    </label>
                    <textarea
                      id="qr-text"
                      rows={5}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ketik atau tempel teks Anda di sini..."
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-base text-black placeholder-gray-400 outline-none transition focus:border-black focus:ring-2 focus:ring-black sm:text-lg"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleCreate()
                    trackGenerateEvent()
                  }}
                  className="w-full rounded-xl bg-black py-3.5 text-base font-bold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
                >
                  Buat QR Code
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-5 py-8 sm:py-10">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                <p className="animate-pulse text-lg font-medium text-black sm:text-xl">
                  Memproses...
                </p>
              </div>
            )}

            {showResult && (
              <div className="flex flex-col items-center gap-6 sm:gap-7">
                <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-sm sm:p-8">
                  <QRCode
                    ref={qrRef}
                    value={qrUrl}
                    size={256}
                    className="h-auto w-full max-w-[256px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    downloadQR();
                    trackDownloadEvent();
                  }}
                  className="w-full rounded-xl bg-black py-3.5 text-base font-bold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full rounded-xl border border-black bg-white py-3.5 text-base font-bold text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 sm:py-4 sm:text-lg"
                >
                  Buat QR Lainnya
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="px-4 pb-8 pt-4 text-center sm:pb-10">
        <p className="text-sm text-gray-500">
          © 2026 Buatan Muhamad Faris Abdillah. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default App
