import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import HamburgerMenu from '../components/HamburgerMenu'
import BottomNav from '../components/BottomNav'

const MARKETPLACE_LABELS = {
  amazon: 'Amazon Seller Central',
  etsy: 'Etsy Shop Manager',
  ebay: 'eBay Seller Hub',
  walmart: 'Walmart Seller Center',
  shopify: 'Shopify Admin',
}

const MARKETPLACE_LOGOS = {
  amazon: '/marketplaces/amazon.png',
  etsy: '/marketplaces/etsy.png',
  ebay: '/marketplaces/ebay.png',
  walmart: '/marketplaces/walmart.svg',
  shopify: '/marketplaces/shopify.png',
}

export default function ExportSuccessPage() {
  const navigate = useNavigate()
  const { marketplace, jobResult } = useStore()
  const title = jobResult?.listing?.title ?? 'Your Listing'
  const marketplaceLabel = MARKETPLACE_LABELS[marketplace] ?? 'Seller Account'
  const logo = MARKETPLACE_LOGOS[marketplace]

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="ListMate" className="size-8 rounded-lg" />
          <h1 className="text-xl font-bold tracking-tight">ListMate</h1>
        </div>
        <HamburgerMenu />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 pb-32 max-w-lg mx-auto w-full text-center">
        {/* Success animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
          <div className="relative size-28 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30">
            <span className="material-symbols-outlined text-primary text-6xl">check_circle</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3 tracking-tight">Export Successful!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
          Your listing has been added to drafts in your seller account and is ready to review and publish.
        </p>

        {/* Destination card */}
        <div className="w-full bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8 flex items-center gap-4">
          <div className="size-12 bg-white rounded-xl flex items-center justify-center shrink-0 p-1.5 shadow-sm">
            <img src={logo} alt={marketplaceLabel} className="w-full h-full object-contain" />
          </div>
          <div className="text-left flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-0.5">Sent to</p>
            <p className="font-bold truncate">{marketplaceLabel}</p>
            <p className="text-xs text-slate-400 truncate">{title}</p>
          </div>
          <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
        </div>

        {/* Info note */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-xl p-4 text-left mb-8 flex gap-3">
          <span className="material-symbols-outlined text-slate-400 shrink-0 text-lg mt-0.5">info</span>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            In production, this action uses the marketplace API to create a draft listing directly in your seller account. For this demo, the export is simulated.
          </p>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => navigate('/history')}
            className="w-full bg-primary text-background-dark font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">history</span>
            View Past Listings
          </button>
          <button
            onClick={() => navigate('/upload')}
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-4 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
            Create New Listing
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 px-4 pb-2">
        <BottomNav />
      </div>
    </div>
  )
}
