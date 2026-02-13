
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User } from 'lucide-react';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [status, setStatus] = useState('Disconnected');
    const ws = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Connect to WebSocket
        ws.current = new WebSocket('ws://localhost:8000/ws/chat');

        ws.current.onopen = () => setStatus('Connected');
        ws.current.onclose = () => setStatus('Disconnected');
        ws.current.onmessage = (event) => {
            setMessages(prev => [...prev, { text: event.data, sender: 'Other', time: new Date().toLocaleTimeString() }]);
        };

        return () => {
            if (ws.current) ws.current.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim() && ws.current) {
            ws.current.send(input);
            // Optimistic update (simulating self-message, though backend broadcasts to all including sender usually)
            // For this logic, let's assume backend broadcasts "Doctor says: ..."
            // So we might get double messages if we add here, but let's rely on broadcast for now or handle ID.
            // Actually main.py broadcasts to ALL. So we will receive our own message.
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-blue-600" />
                    <h3 className="font-bold text-slate-700">Doctor Collaboration</h3>
                </div>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${status === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs text-slate-400">{status}</span>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 text-sm mt-10">
                        <p>No messages yet.</p>
                        <p className="text-xs">Start discussing cases with the team.</p>
                    </div>
                )}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.text.startsWith("Doctor says:") ? 'items-start' : 'items-end'}`}>
                        {/* Note: In a real app we'd check sender ID. For now assuming all broadcast messages are 'received' */}
                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-slate-100 max-w-[80%]">
                            <p className="text-sm text-slate-700">{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    disabled={status !== 'Connected'}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors"
                >
                    <Send size={18} />
                </button>
            </form>
        </div >
    );
};

export default ChatPanel;
