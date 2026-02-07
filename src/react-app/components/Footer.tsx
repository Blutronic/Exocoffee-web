import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const [settings, setSettings] = useState({
    footer_phone: '(123) 456-7890',
    footer_email: 'info@exocoffee.com',
    footer_address: '123 Service Lane\nYour City, State 12345',
    footer_hours_weekday: 'Mon-Fri: 7am - 6pm',
    footer_hours_saturday: 'Sat: 8am - 4pm',
    footer_hours_sunday: 'Sun: Emergency only',
    social_facebook: 'https://facebook.com',
    social_instagram: 'https://instagram.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  };

  return (
    <footer className="relative border-t border-cyan-900/30 py-16 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img 
                src="https://mocha-cdn.com/019b0efe-e215-7a5a-857c-14f680a4f2b2/Exocoffee-artwork.png" 
                alt="Exocoffee Logo" 
                className="h-10 object-contain"
              />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Professional espresso machine repair and maintenance services. 
              Keeping your coffee business running smoothly since 2009.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-zinc-400 hover:text-cyan-500 transition-colors">Machine Repair</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-cyan-500 transition-colors">Preventive Maintenance</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-cyan-500 transition-colors">Emergency Service</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-cyan-500 transition-colors">Parts & Warranty</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                <Phone className="w-4 h-4" />
                <a href={`tel:${settings.footer_phone.replace(/\D/g, '')}`} className="hover:text-cyan-500 transition-colors">
                  {settings.footer_phone}
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-zinc-400">
                <Mail className="w-4 h-4" />
                <a href={`mailto:${settings.footer_email}`} className="hover:text-cyan-500 transition-colors">
                  {settings.footer_email}
                </a>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{settings.footer_address.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < settings.footer_address.split('\n').length - 1 && <br />}
                  </span>
                ))}</span>
              </li>
            </ul>
          </div>

          {/* Social & Hours */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-3 mb-6 justify-center md:justify-start">
              <a
                href={settings.social_facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 group"
              >
                <Facebook className="w-5 h-5 text-zinc-400 group-hover:text-white" />
              </a>
              <a
                href={settings.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-transparent transition-all duration-300 group"
              >
                <Instagram className="w-5 h-5 text-zinc-400 group-hover:text-white" />
              </a>
            </div>
            <div className="text-sm">
              <h4 className="text-white font-medium mb-2">Business Hours</h4>
              <p className="text-zinc-400">{settings.footer_hours_weekday}</p>
              <p className="text-zinc-400">{settings.footer_hours_saturday}</p>
              <p className="text-zinc-400">{settings.footer_hours_sunday}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Exocoffee. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-zinc-500 hover:text-cyan-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-500 hover:text-cyan-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
