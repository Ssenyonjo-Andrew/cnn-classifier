import { PredictionResponse } from '../types/index'
import { ProbabilityDonut } from './ProbabilityDonut'

interface DiagnosisPanelProps {
  result: PredictionResponse
}

export const DiagnosisPanel = ({ result }: DiagnosisPanelProps) => {
  const isHealthy = result.predicted_class === 'Healthy'
  const confidenceLabel = result.confidence >= 80
    ? 'High confidence'
    : result.confidence >= 60
      ? 'Moderate confidence'
      : 'Needs review'

  return (
    <div className="relative bg-[#0f1612] border border-emerald-900/30 rounded-2xl overflow-hidden h-full">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-400" />

      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
            MaizeGuard Diagnosis
          </p>
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              isHealthy
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                : 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
            }`}
          >
            {isHealthy ? 'Healthy leaf' : 'Disease detected'}
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-semibold text-white tracking-tight">
          {result.predicted_class}
        </h2>
        <p className="mt-2 text-sm text-emerald-400/80">
          Confidence {result.confidence.toFixed(1)}% · {confidenceLabel}
        </p>

        <div className="mt-6 flex-1 flex items-center">
          <ProbabilityDonut
            probabilities={result.probabilities}
            predictedClass={result.predicted_class}
          />
        </div>
      </div>
    </div>
  )
}
