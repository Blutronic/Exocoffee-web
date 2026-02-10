import { useState, useEffect, useRef } from 'react';
import { X, MapPin, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface QuoteFormProps {
  onClose: () => void;
}

// Fix for default marker icon in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// Component to update map center when position changes
function MapUpdater({ position }: { position: [number, number] | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);

  return null;
}

export default function QuoteForm({ onClose }: QuoteFormProps) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [geocodingAddress, setGeocodingAddress] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Default center (you can change this to your business location)
  const businessLocation: [number, number] = [-33.814115120092275, 18.620667236860275]; // Thaba park as example

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shop_name: '',
    shop_address: '',
    machine_type: '',
    machine_model: '',
    service_type: '',
    issue_description: '',
    preferred_date: '',
  });

  const [position, setPosition] = useState<[number, number] | null>(businessLocation);
  const [distance, setDistance] = useState<number | null>(null);

  // Geocode address and update position
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    setGeocodingAddress(true);
    try {
      const response = await fetch(
        `/api/geocode?q=${encodeURIComponent(address)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.lat && data.lon) {
          setPosition([data.lat, data.lon]);
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to geocode address:', error);
      }
    } finally {
      setGeocodingAddress(false);
    }
  };

  // Debounced address input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If it's the address field and we're on step 2, debounce geocoding
    if (name === 'shop_address' && step === 2 && value.trim()) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        geocodeAddress(value);
      }, 1000); // Wait 1 second after user stops typing
    }
  };

  // Calculate distance and reverse geocode when position changes
  useEffect(() => {
    if (position) {
      // Calculate distance from business location (in kilometers)
      const R = 6371; // Earth radius in kilometers
      const dLat = (position[0] - businessLocation[0]) * Math.PI / 180;
      const dLon = (position[1] - businessLocation[1]) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(businessLocation[0] * Math.PI / 180) * Math.cos(position[0] * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const dist = R * c;
      setDistance(Math.round(dist * 10) / 10);

      // Reverse geocode to get address with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const fetchAddress = async () => {
        setFetchingAddress(true);
        try {
          const response = await fetch(
            `/api/reverse-geocode?lat=${position[0]}&lon=${position[1]}`,
            { signal: controller.signal }
          );
          if (response.ok) {
            const data = await response.json();
            if (data.address) {
              setFormData(prev => ({ ...prev, shop_address: data.address }));
            }
          }
        } catch (error) {
          if (error instanceof Error && error.name !== 'AbortError') {
            console.error('Failed to fetch address:', error);
          }
        } finally {
          setFetchingAddress(false);
          clearTimeout(timeoutId);
        }
      };
      fetchAddress();
    }
  }, [position]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) {
      alert('Please pin your shop location on the map');
      return;
    }

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shop_latitude: position[0],
          shop_longitude: position[1],
          travel_distance: distance,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEstimatedCost(data.estimated_cost);
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Failed to submit quote:', error);
      alert('Failed to submit quote. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-4">
            Quote Submitted!
          </h3>
          
          <p className="text-zinc-400 mb-6">
            We've received your request and will contact you within 24 hours to confirm your service appointment.
          </p>

          {estimatedCost && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 mb-6">
              <div className="text-sm text-zinc-500 mb-2">Estimated Cost</div>
              <div className="text-3xl font-bold text-cyan-500">
                {'$' + estimatedCost.toFixed(2)}
              </div>
              <div className="text-xs text-zinc-500 mt-2">
                Includes {distance?.toFixed(1)} km travel
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full my-4 md:my-8 mt-0 md:mt-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white">Get a Free Quote</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-2 p-6 pb-0">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                step >= s ? 'bg-cyan-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Contact & Machine Info */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Shop/Business Name
                  </label>
                  <input
                    type="text"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Machine make/model
                  </label>
                  <input
                    type="text"
                    name="machine_model"
                    value={formData.machine_model}
                    onChange={handleInputChange}
                    placeholder="e.g., La Marzocco Linea PB"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  />  
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Machine Type
                  </label>
                  <select
                    name="machine_type"
                    value={formData.machine_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select type</option>
                    <option value="1-group">1 group</option>
                    <option value="2-group">2 group</option>
                    <option value="3-group">3 group</option>
                    <option value="4-group">4 group</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Service Type
                  </label>
                  <select
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select service type</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="installation">Installation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Preferred Service Date
                  </label>
                  <input
                    type="date"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Describe the Issue *
                </label>
                <textarea
                  name="issue_description"
                  value={formData.issue_description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Tell us what's happening with your espresso machine..."
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors duration-300"
              >
                Continue to Location
              </button>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Shop Address *
                </label>
                <input
                  type="text"
                  name="shop_address"
                  value={formData.shop_address}
                  onChange={handleInputChange}
                  required
                  placeholder={fetchingAddress ? "Fetching address..." : "Uit 3a, Thaba Park, Hooggelegen Rd, Durbanville, Cape Town"}
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:border-amber-500 focus:outline-none transition-colors disabled:opacity-50"
                  disabled={fetchingAddress}
                />
                {geocodingAddress && (
                  <p className="text-xs text-cyan-400 mt-2">Finding location...</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Pin Your Location on Map *
                </label>
                <div className="h-80 rounded-xl overflow-hidden border border-zinc-700">
                  <MapContainer
                    center={position || businessLocation}
                    zoom={13}
                    style={{ height: '100%', width: '100%', cursor: 'pointer' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <LocationMarker position={position} setPosition={setPosition} />
                    <MapUpdater position={position} />
                  </MapContainer>
                </div>
                {distance !== null && (
                  <div className="mt-3 text-sm text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Distance: {distance?.toFixed(1)} km from our location
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  Submit Quote Request
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
