import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Radio } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function Topbar() {
  const [backendOnline, setBackendOnline] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || '{"name": "Explorer"}');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await axios.get(`${API}/`, { timeout: 3000 });
        if (res.data) {
          setBackendOnline(true);
        }
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="border-b border-slate-800 h-20 flex items-center justify-between px-8 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
          <span>Bharat Sign AI Studio</span>
          <span className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
            v3.0 Master
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Welcome {user?.name || "User"} • Bridging Spoken Indian Languages & ISL
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl text-xs text-slate-300">
          <Sparkles size={14} className="text-purple-400" />
          <span>Universal Semantic AI Layer</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
            backendOnline
              ? "bg-green-950/60 border-green-800 text-green-400"
              : "bg-yellow-950/60 border-yellow-800 text-yellow-400"
          }`}
        >
          <Radio size={14} className={backendOnline ? "animate-pulse" : ""} />
          <span>{backendOnline ? "Backend AI Online" : "AI Connecting"}</span>
        </div>
      </div>
    </header>
  );
}
