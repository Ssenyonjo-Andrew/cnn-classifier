import axios from 'axios'
import { PredictionResponse, ExplainResponse } from '../types/index'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
})

const uploadApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const predictImage = async (file: File): Promise<PredictionResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await uploadApi.post<PredictionResponse>('/predict', formData)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message
      throw new Error(typeof message === 'string' ? message : 'Prediction failed')
    }
    throw error
  }
}

export const getExplanation = async (
  predictedClass: string,
  confidence: number,
  probabilities: Record<string, number>
): Promise<ExplainResponse> => {
  try {
    const response = await api.post<ExplainResponse>('/explain', {
      predicted_class: predictedClass,
      confidence,
      probabilities,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message
      throw new Error(typeof message === 'string' ? message : 'Explanation failed')
    }
    throw error
  }
}

export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health')
    return response.data.model_loaded
  } catch {
    return false
  }
}

export const getModelInfo = async () => {
  try {
    const response = await api.get('/info')
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch model info')
    }
    throw error
  }
}
