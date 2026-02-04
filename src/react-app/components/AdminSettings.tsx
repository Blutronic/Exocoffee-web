import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface AdminSettingsProps {
  onClose: () => void;
}

export default function AdminSettings({ onClose }: AdminSettingsProps) {
  const [activeTab, setActiveTab] = useState<'statistics' | 'info'>('statistics');
  const [settings, setSettings] = useState({
    years_experience: '',
    machines_serviced: '',
    emergency_support: '',
    footer_phone: '',
    footer_email: '',
    footer_address: '',
    footer_hours_weekday: '',
    footer_hours_saturday: '',
    footer_hours_sunday: '',
    social_facebook: '',
    social_instagram: '',
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 flex-shrink-0">
          <h2 className="text-2xl font-bold text-white">Business Settings</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-800 px-6 flex-shrink-0">
          <button
            onClick={() => setActiveTab('statistics')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'statistics'
                ? 'text-cyan-500 border-cyan-500'
                : 'text-zinc-400 border-transparent hover:text-zinc-300'
            }`}
          >
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'text-cyan-500 border-cyan-500'
                : 'text-zinc-400 border-transparent hover:text-zinc-300'
            }`}
          >
            Business Info
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'statistics' ? (
            <div className="space-y-6">
              <p className="text-zinc-400 text-sm">
                Update the statistics displayed in the hero section of your website.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={settings.years_experience}
                    onChange={(e) => setSettings({ ...settings, years_experience: e.target.value })}
                    placeholder="e.g., 15+"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Examples: "15+", "20", "Over 25"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Machines Serviced
                  </label>
                  <input
                    type="text"
                    value={settings.machines_serviced}
                    onChange={(e) => setSettings({ ...settings, machines_serviced: e.target.value })}
                    placeholder="e.g., 500+"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Examples: "500+", "1,000+", "Over 2000"
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Emergency Support
                  </label>
                  <input
                    type="text"
                    value={settings.emergency_support}
                    onChange={(e) => setSettings({ ...settings, emergency_support: e.target.value })}
                    placeholder="e.g., 24/7"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Examples: "24/7", "Same Day", "1 Hour Response"
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Contact Section */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Update your business contact details displayed in the footer.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.footer_phone}
                      onChange={(e) => setSettings({ ...settings, footer_phone: e.target.value })}
                      placeholder="e.g., (123) 456-7890"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.footer_email}
                      onChange={(e) => setSettings({ ...settings, footer_email: e.target.value })}
                      placeholder="e.g., info@exocoffee.com"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Business Address
                    </label>
                    <textarea
                      value={settings.footer_address}
                      onChange={(e) => setSettings({ ...settings, footer_address: e.target.value })}
                      placeholder="e.g., 123 Service Lane&#10;Your City, State 12345"
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="border-t border-zinc-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Social Media</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Update your social media profile links.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.social_facebook}
                      onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                      placeholder="e.g., https://facebook.com/yourpage"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settings.social_instagram}
                      onChange={(e) => setSettings({ ...settings, social_instagram: e.target.value })}
                      placeholder="e.g., https://instagram.com/yourprofile"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Business Hours Section */}
              <div className="border-t border-zinc-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Set your operating hours displayed in the footer.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Weekday Hours
                    </label>
                    <input
                      type="text"
                      value={settings.footer_hours_weekday}
                      onChange={(e) => setSettings({ ...settings, footer_hours_weekday: e.target.value })}
                      placeholder="e.g., Mon-Fri: 7am - 6pm"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Saturday Hours
                    </label>
                    <input
                      type="text"
                      value={settings.footer_hours_saturday}
                      onChange={(e) => setSettings({ ...settings, footer_hours_saturday: e.target.value })}
                      placeholder="e.g., Sat: 8am - 4pm"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Sunday Hours
                    </label>
                    <input
                      type="text"
                      value={settings.footer_hours_sunday}
                      onChange={(e) => setSettings({ ...settings, footer_hours_sunday: e.target.value })}
                      placeholder="e.g., Sun: Emergency only"
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-6 border-t border-zinc-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
