import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AIAssistant() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm TexTrade AI. I can help you find fabrics, compare products, and answer questions. What are you looking for today?" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await aiAPI.chat({
        message: text.trim(),
        userProfile: user?.buyerProfile,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      setRecommendations(data.recommendations || []);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-elevated transition hover:bg-brand-700 hover:scale-105"
        aria-label="Open AI Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-elevated sm:w-[400px]">
      <div className="flex items-center justify-between bg-gradient-to-r from-brand-600 to-brand-700 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <div>
            <p className="text-sm font-semibold">TexTrade AI</p>
            <p className="text-xs text-brand-100">Fabric discovery assistant</p>
          </div>
        </div>
        <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-white/10">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex max-h-80 flex-1 flex-col overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-br-md'
                : 'bg-slate-100 text-slate-800 rounded-bl-md'
            }`}>
              {msg.content.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-1' : ''}>{line.replace(/\*\*/g, '')}</p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3.5 py-2.5 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
            </div>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="mb-3 space-y-2">
            <p className="text-xs font-medium text-slate-500">Recommended for you</p>
            {recommendations.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-2 transition hover:bg-slate-50"
              >
                <img src={p.images?.[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-brand-600">${p.price}/{p.unit}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about fabrics..."
            className="input-field flex-1 py-2 text-sm"
          />
          <button
            onClick={toggleVoice}
            className={`rounded-xl p-2.5 transition ${listening ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            title="Voice input"
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} className="btn-primary px-3 py-2">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {['Recommend cotton fabrics', 'Compare silk options', 'Budget-friendly fabrics'].map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
