import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000/api'

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

export async function runQA({ listing, images, modelConfig, apiKeys = {} }) {
  const { provider, model } = resolveModel(modelConfig)
  const imageB64 = await Promise.all(
    images.map((img) =>
      new Promise((res) => {
        const reader = new FileReader()
        reader.onload = () => res(reader.result.split(',')[1])
        reader.readAsDataURL(img)
      })
    )
  )
  const { data } = await axios.post(`${BASE}/qa`, {
    listing,
    images: imageB64,
    provider,
    model,
    ...(apiKeys.anthropic && { anthropic_api_key: apiKeys.anthropic }),
    ...(apiKeys.openai    && { openai_api_key:    apiKeys.openai }),
  })
  return data
}
