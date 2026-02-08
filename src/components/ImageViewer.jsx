import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

const ImageViewer = ({ imageUrl, scanning }) => {
    const [zoom, setZoom] = useState(1);

    return (
        <div className="h-full w-full bg-slate-50 flex items-center justify-center relative overflow-hidden group">

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white/80 backdrop-blur shadow-lg p-2 rounded-xl flex flex-col gap-2 border border-white/50">
                    <button onClick={() => setZoom(z => z + 0.1)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ZoomIn size={18} /></button>
                    <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><ZoomOut size={18} /></button>
                </div>
            </div>

            {/* Image */}
            <div className="transition-transform duration-300 ease-out p-8" style={{ transform: `scale(${zoom})` }}>
                <img
                    src={imageUrl}
                    className="max-h-full max-w-full rounded-lg shadow-2xl object-contain ring-1 ring-black/5"
                    alt="Scan"
                />
            </div>

            {/* Scanner Simulation */}
            {scanning && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-blue-500/50 blur-md animate-[scan-x_1.5s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-0 bg-blue-500/5"></div>
                </div>
            )}

            <style>{`
        @keyframes scan-x {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default ImageViewer;
