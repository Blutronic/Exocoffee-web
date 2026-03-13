import { Wrench, Gauge, Droplet, Zap, Clock, Shield, Smile, SmilePlus, PaintRoller, HousePlug, Plug, Stethoscope } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Machine Repair',
    description: 'Expert diagnosis and repair of commercial espresso machine brands and models',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Gauge,
    title: 'Pressure Calibration',
    description: 'Precise pressure and temperature calibration for optimal extraction',
    color: 'from-yellow-400 to-lime-500',
  },
  {
    icon: Droplet,
    title: 'Descaling Service',
    description: 'Professional descaling and cleaning to extend machine lifespan',
    color: 'from-cyan-400 to-teal-500',
  },
  {
    icon: Zap,
    title: 'Preventative Maintenance',
    description: 'Regular maintenance plans to prevent costly breakdowns',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Clock,
    title: 'Emergency Service',
    description: 'Coming soon to minimize downtime for your business',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Smile,
    title: 'Friendly Support',
    description: 'Friendly and knowledgeable support to answer all of your espresso machine questions',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: PaintRoller,
    title: 'Refurbishment',
    description: 'Professional refurbishment services to restore your espresso machine to like-new condition',
    color: 'from-blue-500 to-indigo-500',

  },
  {
    icon: Plug,
    title: 'Upgrades & Modifications',
    description: 'Professional upgrades and modifications to enhance your espresso machine performance',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Stethoscope,
    title: 'Diagnostics & Health Checks',
    description: 'In-depth professional diagnostics and health check to ensure your espresso machine is always running at its best',
    color: 'from-orange-500 to-amber-500',
  },
];

export default function Services() {
  return (
    <div className="relative py-24 px-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Our Services
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Comprehensive espresso machine care from experienced technicians
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-700/50 transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                  }}
                />
                
                <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${service.color} p-3 shadow-lg`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                <h3 className="text-2xl font-bold text-zinc-100 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
