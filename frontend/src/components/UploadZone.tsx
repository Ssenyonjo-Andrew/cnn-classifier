import { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  isLoading: boolean
  disabled?: boolean
}

export const UploadZone = ({ onFileSelect, isLoading, disabled = false }: UploadZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !isLoading) {
      setIsDragActive(e.type === 'dragenter' || e.type === 'dragover')
    }
  }

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload JPG, PNG, GIF, or WebP.')
      return false
    }

    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.')
      return false
    }

    setError(null)
    return true
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (disabled || isLoading) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border border-dashed rounded-xl p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragActive
            ? 'border-emerald-500 bg-emerald-500/5'
            : 'border-emerald-800/50 hover:border-emerald-600/50 bg-[#0c1310]'
          }
          ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          onChange={handleChange}
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled || isLoading}
        />

        <Upload
          className={`mx-auto mb-3 ${isLoading ? 'animate-pulse text-emerald-400' : 'text-emerald-500/70'}`}
          size={28}
        />

        <p className="text-sm text-slate-300 font-medium mb-1">
          {isLoading ? 'Analysing leaf...' : 'Drop a leaf image'}
        </p>
        <p className="text-xs text-slate-500">or browse files</p>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </div>
  )
}
