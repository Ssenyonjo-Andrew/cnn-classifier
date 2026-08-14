export interface PredictionResponse {
  success: boolean
  predicted_class: string
  confidence: number
  probabilities: Record<string, number>
  input_size: [number, number]
}

export interface ExplainResponse {
  success: boolean
  explanation: string
  explanation_source: string
}

export interface PredictionError {
  detail: string
}

export interface ModelInfo {
  model_loaded: boolean
  input_size: [number, number]
  class_names: string[]
  num_classes: number
  model_path: string
}

export interface RecentScan {
  id: string
  imagePreview: string
  predictedClass: string
  filename: string
}
