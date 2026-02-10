import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Scan, Target } from 'lucide-react';

const ImageViewer = ({ imageUrl, scanning }) => {
    const [zoom, setZoom] = useState(1);
    const [scanLine, setScanLine] = useState(0);

    // Reset zoom when image changes
    useEffect(() => {
        setZoom(1);
    }, [imageUrl]);

    return (
        <div className="h-full w-full bg-slate-50/50 flex items-center justify-center relative overflow-hidden group">

            {/* Grid Overlay for "Engineering" look */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/80 backdrop-blur-md shadow-lg p-1.5 rounded-xl flex flex-col gap-1 border border-white/50">
                    <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ZoomIn size={16} /></button>
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"><ZoomOut size={16} /></button>
                </div>
            </div>

            {/* Image Container */}
            <div className="relative z-10 transition-transform duration-500 ease-out p-8" style={{ transform: `scale(${zoom})` }}>
                <img
                    src={imageUrl}
                    className="max-h-[80vh] max-w-full rounded-lg shadow-2xl object-contain ring-1 ring-black/5"
                    alt="Scan"
                />

                {/* Scanning Overlay */}
                {scanning && (
                    <div className="absolute inset-0 rounded-lg overflow-hidden z-20">
                        {/* Moving Scan Beam */}
                        <div className="absolute top-0 bottom-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-[scan-y_2s_ease-in-out_infinite]"></div>

                        {/* HUD Elements */}
                        <div className="absolute top-4 left-4 text-[10px] font-mono text-blue-500 font-bold bg-blue-50/90 px-2 py-1 rounded border border-blue-200 animate-pulse">
                            ANALYSIS_MODE: ACTIVE
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-mono text-blue-500 font-bold bg-blue-50/90 px-2 py-1 rounded border border-blue-200">
                            <Target size={12} className="animate-spin" />
                            DETECTING_ANOMALIES...
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes scan-y {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default ImageViewer;
