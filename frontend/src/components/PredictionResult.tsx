import { PredictionResponse } from '../types/index'
import { DiagnosisPanel } from './DiagnosisPanel'

interface PredictionResultProps {
  result: PredictionResponse
  imagePreview?: string
  filename?: string
  recommendation: React.ReactNode
}

export const PredictionResult = ({
  result,
  imagePreview,
  filename,
  recommendation,
}: PredictionResultProps) => {
  return (
    <div className="w-full space-y-5">
      {imagePreview && (
        <div className="inline-flex items-center gap-3 bg-[#111916] border border-emerald-900/40 rounded-xl px-3 py-2">
          <img
            src={imagePreview}
            alt="Uploaded maize leaf"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm text-slate-200 font-medium">{filename ?? 'uploaded_leaf.jpg'}</p>
            <p className="text-xs text-slate-500">
              {result.input_size[0]} × {result.input_size[1]} px
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <DiagnosisPanel result={result} />
        {recommendation}
      </div>
    </div>
  )
}
