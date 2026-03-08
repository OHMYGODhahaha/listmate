import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import HamburgerMenu from '../components/HamburgerMenu'

const CATEGORY_OPTIONS = ['Size', 'Color', 'Material', 'Style', 'Pattern', 'Scent', 'Flavor', 'Custom']

const DEFAULT_TYPES = [
  { id: 1, type: 'Size',  options: ['S', 'M', 'L', 'XL'], price: '' },
  { id: 2, type: 'Color', options: ['Black', 'White'],     price: '' },
]

let nextId = 10

function OptionChip({ value, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
      {value}
      <button onClick={onRemove} className="hover:text-red-400 transition-colors leading-none">×</button>
    </span>
  )
}

export default function VariantsPage() {
  const navigate = useNavigate()
  const { jobResult } = useStore()

  // Seed from store variants if present, otherwise defaults
  const seedTypes = jobResult?.variants?.length
    ? (() => {
        const byType = {}
        jobResult.variants.forEach((v) => {
          if (v.size  && !byType['Size'])  byType['Size']  = { id: nextId++, type: 'Size',  options: [], price: v.price ?? '' }
          if (v.color && !byType['Color']) byType['Color'] = { id: nextId++, type: 'Color', options: [], price: v.price ?? '' }
          if (v.size)  byType['Size'].options.push(v.size)
          if (v.color) byType['Color'].options.push(v.color)
        })
        // Deduplicate options
        Object.values(byType).forEach((t) => { t.options = [...new Set(t.options)] })
        return Object.values(byType)
      })()
    : DEFAULT_TYPES

  const [types, setTypes] = useState(seedTypes)
  const [inputValues, setInputValues] = useState({}) // {id: currentInputText}

  const updateType = (id, field, value) =>
    setTypes((prev) => prev.map((t) => t.id === id ? { ...t, [field]: value } : t))

  const addOption = (id) => {
    const val = (inputValues[id] ?? '').trim()
    if (!val) return
    setTypes((prev) => prev.map((t) =>
      t.id === id && !t.options.includes(val)
        ? { ...t, options: [...t.options, val] }
        : t
    ))
    setInputValues((prev) => ({ ...prev, [id]: '' }))
  }

  const removeOption = (id, opt) =>
    setTypes((prev) => prev.map((t) =>
      t.id === id ? { ...t, options: t.options.filter((o) => o !== opt) } : t
    ))

  const removeType = (id) => setTypes((prev) => prev.filter((t) => t.id !== id))

  const addType = () =>
    setTypes((prev) => [...prev, { id: nextId++, type: 'Size', options: [], price: '' }])

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark border-b border-primary/20 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/listing')} className="p-2 rounded-lg hover:bg-primary/10">
              <span className="material-symbols-outlined text-primary">arrow_back</span>
            </button>
            <h1 className="text-xl font-bold">Manage Variants</h1>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => navigate('/qa')}
              className="px-4 py-2 rounded-lg bg-primary text-background-dark font-bold flex items-center gap-2 hover:opacity-90"
            >
              <span className="material-symbols-outlined text-[20px]">check</span>
              Done
            </button>
            <HamburgerMenu />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4 pb-16">
        <p className="text-sm text-slate-500 dark:text-slate-400 pt-2">
          Add each variant dimension (e.g. Size, Color) and list the available options.
        </p>

        {types.map((t) => (
          <div key={t.id} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            {/* Row 1: category selector + price + delete */}
            <div className="flex items-center gap-3">
              <select
                value={t.type}
                onChange={(e) => updateType(t.id, 'type', e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="flex items-center gap-1 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900 w-32">
                <span className="text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={t.price}
                  onChange={(e) => updateType(t.id, 'price', e.target.value)}
                  placeholder="Price"
                  className="w-full bg-transparent text-sm outline-none focus:ring-0 border-none p-0"
                />
              </div>

              <button
                onClick={() => removeType(t.id)}
                className="text-slate-400 hover:text-red-400 transition-colors p-1"
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>

            {/* Row 2: option chips + add input */}
            <div className="flex flex-wrap items-center gap-2">
              {t.options.map((opt) => (
                <OptionChip key={opt} value={opt} onRemove={() => removeOption(t.id, opt)} />
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={inputValues[t.id] ?? ''}
                  onChange={(e) => setInputValues((prev) => ({ ...prev, [t.id]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && addOption(t.id)}
                  placeholder={`Add ${t.type.toLowerCase()}…`}
                  className="text-sm border border-dashed border-slate-300 dark:border-slate-600 rounded-full px-3 py-1 bg-transparent outline-none focus:border-primary w-36 placeholder:text-slate-400"
                />
                <button
                  onClick={() => addOption(t.id)}
                  className="size-6 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors text-lg leading-none"
                >+</button>
              </div>
            </div>
          </div>
        ))}

        {/* Add variant type */}
        <button
          onClick={addType}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold hover:bg-primary/5 hover:border-primary transition-all"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Add Variant Type
        </button>

        {/* Bulk price */}
        {types.length > 1 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[18px]">auto_fix_high</span>
              Set Same Price for All
            </h3>
            <div className="flex gap-2">
              <input
                id="bulk-price"
                type="number"
                min="0"
                step="0.01"
                placeholder="$ 0.00"
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                onClick={() => {
                  const val = document.getElementById('bulk-price').value
                  if (val) setTypes((prev) => prev.map((t) => ({ ...t, price: val })))
                }}
                className="px-4 py-2 bg-primary/20 text-primary rounded-lg font-bold text-sm hover:bg-primary/30 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
