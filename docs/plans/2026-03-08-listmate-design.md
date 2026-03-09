# ListMate — Full Platform Design
**Date:** 2026-03-08
**Status:** Approved
**Demo deadline:** 2026-03-12

---

## 1. Product Summary

ListMate is an AI copilot for marketplace sellers (Amazon, Etsy, eBay, Walmart, Shopify) that turns raw product images + seller notes into optimized, marketplace-specific listings with a built-in QA scan and Return Risk Score before publish.

**MVP scope:** Upload → AI generate listing → edit → variant builder → QA report
**Out of scope:** Live marketplace integrations, analytics suite, user auth

---

## 2. Architecture Overview

```
listmate/
├── frontend/          # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── pages/     # One file per screen (5 screens)
│   │   ├── components/# Shared UI components
│   │   ├── api/       # axios calls to backend
│   │   └── store/     # Zustand global state
│   └── vite.config.ts
│
└── backend/           # FastAPI + Python
    ├── main.py
    ├── routes/
    │   ├── generate.py   # POST /api/generate
    │   └── qa.py         # POST /api/qa
    ├── services/
    │   ├── llm.py        # Unified LLMClient abstraction
    │   └── scorer.py     # Rule-based QA scoring
    └── prompts/          # Marketplace-specific prompt files
```

**Data flow:**
```
Upload images + notes + marketplace + model config
     ↓
POST /api/generate  →  LLMClient → Claude / OpenAI (multimodal)
     ↓                    returns structured listing JSON
Listing editor (editable fields)
     ↓
POST /api/qa        →  LLMClient + rule layer
     ↓                    returns risk_score + issues[]
QA Report screen
```

---

## 3. Frontend Structure

### Pages (React Router)
| Route | Page | Source prototype |
|---|---|---|
| `/upload` | UploadPage | `upload_configure/code.html` |
| `/processing` | ProcessingPage | `processing.../code.html` |
| `/listing` | ListingPage | `review_listing/code.html` |
| `/variants` | VariantsPage | `variant_builder/code.html` |
| `/qa` | QAPage | `qa_report/code.html` |

### Global State (Zustand)
```typescript
{
  images: File[],
  notes: string,
  marketplace: string,       // "amazon" | "etsy" | "ebay" | "walmart" | "shopify"
  modelConfig: {
    provider: string,        // "anthropic" | "openai"
    model: string,           // e.g. "claude-sonnet-4-6"
    bestOfN: boolean,        // multi-agent mode toggle
  },
  jobResult: {
    listing: Listing,
    variants: Variant[],
  },
  qaResult: {
    risk_score: number,
    issues: Issue[],
  }
}
```

### Design System
Extracted from HTML prototypes and set in `tailwind.config.js`:
- **Primary accent:** `#1ddd33` (neon green)
- **Background dark:** `#112113` (forest green-black)
- **Background light:** `#f6f8f6`
- **Font:** Inter (300–700)
- **Icons:** Material Symbols Outlined
- Dark mode enabled by default

### Key Libraries
- `react-router-dom` — routing
- `zustand` — state management
- `axios` — API calls
- `react-dropzone` — image upload
- `framer-motion` — processing animation

---

## 4. Backend + API Contract

### POST /api/generate
**Body:** `multipart/form-data`
```
images[]     File[]    Up to 5 product images
notes        string    Raw seller notes
marketplace  string    "amazon" | "etsy" | "ebay" | "walmart" | "shopify"
provider     string    "anthropic" | "openai"
model        string    e.g. "claude-sonnet-4-6"
best_of_n    boolean   Multi-agent mode
```

**Response:**
```json
{
  "listing": {
    "title": "string",
    "bullets": ["string x5"],
    "description": "string",
    "attributes": { "material": "string", "dimensions": "string" }
  },
  "variants": [
    { "size": "string", "color": "string", "sku": "string", "price": "string", "stock": 0 }
  ],
  "model_used": "string",
  "best_of_n_comparison": null
}
```

### POST /api/qa
**Body:** `application/json`
```json
{
  "listing": { "...listing object" },
  "images": ["base64string"],
  "provider": "anthropic",
  "model": "claude-sonnet-4-6"
}
```

**Response:**
```json
{
  "risk_score": 7,
  "issues": [
    { "field": "attributes.dimensions", "type": "missing", "message": "Exact dimensions not specified" },
    { "field": "bullets[2]", "type": "ambiguous", "message": "\"standard size\" is vague — specify measurements" },
    { "field": "title", "type": "mismatch", "message": "Title says 'black' but image shows dark navy" }
  ]
}
```

### QA Scoring Rubric
Start at 10, subtract:
- Missing required field: −1 pt each
- Ambiguous phrase ("standard size", "fits most", "approximately", "about", "roughly"): −0.5 pt each
- Image-text mismatch: −2 pt each
- Floor: 0

---

## 5. LLM Abstraction Layer

```python
# backend/services/llm.py
class LLMClient:
    def __init__(self, provider: str, model: str):
        # routes to Anthropic SDK or OpenAI SDK

    def generate(self, system: str, messages: list, images: list) -> str:
        # unified interface, provider-specific call underneath
        # images encoded as base64 vision blocks (format differs per provider)
        # returns raw text — caller responsible for JSON parsing
```

**Error handling:** `try/except` around all LLM calls. On JSON parse failure, returns a safe mock response so the frontend never crashes during demo.

---

## 6. Model Selector UI

Shown on the Upload screen:

```
Provider:   [ Anthropic ●]  [ OpenAI ]

Model:      claude-sonnet-4-6 ▾  (dropdown per provider)
            Anthropic: claude-opus-4-6 | claude-sonnet-4-6 | claude-haiku-4-5
            OpenAI:    gpt-4.1 | gpt-4.1-mini | o3 | o4-mini

⚡ Best-of-N  [ toggle ]   "Run multiple models, return best output"

Custom Models  [ locked 🔒 ]
  "Amazon-optimized" | "Etsy-optimized"   → "Fine-tuned — launching Q3"
```

---

## 7. Best-of-N (Smoke-and-Mirrors for MVP, Real Foundation)

### What judges see
- Toggle fires "multi-agent mode"
- Side-by-side comparison panel: Model A vs Model B output
- A score per output (keyword density + field completeness)
- Winner highlighted in green

### MVP implementation
- Single Claude `claude-sonnet-4-6` call with **two different system prompts**:
  - Prompt A: keyword-rich, SEO-optimized
  - Prompt B: conversion-focused, benefit-led
- Lightweight scorer compares both on field completeness + title length
- Returns winner + both outputs for comparison UI
- OpenAI path works if `OPENAI_API_KEY` is set in `.env`

### Real foundation
- `LLMClient` abstraction supports any provider
- Parallel call infrastructure ready for true multi-model execution
- Scorer is provider-agnostic

---

## 8. Environment Variables

```bash
# backend/.env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...         # optional — OpenAI toggle disabled if absent
DEFAULT_PROVIDER=anthropic
DEFAULT_MODEL=claude-sonnet-4-6
```

---

## 9. Demo Strategy

- **Golden demo product:** Phone case (clear specs, easy to trigger missing dimensions QA flag)
- **Pre-staged:** Images loaded, notes pre-filled — one click to "Generate"
- **Fallback:** If API is slow, `DEMO_MODE=true` in `.env` returns cached golden response instantly
- **Live wow moment:** Flip Best-of-N toggle, show two outputs, pick the winner on stage

---

## 10. Future Roadmap (narrative for judges)

| Phase | Capability |
|---|---|
| MVP (now) | Single model, Best-of-N smoke-and-mirrors |
| Phase 2 | True parallel multi-model calls, real scoring |
| Phase 3 | Fine-tuned models per marketplace (trained on top-1% listings) |
| Moat | Proprietary training data from top-performing listings — can't be replicated |
