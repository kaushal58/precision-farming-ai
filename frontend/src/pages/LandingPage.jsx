import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, Droplets, Cloud, Bug, ArrowRight,
  CheckCircle, Star, Users, BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Sun, Moon } from 'lucide-react';

const features = [
  { icon: Leaf, title: 'AI Disease Detection', desc: 'CNN-powered leaf analysis with heatmaps and treatment plans' },
  { icon: Bug, title: 'Pest Detection', desc: 'YOLOv8 bounding boxes identify insects and worms instantly' },
  { icon: Droplets, title: 'Smart Irrigation', desc: 'ML predicts water needs from soil moisture and weather' },
  { icon: Cloud, title: 'Weather Intelligence', desc: 'Real-time forecasts with disease-risk weather alerts' },
];

const stats = [
  { value: '50K+', label: 'Acres Monitored' },
  { value: '98%', label: 'Detection Accuracy' },
  { value: '12K+', label: 'Farmers Served' },
  { value: '40%', label: 'Water Saved' },
];

const testimonials = [
  { name: 'Rajesh Patel', role: 'Wheat Farmer, Gujarat', text: 'Detected early blight 2 weeks before it spread. Saved my entire field.', rating: 5 },
  { name: 'Priya Sharma', role: 'Organic Farm, Punjab', text: 'The irrigation AI cut our water usage by 35% while improving yields.', rating: 5 },
  { name: 'Amit Desai', role: 'Cotton Cooperative', text: 'Pest detection with YOLO is incredibly accurate. Game changer for our coop.', rating: 5 },
];

export default function LandingPage() {
  const { theme, toggleTheme } = useThemeStore();
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleContact = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-0 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-lg">AI Crop Guardian</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#stats" className="hover:text-white transition">Impact</a>
            <a href="#testimonials" className="hover:text-white transition">Stories</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link to="/login" className="text-sm hover:text-brand-400 transition hidden sm:block">Sign in</Link>
            <Link to="/register" className="btn-primary !py-2 !px-4 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-20 bg-hero-gradient">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl"
          />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-sm font-medium mb-6">
              Precision Farming Intelligence
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Grow Smarter with{' '}
              <span className="gradient-text">AI-Powered</span> Agriculture
            </h1>
            <p className="mt-6 text-lg text-slate-300 max-w-xl">
              Detect diseases, predict irrigation, track weather risks, and protect your crops —
              all in one premium farming platform built for modern farmers.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary text-white border-white/20">Explore Features</a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-brand-400" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-brand-400" /> 14-day trial</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="glass rounded-3xl p-8 animate-float">
              <motion.div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Farm Health', value: '92%', color: 'text-brand-400' },
                  { label: 'Moisture', value: '45%', color: 'text-blue-400' },
                  { label: 'Disease Risk', value: 'Low', color: 'text-emerald-400' },
                  { label: 'Pest Alerts', value: '0', color: 'text-amber-400' },
                ].map((item, i) => (
                  <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-white/5 rounded-2xl p-4">
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-4 h-32 rounded-xl bg-gradient-to-t from-brand-500/30 to-transparent flex items-end p-4">
                <BarChart3 className="w-full h-20 text-brand-400/50" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Everything You Need to <span className="gradient-text">Farm Smarter</span></h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">Enterprise-grade AI tools designed for real farmers, not demos.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card group"
              >
                <f.icon className="w-10 h-10 text-brand-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl font-bold gradient-text">{s.value}</p>
              <p className="text-slate-400 mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-slate-900/50">
        <motion.div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by <span className="gradient-text">Farmers Worldwide</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card">
                <motion.div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </motion.div>
                <p className="text-slate-300 text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
          <form onSubmit={handleContact} className="glass-card space-y-4">
            <input className="input-field bg-white/5 border-white/10 text-white" placeholder="Name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} required />
            <input className="input-field bg-white/5 border-white/10 text-white" type="email" placeholder="Email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
            <textarea className="input-field bg-white/5 border-white/10 text-white min-h-[120px]" placeholder="Message" value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} required />
            <button type="submit" className="btn-primary w-full">{sent ? 'Message Sent!' : 'Send Message'}</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2026 AI Crop Guardian. Precision Farming Intelligence.</p>
          <motion.div className="flex items-center gap-2 text-slate-400 text-sm">
            <Users className="w-4 h-4" /> 12,000+ farmers
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
