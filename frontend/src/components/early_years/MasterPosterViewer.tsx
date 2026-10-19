import { useState } from "react";
import { EARLY_YEARS_SIGNS, type EarlyYearsSign } from "../../data/earlyYearsSignsData";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
  Info,
} from "lucide-react";

interface MasterPosterViewerProps {
  onSelectSign: (sign: EarlyYearsSign) => void;
}

export default function MasterPosterViewer({ onSelectSign }: MasterPosterViewerProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const posterPath = "/early_years_signs/early_years_everyday_things_we_do_poster.svg";

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.0, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.75, z - 0.25));
  const handleResetZoom = () => setZoomLevel(1.0);

  return (
    <div className={`space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-slate-950 p-6 overflow-auto" : ""}`}>
      {/* Poster Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-black text-white">
              Primary Reference Chart: "EARLY YEARS - EVERYDAY THINGS WE DO"
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            16 Everyday Actions • Click on any sign box on the poster or in the index below to inspect its detailed verified movement tutorial.
          </p>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold px-2 text-slate-400">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen</span>
              </>
            )}
          </button>

          {/* Download Raw Poster */}
          <a
            href={posterPath}
            download="early_years_everyday_things_we_do_poster.svg"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save SVG Poster</span>
          </a>
        </div>
      </div>

      {/* Main Scalable Poster Canvas */}
      <div className="relative w-full rounded-3xl bg-slate-950 border border-slate-800 p-4 md:p-6 shadow-2xl overflow-auto flex justify-center items-center">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center" }}
          className="transition-transform duration-300 max-w-full"
        >
          <img
            src={posterPath}
            alt="EARLY YEARS - EVERYDAY THINGS WE DO Reference Poster"
            className="rounded-2xl shadow-2xl border border-slate-800 max-w-none w-[1240px]"
          />
        </div>
      </div>

      {/* Quick 16 Sign Hotspot Bar */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-black text-white">Click any sign to open its interactive tutorial:</h4>
          </div>
          <span className="text-xs text-slate-400 font-semibold">16 Signs Total</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {EARLY_YEARS_SIGNS.map((sign) => (
            <button
              key={sign.id}
              onClick={() => onSelectSign(sign)}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-950/80 hover:bg-indigo-600/20 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group cursor-pointer"
            >
              <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-400 font-black text-[10px] flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                {sign.order}
              </span>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                  {sign.word}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{sign.hindi}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
