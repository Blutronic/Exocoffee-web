import { useState, useEffect } from 'react';
import Hero from '@/react-app/components/Hero';
import Services from '@/react-app/components/Services';
import Gallery from '@/react-app/components/Gallery';
import QuoteForm from '@/react-app/components/QuoteForm';
import AdminGallery from '@/react-app/components/AdminGallery';
import AdminSettings from '@/react-app/components/AdminSettings';
import Footer from '@/react-app/components/Footer';
import HexagonalBackground from '@/react-app/components/HexagonalBackground';
import { Settings } from 'lucide-react';

export default function Home() {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showAdminGallery, setShowAdminGallery] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);

  // Admin access - press Ctrl+Shift+A
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminGallery(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen relative">
      <HexagonalBackground />
      <div className="relative z-10">
        {/* Admin button (hidden, access via Ctrl+Shift+A) */}
        <button
          onClick={() => setShowAdminGallery(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center opacity-20 hover:opacity-100 transition-opacity z-40"
          title="Press Ctrl+Shift+A to manage gallery"
        >
          <Settings className="w-5 h-5 text-zinc-400" />
        </button>

        <Hero onGetQuote={() => setShowQuoteForm(true)} />
        <Services />
        <Gallery />
        <Footer />
        {showQuoteForm && <QuoteForm onClose={() => setShowQuoteForm(false)} />}
        {showAdminGallery && (
          <AdminGallery 
            onClose={() => setShowAdminGallery(false)} 
            onOpenSettings={() => {
              setShowAdminGallery(false);
              setShowAdminSettings(true);
            }}
          />
        )}
        {showAdminSettings && <AdminSettings onClose={() => setShowAdminSettings(false)} />}
      </div>
    </div>
  );
}
