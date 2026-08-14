import { BrainCircuitIcon, Sparkles } from 'lucide-react'
import { useStreamingText } from '../hooks/useStreamingText'

interface JadaRecommendationProps {
  explanation: string | null
  isFetching: boolean
}

export const JadaRecommendation = ({ explanation, isFetching }: JadaRecommendationProps) => {
  const { displayedText, isThinking, isStreaming } = useStreamingText(
    explanation,
    !!explanation
  )

  return (
    <div className="relative bg-[#0f1612] border border-emerald-900/30 rounded-2xl overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-emerald-400" />

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
            <BrainCircuitIcon size={16} className="text-violet-300" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500">
              Jada's Recommendation
            </p>
            {/* <h3 className="text-lg font-semibold text-white">Jada</h3> */}
          </div>
        </div>

        <div className="flex-1 min-h-[200px]">
          {(isFetching || isThinking) && (
            <div className="flex items-center gap-2 text-violet-300/80 text-sm">
              <span className="thinking-dot thinking-dot-violet" />
              <span className="thinking-dot thinking-dot-violet animation-delay-200" />
              <span className="thinking-dot thinking-dot-violet animation-delay-400" />
              <span className="text-violet-400/60 ml-1">
                {isFetching ? 'Jada is thinking...' : 'Jada is preparing her recommendation...'}
              </span>
            </div>
          )}

          {(isStreaming || displayedText) && !isThinking && !isFetching && (
            <p className="text-sm leading-7 text-slate-300 whitespace-pre-wrap">
              {displayedText}
              {isStreaming && <span className="stream-cursor stream-cursor-violet" />}
            </p>
          )}

          {!isFetching && !explanation && (
            <p className="text-sm text-slate-600">
              Jada will share field recommendations once the diagnosis is ready.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
