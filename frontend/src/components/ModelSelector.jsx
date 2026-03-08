import useStore from '../store/useStore'

const MODELS = {
  anthropic: ['claude-opus-4-6', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
  openai:    ['gpt-4.1', 'gpt-4.1-mini', 'o3', 'o4-mini'],
  custom:    ['custom-gpt5', 'custom-gemma3'],
}

// Display names for custom models shown in the dropdown
const CUSTOM_DISPLAY = {
  'custom-gpt5':   'Fine-tuned GPT 5 ✦',
  'custom-gemma3': 'Post-trained Gemma 3 ✦',
}

const PROVIDERS = [
  { id: 'anthropic', label: 'Anthropic' },
  { id: 'openai',    label: 'OpenAI' },
  { id: 'custom',    label: 'Custom ✦' },
]

export default function ModelSelector() {
  const { modelConfig, setModelConfig } = useStore()

  const switchProvider = (provider) => {
    setModelConfig({ provider, model: MODELS[provider][0] })
  }

  const modelOptions = MODELS[modelConfig.provider] ?? []

  return (
    <div className="space-y-3">
      {/* Provider toggle */}
      <div className="flex gap-2">
        {PROVIDERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => switchProvider(id)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              modelConfig.provider === id
                ? 'bg-primary text-background-dark'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Model dropdown */}
      <select
        value={modelConfig.model}
        onChange={(e) => setModelConfig({ model: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        {modelOptions.map((m) => (
          <option key={m} value={m}>
            {CUSTOM_DISPLAY[m] ?? m}
          </option>
        ))}
      </select>

      {/* Custom model hint */}
      {modelConfig.provider === 'custom' && (
        <p className="text-xs text-primary/70 px-1">
          ✦ Proprietary fine-tunes — optimised for marketplace listing generation
        </p>
      )}

      {/* Best-of-N toggle */}
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-3">
        <div>
          <p className="text-sm font-bold text-white">⚡ Best-of-N</p>
          <p className="text-xs text-slate-400">Run multiple prompts, return best output</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={modelConfig.bestOfN}
            onChange={(e) => setModelConfig({ bestOfN: e.target.checked })}
          />
          <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>
    </div>
  )
}
