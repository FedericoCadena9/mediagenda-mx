import { GoogleGenerativeAI } from '@google/generative-ai'

const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const configuredModel = import.meta.env.VITE_GEMINI_MODEL?.trim()
const invalidApiKeys = new Set([
  '',
  'your_google_ai_studio_api_key',
  'your_gemini_api_key',
  'your_api_key_here',
])
const apiKey = rawApiKey && !invalidApiKeys.has(rawApiKey.toLowerCase()) ? rawApiKey : ''
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const fallbackModels = ['gemini-2.5-flash', 'gemini-2.0-flash']
const modelCandidates = [...new Set([configuredModel, ...fallbackModels].filter(Boolean))]

function isMissingModelError(error) {
  const message = error?.message ?? ''
  return error?.status === 404 || message.includes('is not found for API version') || message.includes('not supported for generateContent')
}

export async function callGemini(prompt, systemPrompt = '') {
  if (!genAI) {
    throw new Error('NO_API_KEY')
  }

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt

  let lastError = null

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(fullPrompt)
      return result.response.text()
    } catch (error) {
      lastError = error

      if (isMissingModelError(error)) {
        continue
      }

      throw error
    }
  }

  throw lastError
}

/**
 * Send multimodal content (images, audio) to Gemini.
 * @param {Array<string | {inlineData: {mimeType: string, data: string}}>} parts
 * @param {string} systemPrompt - Prepended as first text part
 * @returns {Promise<string>}
 */
export async function callGeminiMultimodal(parts, systemPrompt = '') {
  if (!genAI) {
    throw new Error('NO_API_KEY')
  }

  const contentParts = []
  if (systemPrompt) {
    contentParts.push(systemPrompt)
  }
  contentParts.push(...parts)

  let lastError = null

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })
      const result = await model.generateContent(contentParts)
      return result.response.text()
    } catch (error) {
      lastError = error
      if (isMissingModelError(error)) {
        continue
      }
      throw error
    }
  }

  throw lastError
}
