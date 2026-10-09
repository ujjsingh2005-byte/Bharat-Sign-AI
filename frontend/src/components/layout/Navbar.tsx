import { useState } from "react";
import { Menu, X, Crown, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "../common/ThemeSwitcher";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Master Studio", path: "/dashboard" },
    { name: "ISL Learning", path: "/dashboard" },
    { name: "Research Studio", path: "/dashboard" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500 blur-lg opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 border border-indigo-400 shadow-md">
              <Crown size={24} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-lg font-black bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Bharat Sign AI
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
              ISL Communication Platform
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-7 lg:flex text-xs font-semibold">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-slate-300 transition hover:text-indigo-400"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Controls: Theme Switcher & Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeSwitcher />

          <Link
            to="/login"
            className="rounded-xl border border-slate-700/80 bg-slate-900/60 text-slate-200 text-xs font-bold px-4 py-2 hover:bg-slate-800 transition"
          >
            Sign In
          </Link>

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold px-4 py-2 transition shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <span>Open Studio</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Menu Toggle & Theme Switcher */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeSwitcher />
          <button
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 p-6 space-y-4 lg:hidden animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2 text-sm font-semibold">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-slate-200 hover:bg-slate-900"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-900 flex flex-col gap-2">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="w-full text-center rounded-xl border border-slate-800 py-2.5 text-xs font-bold text-slate-300"
            >
              Sign In
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/dashboard");
              }}
              className="w-full text-center rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30"
            >
              Open Studio
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
