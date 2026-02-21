import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, Bot, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Disconnected');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Route to Kaggle ngrok URL if set, otherwise use local Vite proxy
        const remoteUrl = import.meta.env.VITE_AI_SERVICE_URL;
        let wsUrl;
        if (remoteUrl) {
            // e.g. https://xxxx.ngrok-free.app -> wss://xxxx.ngrok-free.app/ws/chat
            wsUrl = remoteUrl.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws/chat';
        } else {
            const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            wsUrl = `${proto}//${window.location.host}/ws/chat`;
        }
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => setStatus('Connected');
        ws.current.onclose = () => setStatus('Disconnected');
        ws.current.onmessage = (event) => {
            const text = event.data;
            let sender = 'AI Assistant';
            let content = text;

            if (text.startsWith("Patient: ")) {
                sender = 'You';
                content = text.replace("Patient: ", "");
            } else if (text.startsWith("AI Assistant: ")) {
                sender = 'MedGemma AI';
                content = text.replace("AI Assistant: ", "");
            }

            setMessages(prev => [...prev, { 
                text: content, 
                sender: sender, 
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }]);
        };

        return () => {
            if (ws.current) {
                // Ensure we don't close it prematurely if it's still in the middle of opening
                // and the component is just flickering due to StrictMode in dev
                if (ws.current.readyState === WebSocket.OPEN) {
                    ws.current.close();
                }
            }
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && ws.current) {
            ws.current.send(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0B1220] overflow-hidden transition-all duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-background-dark/40 flex justify-between items-center backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-glow-blue">
                        <Bot size={20} className="animate-pulse-slow" />
                    </div>
                    <div>
                        <h3 className="font-black text-white flex items-center gap-2 text-[10px] uppercase tracking-[0.2em]">
                            Intelligence Consult <Activity size={12} className="text-accent-teal" />
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Connected' ? 'bg-accent-teal shadow-glow-teal' : 'bg-red-500'}`}></div>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{status === 'Connected' ? 'Engine Active' : 'Connecting Engine...'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#05090E]/40 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-10 space-y-4">
                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700 border border-white/10">
                            <MessageSquare size={32} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Consult Loop Ready</h4>
                          <p className="text-[10px] text-slate-500 max-w-[200px] leading-relaxed uppercase tracking-tighter">
                              Ask about findings, differentials, or suggested follow-ups for this patient.
                          </p>
                        </div>
                    </div>
                )}
                
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 15, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-4 ${msg.sender === 'You' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-lg ${msg.sender === 'You' ? 'bg-primary text-white shadow-glow-blue' : 'bg-background-dark text-slate-400'}`}>
                                {msg.sender === 'You' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            
                            <div className={`flex flex-col max-w-[85%] ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-5 rounded-2xl shadow-2xl text-xs leading-relaxed font-medium ${
                                    msg.sender === 'You' 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-md'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[8px] font-black text-slate-500 mt-2 uppercase tracking-widest">{msg.time} • {msg.sender}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-background-dark/80 border-t border-white/5 backdrop-blur-md">
                <form onSubmit={sendMessage} className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Inquire about clinical findings..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || status !== 'Connected'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:scale-105 disabled:opacity-30 text-white w-10 h-10 rounded-xl transition-all shadow-glow-blue active:scale-95 flex items-center justify-center"
                    >
                        <Send size={16} />
                    </button>
                </form>
                <div className="flex items-center gap-2 mt-4 px-2 opacity-50">
                    <AlertCircle size={10} className="text-accent-teal" />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter italic">Engine inference requires clinical validation.</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
