import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

export async function callGemini(prompt, systemPrompt = '') {
  if (!apiKey) {
    throw new Error('NO_API_KEY')
  }
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  const result = await model.generateContent(fullPrompt)
  return result.response.text()
}
