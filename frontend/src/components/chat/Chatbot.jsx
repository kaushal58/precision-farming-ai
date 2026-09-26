import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff } from 'lucide-react';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'gu', label: 'ગુજરાતી' },
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your AI farming assistant. Ask me about crops, diseases, irrigation, or fertilizers.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const [listening, setListening] = useState(false);
  const bottomRef = useRef(null);
  const { user } = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await api.post('/chat/message', { message: msg, language: lang });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I could not process that. Please try again.' }]);
    }
    setLoading(false);
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'gu' ? 'gu-IN' : 'en-US';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => setInput(e.results[0][0].transcript);
    rec.start();
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[380px] max-w-[calc(100vw-3rem)] h-[500px] glass rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <motion.div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-brand-600/10 to-transparent">
              <div>
                <p className="font-semibold">AI Farming Assistant</p>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="text-xs mt-1 bg-transparent border-none outline-none text-slate-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
              <button type="button" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
            </motion.div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${
                      m.role === 'user'
                        ? 'bg-brand-500 text-white rounded-br-md'
                        : 'glass rounded-bl-md'
                    }`}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-1 px-4">
                  <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.1s]" />
                  <span className="w-2 h-2 bg-brand-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-2">
              <button type="button" onClick={startVoice} className={`p-2 rounded-xl ${listening ? 'bg-red-500/20 text-red-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about farming..."
                className="flex-1 input-field py-2 text-sm"
              />
              <button type="button" onClick={send} disabled={loading} className="btn-primary !px-4 !py-2">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-brand-600 to-emerald-500 text-white shadow-lg shadow-brand-500/40 z-50 flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </>
  );
}
