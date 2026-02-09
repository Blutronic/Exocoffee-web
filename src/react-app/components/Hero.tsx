import { useState, useEffect } from 'react';
import { Wrench, Phone } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
}

export default function Hero({ onGetQuote }: HeroProps) {
  const [settings, setSettings] = useState({
    years_experience: '15+',
    machines_serviced: '500+',
    emergency_support: '24/7',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-start justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-0 pb-24 text-center -mt-[50px]">
        {/* Logo */}
        <div className="mb-8 flex justify-center pt-0 relative">
          <img 
            src="/images/Exocoffee artwork.png" 
            alt="Exocoffee Logo" 
            className="h-[12rem] md:h-[20rem] object-contain rounded-[200px] border-[50px] border-black/50"
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 items-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full backdrop-blur-sm min-w-[20rem] md:min-w-fit">
            <span className="text-cyan-100 font-medium">Professional Espresso Machine Care</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
          Precision Service
          <br />
          Perfect Espresso
        </h1>

        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Expert repair and maintenance for commercial espresso machines.
          Fast response, quality parts, and professional service you can trust.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onGetQuote}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Get Free Quote
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          <a
            href="tel:+1234567890"
            className="px-8 py-4 bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 font-semibold rounded-xl backdrop-blur-sm hover:bg-zinc-800 hover:border-zinc-600 transition-all duration-300 flex items-center gap-2"
          >
            <Phone className="w-5 h-5" />
            Call Us Now
          </a>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-500 mb-2">{settings.years_experience}</div>
            <div className="text-sm text-zinc-500">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-500 mb-2">{settings.machines_serviced}</div>
            <div className="text-sm text-zinc-500">Machines Serviced</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan-500 mb-2">{settings.emergency_support}</div>
            <div className="text-sm text-zinc-500">Emergency Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
