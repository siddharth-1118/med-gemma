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
        <div className="flex flex-col h-full bg-white dark:bg-[#0B1220] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#121A2F]/50 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                        <Bot size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5 text-sm uppercase tracking-wider">
                            AI Health Assistant <Activity size={14} className="text-amber-400" />
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{status === 'Connected' ? 'Online & Ready' : 'Connecting...'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 dark:bg-[#05090E]/30 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center px-10">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 opacity-20">
                            <MessageSquare size={32} />
                        </div>
                        <h4 className="text-slate-700 dark:text-slate-300 font-bold mb-2">How can I help you today?</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] leading-relaxed">
                            Ask me about your medical scan or any symptoms you're experiencing.
                        </p>
                    </div>
                )}
                
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-3 ${msg.sender === 'You' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-800 shadow-sm ${msg.sender === 'You' ? 'bg-[#1F4FD8] text-white' : 'bg-[#2EC4B6] text-white'}`}>
                                {msg.sender === 'You' ? <User size={14} /> : <Bot size={14} />}
                            </div>
                            
                            <div className={`flex flex-col max-w-[80%] ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                                    msg.sender === 'You' 
                                    ? 'bg-[#1F4FD8] text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-[#121A2F] text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <span className="text-[9px] font-black text-slate-400 mt-1 uppercase tracking-widest">{msg.time} • {msg.sender}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white dark:bg-[#0B1220] border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={sendMessage} className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask your health question..."
                        className="w-full bg-slate-50 dark:bg-[#121A2F] border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-14 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-inner"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || status !== 'Connected'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:opacity-30 text-white p-2.5 rounded-lg transition-all shadow-lg active:scale-95 flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="flex items-center gap-2 mt-3 px-2">
                    <AlertCircle size={10} className="text-amber-500" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">AI Assistant guidance should be verified by a professional.</span>
                </div>
            </div>
        </div >
    );
};

export default ChatPanel;
