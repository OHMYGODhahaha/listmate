import axios from 'axios'

const BASE = 'http://localhost:8000/api'

export async function generateListing({ images, notes, marketplace, modelConfig }) {
  const form = new FormData()
  images.forEach((img) => form.append('images', img))
  form.append('notes', notes)
  form.append('marketplace', marketplace)
  form.append('provider', modelConfig.provider)
  form.append('model', modelConfig.model)
  form.append('best_of_n', String(modelConfig.bestOfN))

  const { data } = await axios.post(`${BASE}/generate`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
