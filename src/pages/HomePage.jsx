import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const DOMAINS = [
  "E-Commerce","Blog / CMS","Chat & Messaging","Social Media","Healthcare",
  "Education / LMS","Food Delivery","Hotel Booking","Fintech / Payments",
  "Project Management","Inventory","Real Estate","Job Portal","Gaming",
  "Events & Tickets","IoT / Smart Devices","Review System","Notifications",
  "File Storage","HR & Recruitment",
];

const FEATURES = [
  { icon: "⚡", title: "Instant Generation", desc: "Describe in plain English — get production-ready MongoDB collections in seconds." },
  { icon: "🧠", title: "20+ Domains", desc: "From e-commerce to IoT, healthcare to gaming — all covered intelligently." },
  { icon: "💬", title: "ChatGPT-style UI", desc: "Natural conversation interface. It talks back before it generates." },
  { icon: "🔐", title: "Per-User Sessions", desc: "Every user's chat history is private, persistent, and loadable." },
  { icon: "📁", title: "File Upload", desc: "Upload JSON, JS, or text files to auto-generate schemas from existing code." },
  { icon: "📋", title: "Copy Schema", desc: "One-click copy of the generated schema to your clipboard." },
];

export default function HomePage() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] text-white overflow-x-hidden" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />

      {/* Glow orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)" }} />
      <div className="fixed bottom-40 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,0,128,0.05) 0%, transparent 70%)" }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4" style={{ borderBottom: "1px solid rgba(0,229,255,0.15)", background: "rgba(2,4,8,0.9)", backdropFilter: "blur(20px)" }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ background: "linear-gradient(135deg, #00e5ff, #0088ff)" }}>S</div>
          <span className="text-lg font-black tracking-widest" style={{ color: "#00e5ff", textShadow: "0 0 20px rgba(0,229,255,0.5)" }}>SCHEMA<span className="text-white">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="px-5 py-2 text-sm font-bold tracking-wider transition-all" style={{ border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", borderRadius: "6px" }}
            onMouseEnter={e => e.target.style.boxShadow = "0 0 15px rgba(0,229,255,0.3)"}
            onMouseLeave={e => e.target.style.boxShadow = "none"}>
            LOGIN
          </Link>
          <Link to="/register" className="px-5 py-2 text-sm font-black tracking-wider text-black transition-all" style={{ background: "linear-gradient(135deg, #00e5ff, #0088ff)", borderRadius: "6px", boxShadow: "0 0 20px rgba(0,229,255,0.3)" }}>
            REGISTER
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-widest" style={{ border: "1px solid rgba(0,229,255,0.3)", borderRadius: "100px", color: "#00e5ff", background: "rgba(0,229,255,0.05)" }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          AI-POWERED · MONGODB · SCHEMA GENERATOR
        </div>

        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
          <span className="block text-white">GENERATE</span>
          <span className="block" style={{ color: "#00e5ff", textShadow: "0 0 40px rgba(0,229,255,0.4)" }}>MONGODB</span>
          <span className="block text-white">SCHEMAS</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          Describe your application in plain language.<br />
          Get production-ready database schemas <span style={{ color: "#00e5ff" }}>instantly.</span>
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/register" className="px-8 py-4 text-sm font-black tracking-widest text-black transition-all" style={{ background: "linear-gradient(135deg, #00e5ff, #0066cc)", borderRadius: "8px", boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}>
            GET STARTED FREE →
          </Link>
          <Link to="/" className="px-8 py-4 text-sm font-bold tracking-widest transition-all" style={{ border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", borderRadius: "8px" }}>
            SIGN IN
          </Link>
        </div>
      </div>

      {/* Live ticker */}
      <div className="relative z-10 py-3 overflow-hidden" style={{ borderTop: "1px solid rgba(0,229,255,0.1)", borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(0,229,255,0.02)" }}>
        <div className="flex gap-8 text-xs font-bold tracking-widest" style={{ color: "rgba(0,229,255,0.5)", animation: "none" }}>
          {[...DOMAINS, ...DOMAINS].map((d, i) => (
            <span key={i} className="whitespace-nowrap">· {d.toUpperCase()}</span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00e5ff" }}>CAPABILITIES</p>
          <h2 className="text-3xl font-black text-white">Everything You Need</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-6 transition-all cursor-default group" style={{ background: "rgba(0,229,255,0.02)", border: "1px solid rgba(0,229,255,0.1)", borderRadius: "12px" }}
              onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.4)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,229,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-black text-white mb-2 tracking-wide text-sm">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Domains */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "#00e5ff" }}>SUPPORTED DOMAINS</p>
        <h2 className="text-2xl font-black text-white mb-8">20 Application Types</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {DOMAINS.map((d, i) => (
            <span key={i} className="px-3 py-1.5 text-xs font-bold tracking-wider transition-all" style={{ border: "1px solid rgba(0,229,255,0.15)", color: "rgba(0,229,255,0.7)", borderRadius: "6px", background: "rgba(0,229,255,0.03)" }}>
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="p-12" style={{ border: "1px solid rgba(0,229,255,0.2)", borderRadius: "16px", background: "rgba(0,229,255,0.03)", boxShadow: "0 0 60px rgba(0,229,255,0.05) inset" }}>
          <h2 className="text-3xl font-black mb-3 text-white">Ready to <span style={{ color: "#00e5ff" }}>Build?</span></h2>
          <p className="text-gray-500 text-sm mb-8">Join developers using SchemaAI to accelerate their workflow.</p>
          <Link to="/register" className="inline-block px-10 py-4 text-sm font-black tracking-widest text-black" style={{ background: "linear-gradient(135deg, #00e5ff, #0066cc)", borderRadius: "8px", boxShadow: "0 0 30px rgba(0,229,255,0.4)" }}>
            CREATE FREE ACCOUNT →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-6 text-xs font-bold tracking-widest" style={{ borderTop: "1px solid rgba(0,229,255,0.1)", color: "rgba(0,229,255,0.3)" }}>
        © 2024 SCHEMAAI — AI-BASED MONGODB SCHEMA GENERATOR
      </div>
    </div>
  );
}