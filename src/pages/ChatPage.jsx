import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ── Typing animation word-by-word ── */
function TypingText({ text, speed = 45, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed(""); setDone(false);
    if (!text) return;
    const words = text.split(" ");
    let i = 0;
    const iv = setInterval(() => {
      if (i < words.length) { setDisplayed((p) => (p ? p + " " + words[i] : words[i])); i++; }
      else { clearInterval(iv); setDone(true); onDone && onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span>
      {displayed}
      {!done && <span className="inline-block w-1.5 h-4 ml-0.5 align-middle animate-pulse" style={{ background: "#00e5ff" }} />}
    </span>
  );
}

/* ── Color map for schema types ── */
const TYPE_COLORS = {
  String: "#4ade80", Number: "#facc15", Date: "#f472b6",
  ObjectId: "#60a5fa", Boolean: "#fb923c", Array: "#c084fc", Object: "#94a3b8",
};

/* ── Schema renderer ── */
function SchemaBlock({ schema }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="mt-4 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,229,255,0.2)", background: "#010306" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(0,229,255,0.04)" }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 opacity-80"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 opacity-80"></span>
          <span className="ml-2 text-xs font-black tracking-widest" style={{ color: "rgba(0,229,255,0.6)" }}>MONGODB SCHEMA</span>
        </div>
        <button onClick={copy} className="text-xs font-black tracking-wider px-3 py-1 transition-all"
          style={{ border: "1px solid rgba(0,229,255,0.2)", borderRadius: "4px", color: copied ? "#4ade80" : "rgba(0,229,255,0.6)" }}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre className="p-4 text-xs leading-relaxed overflow-x-auto" style={{ fontFamily: "'Courier New', monospace" }}>
        <span className="text-gray-500">{"{"}</span>
        {Object.entries(schema).map(([col, fields]) => (
          <div key={col} className="ml-4">
            <span style={{ color: "#00e5ff" }}>"{col}"</span>
            <span className="text-gray-500">: {"{"}</span>
            {Object.entries(fields).map(([k, v]) => (
              <div key={k} className="ml-4">
                <span className="text-gray-300">"{k}"</span>
                <span className="text-gray-500">: </span>
                <span style={{ color: TYPE_COLORS[v] || "#e2e8f0" }}>"{v}"</span>
                <span className="text-gray-600">,</span>
              </div>
            ))}
            <span className="text-gray-500">{"}"}</span><span className="text-gray-600">,</span>
          </div>
        ))}
        <span className="text-gray-500">{"}"}</span>
      </pre>
      <div className="flex flex-wrap gap-3 px-4 py-3" style={{ borderTop: "1px solid rgba(0,229,255,0.08)" }}>
        {Object.entries(TYPE_COLORS).map(([t, c]) => (
          <span key={t} className="flex items-center gap-1.5 text-xs font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: c }}></span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Bot message bubble ── */
function BotMessage({ msg, isLatest, onTypingDone }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-xs"
        style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", boxShadow: "0 0 10px rgba(0,229,255,0.1)" }}>
        AI
      </div>
      <div className="flex-1 max-w-2xl">
        <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'Courier New', monospace" }}>
          {isLatest
            ? <TypingText text={msg.text} onDone={onTypingDone} />
            : msg.text}
        </p>
        {msg.fileUrl && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold" style={{ border: "1px solid rgba(0,229,255,0.15)", background: "rgba(0,229,255,0.03)", color: "rgba(0,229,255,0.7)" }}>
            📎 <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">{msg.fileName}</a>
          </div>
        )}
        {msg.schema && (isLatest ? !isLatest : true) && <SchemaBlock schema={msg.schema} />}
      </div>
    </div>
  );
}

/* ── BotMessage with deferred schema ── */
function BotMessageAnimated({ msg, isLatest }) {
  const [showSchema, setShowSchema] = useState(!isLatest);
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-black text-xs"
        style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff", boxShadow: "0 0 10px rgba(0,229,255,0.1)" }}>
        AI
      </div>
      <div className="flex-1 max-w-2xl">
        <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: "'Courier New', monospace" }}>
          {isLatest
            ? <TypingText text={msg.text} onDone={() => setShowSchema(true)} />
            : msg.text}
        </p>
        {msg.fileUrl && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold" style={{ border: "1px solid rgba(0,229,255,0.15)", background: "rgba(0,229,255,0.03)", color: "rgba(0,229,255,0.7)" }}>
            📎 <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">{msg.fileName}</a>
          </div>
        )}
        {showSchema && msg.schema && <SchemaBlock schema={msg.schema} />}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN CHATPAGE
══════════════════════════════════════════ */
export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  /* Load sessions */
  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sessions", { headers: authHeaders });
      const data = await res.json();
      if (Array.isArray(data)) setSessions(data);
    } catch {}
  }, []);

  useEffect(() => { loadSessions(); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  /* Load a session by id */
  const loadSession = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/sessions/${id}`, { headers: authHeaders });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages.map((m) => ({ ...m, isOld: true })));
        setActiveSessionId(id);
        setShowProfile(false);
      }
    } catch {}
  };

  /* Delete session */
  const deleteSession = async (e, id) => {
    e.stopPropagation();
    await fetch(`http://localhost:5000/api/sessions/${id}`, { method: "DELETE", headers: authHeaders });
    if (activeSessionId === id) { setMessages([]); setActiveSessionId(null); }
    loadSessions();
  };

  /* New chat */
  const newChat = () => { setMessages([]); setActiveSessionId(null); setUploadedFile(null); setShowProfile(false); };

  /* File upload */
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedFile(data);
        if (data.extractedText) setInput(`Analyze this file and generate a MongoDB schema:\n${data.extractedText}`);
      }
    } catch { alert("Upload failed"); }
    finally { setUploading(false); }
  };

  /* Send message */
  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg = { role: "user", text, fileUrl: uploadedFile?.fileUrl, fileName: uploadedFile?.fileName };
    setMessages((prev) => [...prev, userMsg]);
    setUploadedFile(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ description: text, sessionId: activeSessionId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveSessionId(data.sessionId);
        setMessages((prev) => [...prev, { role: "bot", text: data.intro, schema: data.data, isLatest: true }]);
        loadSessions();
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't generate a schema. Please try again.", schema: null }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Server error. Please check your connection.", schema: null }]);
    } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const SUGGESTIONS = [
    "E-commerce app with products, orders and payments",
    "Healthcare system with doctors and appointments",
    "Social media app with posts and followers",
    "Online learning platform with courses and quizzes",
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#020408", fontFamily: "'Courier New', monospace" }}>
      {/* ──── SIDEBAR ──── */}
      <div className="w-64 flex-shrink-0 flex flex-col" style={{ background: "#040810", borderRight: "1px solid rgba(0,229,255,0.1)" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid rgba(0,229,255,0.08)" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-black text-xs" style={{ background: "linear-gradient(135deg, #00e5ff, #0088ff)" }}>S</div>
          <span className="font-black tracking-widest text-sm" style={{ color: "#00e5ff" }}>SCHEMA<span className="text-white">AI</span></span>
          <div className="ml-auto flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-green-400 font-black" style={{ fontSize: "9px" }}>LIVE</span>
          </div>
        </div>

        {/* New chat */}
        <div className="p-3">
          <button onClick={newChat} className="w-full flex items-center gap-2 px-3 py-2.5 font-black text-xs tracking-wider transition-all"
            style={{ border: "1px solid rgba(0,229,255,0.2)", borderRadius: "8px", color: "#00e5ff", background: "rgba(0,229,255,0.03)" }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 15px rgba(0,229,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
            <span className="text-lg leading-none">+</span> NEW SCHEMA
          </button>
        </div>

        {/* Sessions */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p className="text-xs font-black tracking-widest mb-2 px-1" style={{ color: "rgba(0,229,255,0.3)" }}>HISTORY</p>
          {sessions.length === 0 && (
            <p className="text-xs px-2 text-gray-700 font-bold">No chats yet</p>
          )}
          {sessions.map((s) => (
            <div key={s._id}
              onClick={() => loadSession(s._id)}
              className="group flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 cursor-pointer transition-all"
              style={{
                background: activeSessionId === s._id ? "rgba(0,229,255,0.07)" : "transparent",
                border: activeSessionId === s._id ? "1px solid rgba(0,229,255,0.2)" : "1px solid transparent",
              }}
              onMouseEnter={e => { if (activeSessionId !== s._id) e.currentTarget.style.background = "rgba(0,229,255,0.03)"; }}
              onMouseLeave={e => { if (activeSessionId !== s._id) e.currentTarget.style.background = "transparent"; }}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: activeSessionId === s._id ? "#00e5ff" : "rgba(255,255,255,0.5)" }}>
                  {s.title}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px" }}>
                  {new Date(s.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={(e) => deleteSession(e, s._id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-all ml-1 font-black text-xs">✕</button>
            </div>
          ))}
        </div>

        {/* User profile */}
        <div style={{ borderTop: "1px solid rgba(0,229,255,0.08)" }} className="p-3">
          <button onClick={() => setShowProfile((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
            style={{ border: "1px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,229,255,0.04)"; e.currentTarget.style.border = "1px solid rgba(0,229,255,0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.border = "1px solid transparent"; }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,136,255,0.2))", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs font-black text-white truncate">{user.name || "User"}</p>
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}>{user.email}</p>
            </div>
            <span style={{ color: "rgba(0,229,255,0.4)", fontSize: "12px" }}>⚙</span>
          </button>

          {showProfile && (
            <div className="mt-2 p-4 rounded-xl" style={{ border: "1px solid rgba(0,229,255,0.15)", background: "rgba(0,229,255,0.02)" }}>
              <p className="text-xs font-black tracking-widest mb-3" style={{ color: "rgba(0,229,255,0.4)" }}>PROFILE</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-black"
                  style={{ background: "linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,136,255,0.2))", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="text-sm font-black text-white">{user.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-black tracking-wider transition-all"
                style={{ color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(248,113,113,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                ⎋ LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ──── MAIN ──── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(0,229,255,0.08)", background: "rgba(2,4,8,0.95)" }}>
          <div className="flex items-center gap-2 text-xs font-black tracking-wider">
            <span style={{ color: "#00e5ff" }}>MONGODB SCHEMA GENERATOR</span>
            <span style={{ color: "rgba(0,229,255,0.3)" }}>›</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>describe your data model</span>
          </div>
          <span className="text-xs font-black tracking-widest px-2 py-1 rounded" style={{ border: "1px solid rgba(0,229,255,0.15)", color: "rgba(0,229,255,0.4)" }}>v2.0</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.04)", boxShadow: "0 0 30px rgba(0,229,255,0.08)" }}>
                <span className="text-2xl">🗄️</span>
              </div>
              <div>
                <h3 className="font-black text-white text-lg tracking-wide mb-1">SCHEMA GENERATOR</h3>
                <p className="text-xs font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>DESCRIBE YOUR APPLICATION TO GET STARTED</p>
              </div>
              <div className="grid grid-cols-2 gap-2 max-w-xl w-full">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => setInput(s)}
                    className="px-4 py-3 text-xs font-bold text-left transition-all"
                    style={{ border: "1px solid rgba(0,229,255,0.12)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", background: "rgba(0,229,255,0.02)" }}
                    onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.3)"; e.currentTarget.style.color = "#00e5ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(0,229,255,0.12)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLatest = i === messages.length - 1;
            if (msg.role === "user") return (
              <div key={i} className="flex justify-end">
                <div>
                  {msg.fileUrl && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold" style={{ border: "1px solid rgba(0,229,255,0.15)", color: "rgba(0,229,255,0.7)", background: "rgba(0,229,255,0.03)" }}>
                      📎 {msg.fileName}
                    </div>
                  )}
                  <div className="px-4 py-3 text-sm font-bold max-w-lg" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "12px 12px 2px 12px", color: "rgba(255,255,255,0.9)", boxShadow: "0 0 15px rgba(0,229,255,0.05)" }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
            return <BotMessageAnimated key={i} msg={msg} isLatest={isLatest && !msg.isOld} />;
          })}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-xs"
                style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.3)", color: "#00e5ff" }}>AI</div>
              <div className="flex items-center gap-1.5 mt-2">
                {[0, 150, 300].map((d) => (
                  <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#00e5ff", animationDelay: `${d}ms` }}></span>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 px-6 pb-6 pt-3" style={{ borderTop: "1px solid rgba(0,229,255,0.08)" }}>
          {/* File preview */}
          {uploadedFile && (
            <div className="mb-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold" style={{ border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.04)", color: "#00e5ff" }}>
              📎 {uploadedFile.fileName}
              <button onClick={() => setUploadedFile(null)} className="ml-auto text-red-400 hover:text-red-300">✕</button>
            </div>
          )}

          <div className="flex items-end gap-3 px-4 py-3 rounded-xl transition-all"
            style={{ border: "1px solid rgba(0,229,255,0.2)", background: "rgba(0,229,255,0.02)", boxShadow: "0 0 20px rgba(0,229,255,0.03)" }}>

            {/* Upload button */}
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload}
              accept=".json,.js,.jsx,.ts,.tsx,.txt,.md,.yaml,.yml,.csv" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ border: "1px solid rgba(0,229,255,0.2)", color: uploading ? "rgba(0,229,255,0.3)" : "rgba(0,229,255,0.6)", background: "rgba(0,229,255,0.03)" }}
              title="Upload file">
              {uploading ? (
                <span className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
              ) : "📎"}
            </button>

            <textarea
              rows={1}
              className="flex-1 bg-transparent text-sm font-bold text-white placeholder-gray-700 resize-none outline-none leading-relaxed"
              placeholder="Describe your database schema... e.g. I need schema for a hospital management system"
              value={input}
              onChange={(e) => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />

            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: !input.trim() || loading ? "rgba(0,229,255,0.15)" : "linear-gradient(135deg, #00e5ff, #0088ff)",
                boxShadow: !input.trim() || loading ? "none" : "0 0 15px rgba(0,229,255,0.3)",
                cursor: !input.trim() || loading ? "not-allowed" : "pointer",
              }}>
              <svg className="w-4 h-4" fill="none" stroke={!input.trim() || loading ? "rgba(0,229,255,0.4)" : "#000"} viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-center text-xs font-bold tracking-widest mt-2" style={{ color: "rgba(0,229,255,0.2)" }}>
            ENTER TO SEND · SHIFT+ENTER FOR NEW LINE · 📎 TO UPLOAD FILE
          </p>
        </div>
      </div>
    </div>
  );
}