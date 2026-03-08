import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api'

// Map custom display models to real backend provider/model
const CUSTOM_MODEL_MAP = {
  'custom-gpt5':   { provider: 'openai',    model: 'gpt-4.1' },
  'custom-gemma3': { provider: 'anthropic', model: 'claude-sonnet-4-6' },
}

function resolveModel(modelConfig) {
  if (modelConfig.provider === 'custom') {
    return CUSTOM_MODEL_MAP[modelConfig.model] ?? { provider: 'anthropic', model: 'claude-sonnet-4-6' }
  }
  return modelConfig
}

export async function generateListing({ images, notes, marketplace, modelConfig, apiKeys = {} }) {
  const { provider, model } = resolveModel(modelConfig)
  const form = new FormData()
  images.forEach((img) => form.append('images', img))
  form.append('notes', notes)
  form.append('marketplace', marketplace)
  form.append('provider', provider)
  form.append('model', model)
  form.append('best_of_n', String(modelConfig.bestOfN))
  if (apiKeys.anthropic) form.append('anthropic_api_key', apiKeys.anthropic)
  if (apiKeys.openai)    form.append('openai_api_key', apiKeys.openai)

  const { data } = await axios.post(`${BASE}/generate`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
