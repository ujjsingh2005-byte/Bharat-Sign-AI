import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = ["Home", "Voice → Sign", "Sign → Text", "About"];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        {/* Logo */}

        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-blue-500 blur-xl opacity-60 animate-pulse"></div>

            <div
              className="
      relative
      flex
      h-14
      w-14
      items-center
      justify-center
      rounded-2xl
      bg-gradient-to-br
      from-blue-500
      to-indigo-600
      border
      border-blue-400
    "
            >
              <Crown size={30} className="text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-xl font-bold">Bharat-Sign AI</h1>

            <p className="text-xs text-slate-400">AI Communication Platform</p>
          </div>
        </div>

        {/* Desktop Menu */}

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((item) => (
            <a
              key={item}
              href="#"
              className="text-slate-300 transition hover:text-blue-400"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Buttons */}

        <div className="hidden lg:flex gap-4">
          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-5 py-2 hover:bg-slate-800 transition"
          >
            Login
          </Link>

          <button className="rounded-xl bg-blue-600 px-5 py-2 hover:bg-blue-700">
            Get Started
          </button>
        </div>

        {/* Mobile */}

        <button className="lg:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}

      {open && (
        <div className="border-t border-slate-800 bg-slate-900 lg:hidden">
          {links.map((item) => (
            <a
              key={item}
              href="#"
              className="block px-8 py-4 text-slate-300 hover:bg-slate-800"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
