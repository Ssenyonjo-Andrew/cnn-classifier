// Disease recommendations and severity information
export interface DiseaseInfo {
  name: string
  pathogen: string
  severity: 'Low' | 'Medium' | 'High'
  description: string
  recommendations: string[]
  actionCodes: string[]
  color: string
}

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  'Common Rust': {
    name: 'Common Rust',
    pathogen: 'Puccinia sorghi',
    severity: 'Medium',
    description: 'Fungal disease causing rust-colored pustules on leaves. Most common in mid to late growing season.',
    recommendations: [
      'Plant resistant varieties',
      'Remove infected plant debris after harvest',
      'Avoid overhead irrigation',
      'Apply fungicide if severity exceeds 5% of leaf area',
      'Scout fields regularly during growing season',
      'Ensure proper crop rotation',
    ],
    actionCodes: ['#1A3C5E', '#2D5A8C'],
    color: 'bg-orange-600',
  },
  'Gray Leaf Spot': {
    name: 'Gray Leaf Spot',
    pathogen: 'Cercospora zeae-maydis',
    severity: 'High',
    description: 'Fungal disease causing rectangular lesions with gray centers. Spreads rapidly in humid conditions.',
    recommendations: [
      'Use resistant hybrid varieties',
      'Reduce inoculum by plowing under crop residue',
      'Increase plant spacing for better air circulation',
      'Avoid excessive nitrogen fertilization',
      'Apply fungicide starting at V6-V8 growth stage if history exists',
      'Monitor weather conditions for high humidity',
      'Implement crop rotation (3+ year minimum)',
    ],
    actionCodes: ['#3B5F8F', '#5A7FAA'],
    color: 'bg-gray-600',
  },
  'Healthy': {
    name: 'Healthy Maize',
    pathogen: 'N/A',
    severity: 'Low',
    description: 'Plant shows no visible signs of disease. Maintain good agronomic practices.',
    recommendations: [
      'Continue regular monitoring',
      'Maintain proper irrigation schedule',
      'Monitor for early signs of disease',
      'Scout fields 1-2 times per week',
      'Keep field records for pest/disease tracking',
      'Optimize nutrient management',
    ],
    actionCodes: ['#2D7D4A', '#4BA563'],
    color: 'bg-green-600',
  },
  'Northern Leaf Blight': {
    name: 'Northern Leaf Blight',
    pathogen: 'Exserohilum turcicum',
    severity: 'High',
    description: 'Fungal disease causing elongated, tan-gray lesions with dark borders. Critical in susceptible hybrids.',
    recommendations: [
      'Plant resistant or tolerant hybrids (Ht1, Ht2, Ht3 genes)',
      'Remove crop debris by plowing or shredding',
      'Apply fungicide at first sign of disease',
      'Spray fungicide if conditions favor disease development',
      'Increase plant spacing to improve air flow',
      'Avoid fields with history of disease for 2+ years',
      'Scout regularly especially during V6-R3 growth stages',
      'Consider seed treatment with fungicide',
    ],
    actionCodes: ['#1B3A5F', '#2D5A8F'],
    color: 'bg-red-700',
  },
}

export function getDiseaseInfo(diseaseName: string): DiseaseInfo {
  return diseaseDatabase[diseaseName] || diseaseDatabase['Healthy']
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Low':
      return 'text-green-500'
    case 'Medium':
      return 'text-yellow-500'
    case 'High':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getSeverityBg(severity: string): string {
  switch (severity) {
    case 'Low':
      return 'bg-green-500/10'
    case 'Medium':
      return 'bg-yellow-500/10'
    case 'High':
      return 'bg-red-500/10'
    default:
      return 'bg-gray-500/10'
  }
}
