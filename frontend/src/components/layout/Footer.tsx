import { Crown, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400">
              <Crown size={20} className="text-white" />
            </div>
            <span className="text-lg font-black text-white">Bharat Sign AI</span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-powered Indian Sign Language platform bridging speech, regional languages, and 3D avatar animations for a more inclusive digital ecosystem.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://github.com/ujjsingh2005-byte/Bharat-Sign-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              aria-label="GitHub Repository"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Platform Navigation
          </h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-indigo-400 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-indigo-400 transition">
                Master Studio
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-indigo-400 transition">
                ISL Learning & Dictionary
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-indigo-400 transition">
                Research & Benchmarks
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Accessibility & Trust */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Accessibility & Ethics
          </h3>
          <ul className="space-y-2 text-xs">
            <li className="text-slate-400">WCAG 2.2 AA Standards</li>
            <li className="text-slate-400">7 Color Palette System</li>
            <li className="text-slate-400">Contextual Disambiguation</li>
            <li className="text-slate-400">Transparent Error Recovery</li>
          </ul>
        </div>

        {/* Col 4: Project Info */}
        <div className="space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Deployment & License
          </h3>
          <p className="text-xs leading-relaxed text-slate-400">
            Deployed on Vercel & Render. Verified with 5,000,000 multilingual sentence benchmarks.
          </p>
          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Built with</span>
            <Heart size={12} className="text-rose-500 fill-rose-500" />
            <span>for ISL Accessibility</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© 2026 Bharat Sign AI Platform. All rights reserved.</p>
        <p className="text-slate-400">Empowering Communication Across 14+ Indian Regional Languages.</p>
      </div>
    </footer>
  );
}

