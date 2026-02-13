
import React, { useState } from 'react';
import { User, Shield } from 'lucide-react';

const LoginModal = ({ onLogin }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-blue-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Medical Access Portal</h2>
                    <p className="text-slate-500 text-sm mt-2">Authorized Personnel Only</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => onLogin("uploader")}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 group"
                    >
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-200 text-slate-600 group-hover:text-blue-700">
                            <User size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700">Attending Physician</div>
                            <div className="text-xs text-slate-400">Upload & AI Analysis</div>
                        </div>
                    </button>

                    <button
                        onClick={() => onLogin("reviewer")}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-purple-500 hover:bg-purple-50 transition-all flex items-center gap-4 group"
                    >
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-200 text-slate-600 group-hover:text-purple-700">
                            <Shield size={20} />
                        </div>
                        <div>
                            <div className="font-bold text-slate-700">Reviewing Specialist</div>
                            <div className="text-xs text-slate-400">verify cases & collaborate</div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
