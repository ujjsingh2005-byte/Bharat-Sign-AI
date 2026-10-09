import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { Mail, MessageSquare, Send, CheckCircle2, Github } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#090D1F] py-20 text-center border-b border-indigo-900/40">
        <div className="relative max-w-4xl mx-auto px-6 space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/40 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <Mail size={15} className="text-cyan-300" /> Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact & Support
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Have questions about ISL research, deployment integrations, or accessibility feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="bg-[#EFF6FF] py-24 text-slate-900 flex-1 border-b border-blue-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 grid md:grid-cols-12 gap-10 items-start">
          {/* Info Side */}
          <div className="md:col-span-5 space-y-6">
            <div className="rounded-3xl border border-[#BFDBFE] bg-white p-8 shadow-xl space-y-4">
              <h3 className="text-2xl font-extrabold text-[#0369A1]">Project Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bharat Sign AI is an open accessibility project designed to bridge spoken languages and Indian Sign Language.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0F9FF] border border-blue-100 text-[#0369A1] font-bold">
                  <Mail size={18} />
                  <span>Support: info@bharatsign.ai</span>
                </div>
                <a
                  href="https://github.com/ujjsingh2005-byte/Bharat-Sign-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#F0F9FF] border border-blue-100 text-[#0369A1] font-bold hover:bg-[#E0F2FE] transition"
                >
                  <Github size={18} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="md:col-span-7">
            <div className="rounded-3xl border border-[#BFDBFE] bg-white p-8 shadow-xl space-y-6">
              <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#0284C7]" />
                <span>Send Us a Message</span>
              </h3>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#166534] space-y-2 text-center">
                  <CheckCircle2 size={36} className="mx-auto text-[#15803D]" />
                  <h4 className="text-lg font-bold">Message Submitted Successfully!</h4>
                  <p className="text-xs text-slate-700">
                    Thank you for reaching out. Our team will get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1">Message / Inquiry</label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-slate-300 p-3 text-slate-900 focus:outline-none focus:border-[#0284C7]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-extrabold flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20"
                  >
                    <span>Send Message</span>
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
