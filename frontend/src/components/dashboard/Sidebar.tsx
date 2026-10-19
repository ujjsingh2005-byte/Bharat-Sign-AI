import {
  Mic,
  Camera,
  Globe2,
  BookOpen,
  ArrowRightLeft,
  LayoutDashboard,
  LogOut,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export type DashboardTab =
  | "all"
  | "voice_to_sign"
  | "semantic_to_sign"
  | "camera_recognition"
  | "live_studio"
  | "dictionary"
  | "research";

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
}

export default function Sidebar({ activeTab, onSelectTab }: SidebarProps) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  const NAV_ITEMS: Array<{
    id: DashboardTab;
    label: string;
    icon: any;
    badge?: string;
    activeBg: string;
    iconColor: string;
  }> = [
    {
      id: "all",
      label: "Studio Overview",
      icon: LayoutDashboard,
      activeBg: "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-600/30",
      iconColor: "text-indigo-400",
    },
    {
      id: "research",
      label: "Research Studio",
      icon: FlaskConical,
      badge: "Paper AI",
      activeBg: "bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-600/30",
      iconColor: "text-amber-400",
    },
    {
      id: "voice_to_sign",
      label: "Voice / Audio → Sign",
      icon: Mic,
      badge: "Mode 1 & 2",
      activeBg: "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-600/30",
      iconColor: "text-blue-400",
    },
    {
      id: "semantic_to_sign",
      label: "Regional Languages (14+)",
      icon: Globe2,
      badge: "Mode 3",
      activeBg: "bg-gradient-to-r from-pink-600 to-rose-600 shadow-pink-600/30",
      iconColor: "text-pink-400",
    },
    {
      id: "camera_recognition",
      label: "Camera Sign Recognition",
      icon: Camera,
      badge: "Mode 4 & 5",
      activeBg: "bg-gradient-to-r from-cyan-600 to-teal-600 shadow-cyan-600/30",
      iconColor: "text-cyan-400",
    },
    {
      id: "live_studio",
      label: "Live 2-Way Studio",
      icon: ArrowRightLeft,
      badge: "Mode 6",
      activeBg: "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-purple-600/30",
      iconColor: "text-purple-400",
    },
    {
      id: "dictionary",
      label: "ISL Dictionary & Learning",
      icon: BookOpen,
      badge: "100+ Signs",
      activeBg: "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/30",
      iconColor: "text-emerald-400",
    },
  ];

  return (
    <aside className="w-72 bg-[#060A18] border-r border-[#1E293B] p-6 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer mb-8 group"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">👑</span>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Bharat Sign AI 3
            </h1>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold group-hover:text-blue-400 transition">
            Universal ISL Ecosystem
          </p>
        </div>

        {/* Navigation items */}
        <div className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition text-left ${
                  isActive
                    ? `${item.activeBg} text-white shadow-lg`
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-white" : item.iconColor} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-md font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-900 text-slate-500 border border-slate-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Info & Logout */}
      <div className="pt-6 border-t border-slate-900 space-y-3">
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-green-400 font-semibold mb-1">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI Translation Core</span>
          </div>
          <span>15 Indian Languages • Three.js Mixamo Rig • MediaPipe Vision</span>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 text-xs font-bold transition"
        >
          <LogOut size={16} />
          <span>Exit Studio</span>
        </button>
      </div>
    </aside>
  );
}
