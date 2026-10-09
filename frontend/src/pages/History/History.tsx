import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { History as HistoryIcon, Search, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface HistoryRecord {
  id: string;
  originalText: string;
  sourceLang: string;
  islGloss: string;
  timestamp: string;
  signCount: number;
}

const SAMPLE_HISTORY: HistoryRecord[] = [
  {
    id: "rec-1",
    originalText: "I am going to the bank to deposit money tomorrow.",
    sourceLang: "English",
    islGloss: "TOMORROW I MONEY BANK DEPOSIT GO",
    timestamp: "Today, 14:32",
    signCount: 6,
  },
  {
    id: "rec-2",
    originalText: "नमस्ते! आप कैसे हैं?",
    sourceLang: "Hindi",
    islGloss: "NAMASTE YOU HOW ARE YOU",
    timestamp: "Today, 11:15",
    signCount: 3,
  },
  {
    id: "rec-3",
    originalText: "हमरा पानी और खाना चाहीं।",
    sourceLang: "Bhojpuri",
    islGloss: "ME WATER FOOD WANT",
    timestamp: "Yesterday, 18:40",
    signCount: 4,
  },
];

export default function History() {
  const [records, setRecords] = useState<HistoryRecord[]>(SAMPLE_HISTORY);
  const [search, setSearch] = useState("");

  const filtered = records.filter(
    (r) =>
      r.originalText.toLowerCase().includes(search.toLowerCase()) ||
      r.islGloss.toLowerCase().includes(search.toLowerCase())
  );

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your translation history?")) {
      setRecords([]);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#090D1F] py-20 text-center border-b border-indigo-900/40">
        <div className="relative max-w-4xl mx-auto px-6 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 border border-amber-500/40 px-4 py-1.5 text-xs font-bold text-amber-300">
            <HistoryIcon size={15} /> Translation Logs & History
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Translation History
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Review past speech-to-sign translations, ISL gloss breakdowns, and language logs.
          </p>
        </div>
      </section>

      {/* History Catalog Section */}
      <section className="bg-[#FEF3C7] py-24 text-slate-900 flex-1 border-b border-amber-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-amber-200 shadow-md">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history by text or gloss..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            {records.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Trash2 size={14} /> Clear History
              </button>
            )}
          </div>

          {/* List of History Items */}
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-amber-200 bg-white p-12 text-center space-y-3">
              <HistoryIcon size={40} className="mx-auto text-amber-600 opacity-50" />
              <h3 className="text-xl font-bold text-slate-800">No Translation History Found</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Translate speech in the Master Studio to start logging your ISL gloss histories automatically.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-md shadow-amber-600/30"
              >
                Open Studio <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-amber-200 bg-white p-6 shadow-md hover:shadow-lg transition space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                      {item.sourceLang}
                    </span>
                    <span>{item.timestamp}</span>
                  </div>

                  <p className="text-base font-bold text-slate-900">"{item.originalText}"</p>

                  <div className="p-3.5 rounded-2xl bg-[#FFFBEB] border border-amber-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-amber-700 font-extrabold block uppercase tracking-wider">
                        ISL Gloss Sequence ({item.signCount} Signs)
                      </span>
                      <span className="font-extrabold text-purple-900 tracking-wide font-mono text-sm">
                        {item.islGloss}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
                    >
                      Replay
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
