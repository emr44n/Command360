import { GoogleGenAI } from '@google/genai'

export const GEMINI_MODEL = 'gemini-2.0-flash'

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY environment variable is not set')
  return new GoogleGenAI({ apiKey })
}
