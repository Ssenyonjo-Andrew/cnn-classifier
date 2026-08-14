import { useEffect, useRef, useState } from 'react'

interface UseStreamingTextOptions {
  thinkingMs?: number
  wordDelayMs?: number
}

export function useStreamingText(
  fullText: string | null,
  enabled: boolean,
  options: UseStreamingTextOptions = {}
) {
  const { thinkingMs = 1200, wordDelayMs = 45 } = options
  const [displayedText, setDisplayedText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const timersRef = useRef<number[]>([])

  const clearTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }

  useEffect(() => {
    clearTimers()
    setDisplayedText('')
    setIsThinking(false)
    setIsStreaming(false)
    setIsComplete(false)

    if (!enabled || !fullText) return

    setIsThinking(true)

    const thinkingTimer = window.setTimeout(() => {
      setIsThinking(false)
      setIsStreaming(true)

      const tokens = fullText.match(/\S+\s*/g) ?? [fullText]
      let index = 0

      const streamNext = () => {
        if (index >= tokens.length) {
          setIsStreaming(false)
          setIsComplete(true)
          return
        }

        const token = tokens[index]
        setDisplayedText((prev) => prev + token)
        index += 1

        const delay = token.trim().length > 8 ? wordDelayMs + 20 : wordDelayMs
        const streamTimer = window.setTimeout(streamNext, delay)
        timersRef.current.push(streamTimer)
      }

      streamNext()
    }, thinkingMs)

    timersRef.current.push(thinkingTimer)

    return clearTimers
  }, [fullText, enabled, thinkingMs, wordDelayMs])

  return { displayedText, isThinking, isStreaming, isComplete }
}
