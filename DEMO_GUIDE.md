# ListMate — Demo Guide (March 12, 2026)

## Quick Start (2 steps)

### Step 1: Add your API key

Edit `backend/.env` and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-api03-...your-real-key...
DEMO_MODE=false
```

### Step 2: Start everything

```bash
./start.sh
```

Then open **http://localhost:5173**

---

## Demo Flow (5 screens, ~2 minutes)

| Screen | URL | What to show |
|--------|-----|--------------|
| Upload | `/upload` | Drop 3 product photos + type raw notes. Select Amazon. Toggle **Best-of-N** for the AI narrative. |
| Processing | `/processing` | Animated 4-step pipeline — "ListMate is doing the work" |
| Generated Listing | `/listing` | Editable title, bullets, description, attributes. Click **Regenerate** on a field. Show **Variants** toggle. |
| Variant Builder | `/variants` | Size × Color matrix with price + stock. Bulk update. |
| QA Report | `/qa` | Risk score gauge (0–10 dial). Issue list with **Fix it** buttons. Publish locked ("Coming Soon"). |

---

## Model Selector Story

On the Upload screen, open the **Model** panel (top right gear area) to show:
- **Provider**: Anthropic vs OpenAI
- **Model**: `claude-sonnet-4-6`, `claude-opus-4-6`, `claude-haiku-4-5`
- **Best-of-N**: Runs two optimized prompts (keyword-SEO vs conversion-focused), scores each for completeness, returns the winner. Shown as `best_of_n_comparison` in the API response.

Narrative: _"We can fine-tune separate specialists — one for Amazon SEO, one for conversion copy — and let them compete. Best output wins."_

---

## If API is slow or unavailable on demo day

Set `DEMO_MODE=true` in `backend/.env` and restart.
The app will return polished demo data instantly — no API calls made.

---

## Golden Demo Product (recommended)

Use a **brown leather jacket** for maximum visual impact:
1. Take 3 clear photos: front, back, detail (label/texture)
2. Drop them in `backend/demo_assets/` for quick re-upload
3. Seller notes: _"Vintage brown leather jacket, size M, genuine cowhide, brass zippers, small scuff on left cuff, dry clean only"_

Expected AI output highlights:
- Title: `Vintage Brown Leather Jacket — Genuine Cowhide, Size M`
- QA will flag `missing: exact dimensions` (chest/sleeve) — demonstrates Fix-it flow

---

## Architecture Cheat Sheet (for Q&A)

```
Frontend (React 19 + Vite + Tailwind)
  └── 5 pages via React Router v7
  └── Zustand global state (images, listing, qaResult)
  └── Axios → FastAPI (:8000)

Backend (FastAPI + Python 3.13)
  └── /api/generate → LLMClient → Anthropic / OpenAI
  └── /api/qa      → rule-based scorer + LLM scorer → merged risk score
  └── Best-of-N: 2 system prompts compete, completeness scorer picks winner
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `address already in use :8000` | `lsof -ti:8000 \| xargs kill -9` |
| `address already in use :5173` | `lsof -ti:5173 \| xargs kill -9` |
| Listing page shows empty title | Check Zustand store — `jobResult` should be set by ProcessingPage |
| QA page shows 10/10 no issues | Backend `DEMO_MODE=true` returns a fully-populated listing; set it to `false` |
| CORS error in browser | Ensure backend is on `:8000` and frontend on `:5173` |
