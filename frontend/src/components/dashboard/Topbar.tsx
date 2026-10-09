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
    <header className="border-b border-[#263653] h-20 flex items-center justify-between px-8 bg-[#0B1020] sticky top-0 z-30 shadow-md">
      <div>
        <h2 className="text-xl font-extrabold text-[#F8FAFC] flex items-center gap-2">
          <span>Bharat Sign AI Studio</span>
          <span className="text-[10px] bg-indigo-600/20 text-[#A5B4FC] border border-indigo-500/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            v3.0 Master
          </span>
        </h2>
        <p className="text-xs text-[#A5B4FC]">
          Welcome {user?.name || "User"} • Bridging Spoken Indian Languages & ISL
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-[#251840] border border-[#7C3AED] px-3.5 py-1.5 rounded-xl text-xs text-[#C4B5FD]">
          <Sparkles size={14} className="text-[#C4B5FD]" />
          <span>Universal Semantic AI Layer</span>
        </div>

        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition ${
            backendOnline
              ? "bg-[#10352B] border-[#059669] text-[#34D399]"
              : "bg-[#3A2A12] border-[#D97706] text-[#FCD34D]"
          }`}
        >
          <Radio size={14} className={backendOnline ? "animate-pulse" : ""} />
          <span>{backendOnline ? "Backend AI Online" : "AI Connecting"}</span>
        </div>
      </div>
    </header>
  );
}
