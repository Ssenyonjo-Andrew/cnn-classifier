import { useState, useEffect } from 'react'
import { AlertCircle, ArrowUp } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import Dashboard from './components/Dashboard'
import { PredictionResult } from './components/PredictionResult'
import { JadaRecommendation } from './components/JadaRecommendation'
import { predictImage, getExplanation, checkHealth } from './lib/api'
import { PredictionResponse, RecentScan } from './types/index'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [explanation, setExplanation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingExplanation, setIsFetchingExplanation] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [activeScanId, setActiveScanId] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  useEffect(() => {
    const checkModel = async () => {
      try {
        const loaded = await checkHealth()
        setModelLoaded(loaded)
        setIsConnected(true)
      } catch {
        setModelLoaded(false)
        setIsConnected(false)
      }
    }

    checkModel()
    const interval = setInterval(checkModel, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchExplanation = async (result: PredictionResponse) => {
    setIsFetchingExplanation(true)
    setExplanation(null)

    try {
      const explainResult = await getExplanation(
        result.predicted_class,
        result.confidence,
        result.probabilities
      )
      setExplanation(explainResult.explanation)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get explanation'
      setError(errorMessage)
    } finally {
      setIsFetchingExplanation(false)
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setError(null)
    setPrediction(null)
    setExplanation(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    makePrediction(file)
  }

  const makePrediction = async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await predictImage(file)
      setPrediction(result)

      const scanId = crypto.randomUUID()
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = e.target?.result as string
        const newScan: RecentScan = {
          id: scanId,
          imagePreview: preview,
          predictedClass: result.predicted_class,
          filename: file.name,
        }
        setRecentScans((prev) => [newScan, ...prev].slice(0, 5))
        setActiveScanId(scanId)
      }
      reader.readAsDataURL(file)

      fetchExplanation(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setPrediction(null)
    setExplanation(null)
    setError(null)
    setActiveScanId(null)
    setChatInput('')
  }

  const handleSelectScan = (scan: RecentScan) => {
    setActiveScanId(scan.id)
    setImagePreview(scan.imagePreview)
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#080d0a] flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-[#0f1612] border border-emerald-900/40 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="text-red-400" size={28} />
            <h2 className="text-xl font-bold text-white">Connection Error</h2>
          </div>
          <p className="text-slate-400 mb-4 text-sm">
            Unable to connect to the API server. Please ensure the FastAPI backend is running on
            <code className="bg-emerald-950 px-2 py-0.5 rounded mx-1 text-emerald-400">http://localhost:8000</code>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080d0a] flex">
      <Sidebar
        onFileSelect={handleFileSelect}
        isLoading={isLoading}
        disabled={!modelLoaded}
        recentScans={recentScans}
        activeScanId={activeScanId}
        onSelectScan={handleSelectScan}
        onAnalyseNew={handleReset}
        hasPrediction={!!prediction}
      />

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/30">
          <h2 className="text-lg font-semibold text-white">Diagnosis</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDashboard((s) => !s)}
              className="text-sm px-3 py-1 rounded-md bg-emerald-600/10 border border-emerald-900/30 text-emerald-300 hover:bg-emerald-600/20"
            >
              {showDashboard ? 'Close dashboard' : 'Open dashboard'}
            </button>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <span className={`w-1.5 h-1.5 rounded-full ${modelLoaded ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              {modelLoaded ? 'Model ready' : 'Loading model'}
            </span>
            <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              86% accuracy
            </span>
          </div>
        </header>

        <div className="flex-1 flex flex-col px-6 py-6 overflow-y-auto">
          {showDashboard && (
            <div className="mb-6">
              <Dashboard scans={recentScans} onSelectScan={handleSelectScan} />
            </div>
          )}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {prediction ? (
            <div className="flex-1 flex flex-col">
              <PredictionResult
                result={prediction}
                imagePreview={imagePreview || undefined}
                filename={selectedFile?.name}
                recommendation={
                  <JadaRecommendation
                    explanation={explanation}
                    isFetching={isFetchingExplanation}
                  />
                }
              />

              <div className="mt-auto pt-8">
                <div className="relative">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Jada about this diagnosis... e.g. how do I treat this?"
                    className="w-full bg-[#0f1612] border border-emerald-900/40 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-700/60 transition-colors"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                    aria-label="Send message"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
                <p className="text-right text-[11px] text-slate-600 mt-2">
                  Input size: {prediction.input_size[0]} × {prediction.input_size[1]} px
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                {/* <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl"></span>
                </div> */}
                <p className="text-slate-300 font-medium mb-1">Upload a maize leaf to begin</p>
                <p className="text-sm text-slate-500">
                  The model will analyse the leaf, then Jada will stream field recommendations for the predicted disease class.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
