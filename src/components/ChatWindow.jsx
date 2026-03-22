import { useEffect, useRef, useState } from "react";

// Syntax highlight the schema JSON
function HighlightedSchema({ text }) {
  const lines = text.split("\n");

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", lineHeight: "1.85" }}>
      {lines.map((line, i) => {
        // Empty line
        if (!line.trim()) return <div key={i}>&nbsp;</div>;

        // Opening brace of collection e.g. "payments": {
        const collectionMatch = line.match(/^(\s*)("[\w]+")(\s*:\s*)(\{)(,?)$/);
        if (collectionMatch) {
          return (
            <div key={i}>
              <span style={{ color: "#4a6a8a" }}>{collectionMatch[1]}</span>
              <span style={{ color: "#e2b96f", fontWeight: 600 }}>{collectionMatch[2]}</span>
              <span style={{ color: "#4a6a8a" }}>{collectionMatch[3]}</span>
              <span style={{ color: "#6a8aaa" }}>{collectionMatch[4]}</span>
              <span style={{ color: "#4a6a8a" }}>{collectionMatch[5]}</span>
            </div>
          );
        }

        // Field line e.g. "fieldName": "TypeValue"
        const fieldMatch = line.match(/^(\s*)("[\w]+")(\s*:\s*)("[\w]+"|[\w]+)(,?)$/);
        if (fieldMatch) {
          const typeVal = fieldMatch[4].replace(/"/g, "");
          const typeColor =
            typeVal === "String" ? "#7ee787" :
            typeVal === "Number" ? "#f7b84b" :
            typeVal === "Boolean" ? "#ff9d6f" :
            typeVal === "Date" ? "#c792ea" :
            typeVal === "ObjectId" ? "#00e5ff" :
            typeVal === "Array" ? "#ff79c6" :
            "#a8c4d4";

          return (
            <div key={i}>
              <span style={{ color: "#4a6a8a" }}>{fieldMatch[1]}</span>
              <span style={{ color: "#79b8ff", fontWeight: 500 }}>{fieldMatch[2]}</span>
              <span style={{ color: "#4a6a8a" }}>{fieldMatch[3]}</span>
              <span style={{ color: typeColor, fontWeight: 600 }}>{fieldMatch[4]}</span>
              <span style={{ color: "#4a6a8a" }}>{fieldMatch[5]}</span>
            </div>
          );
        }

        // Braces/brackets lines
        if (line.trim() === "{" || line.trim() === "}" || line.trim() === "}," || line.trim() === "},") {
          return (
            <div key={i}>
              <span style={{ color: "#6a8aaa" }}>{line}</span>
            </div>
          );
        }

        // Fallback
        return <div key={i} style={{ color: "#8ab8d4" }}>{line}</div>;
      })}
    </div>
  );
}

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const HINTS = [
    { icon: "🛒", label: "E-commerce", prompt: "I need schema for an e-commerce app" },
    { icon: "📝", label: "Blog", prompt: "I need schema for a blog platform" },
    { icon: "💬", label: "Chat App", prompt: "I need schema for a chat application" },
    { icon: "📅", label: "Booking", prompt: "I need schema for a booking system" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');

        .cw-root { flex:1; padding:20px 28px; overflow-y:auto; display:flex; flex-direction:column; gap:18px; scrollbar-width:thin; scrollbar-color:#151f2e transparent; }
        .cw-root::-webkit-scrollbar { width:4px; }
        .cw-root::-webkit-scrollbar-thumb { background:#151f2e; border-radius:2px; }

        .cw-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; flex:1; gap:24px; padding:40px 0; }

        .cw-empty-top { text-align:center; }
        .cw-empty-icon { font-size:40px; margin-bottom:10px; filter:drop-shadow(0 0 12px #00e5ff40); }
        .cw-empty-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#2a4a6a; letter-spacing:0.5px; margin-bottom:6px; }
        .cw-empty-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#1a3050; }

        .cw-hints { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; }
        .cw-hint-card { background:#0c1520; border:1px solid #1a2f45; border-radius:10px; padding:10px 16px; cursor:pointer; display:flex; align-items:center; gap:8px; font-family:'Syne',sans-serif; font-size:12px; font-weight:600; color:#3a6080; transition:all .2s; }
        .cw-hint-card:hover { background:#0f1e30; border-color:#00e5ff35; color:#00e5ff; box-shadow:0 0 14px #00e5ff10; transform:translateY(-2px); }
        .cw-hint-card span.icon { font-size:15px; }

        .cw-row { display:flex; animation:fadeup .25s ease; }
        @keyframes fadeup { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .cw-row.user { justify-content:flex-end; }
        .cw-row.bot { justify-content:flex-start; align-items:flex-start; gap:10px; }

        .cw-avatar { width:30px; height:30px; border-radius:8px; background:linear-gradient(135deg,#00e5ff12,#0066ff20); border:1px solid #00e5ff25; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:2px; }

        .cw-bubble-user { max-width:60%; background:linear-gradient(135deg,#0a4aaf,#0055ee); border:1px solid #2060ff30; border-radius:16px 16px 4px 16px; padding:12px 18px; font-family:'Syne',sans-serif; font-size:13.5px; color:#cce4ff; line-height:1.6; box-shadow:0 4px 20px #0044cc25; }

        .cw-bubble-bot { max-width:80%; background:#090e18; border:1px solid #162030; border-radius:4px 16px 16px 16px; overflow:hidden; box-shadow:0 4px 28px #00000050; }

        .cw-bot-header { display:flex; align-items:center; justify-content:space-between; padding:9px 14px; background:#0b1525; border-bottom:1px solid #162030; }

        .cw-bot-label { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:700; color:#00e5ff; letter-spacing:1.5px; text-transform:uppercase; display:flex; align-items:center; gap:8px; }

        .cw-bot-dots { display:flex; gap:5px; }
        .cw-dot { width:8px; height:8px; border-radius:50%; }
        .cw-dot.r { background:#ff5f57; }
        .cw-dot.y { background:#febc2e; }
        .cw-dot.g { background:#28c840; }

        .cw-copy-btn { background:#0f1e2e; border:1px solid #1a2f45; border-radius:5px; padding:3px 10px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#3a6080; cursor:pointer; transition:all .15s; }
        .cw-copy-btn:hover { background:#152535; border-color:#00e5ff35; color:#00e5ff; }
        .cw-copy-btn.ok { color:#22c55e; border-color:#22c55e35; }

        .cw-bot-code { padding:16px 18px; }

        .cw-legend { display:flex; flex-wrap:wrap; gap:10px; padding:8px 18px 14px; border-top:1px solid #0f1923; }
        .cw-legend-item { display:flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:9.5px; color:#2a4060; }
        .cw-legend-dot { width:7px; height:7px; border-radius:50%; }
      `}</style>

      <div className="cw-root">
        {messages.length === 0 && (
          <div className="cw-empty">
            <div className="cw-empty-top">
              <div className="cw-empty-icon">🗄️</div>
              <div className="cw-empty-title">What schema do you need?</div>
              <div className="cw-empty-sub">// type below or pick a quick start</div>
            </div>
            <div className="cw-hints">
              {HINTS.map((h) => (
                <button
                  key={h.label}
                  className="cw-hint-card"
                  onClick={() => {
                    // dispatch a custom event to pre-fill the input
                    window.dispatchEvent(new CustomEvent("schema-hint", { detail: h.prompt }));
                  }}
                >
                  <span className="icon">{h.icon}</span>
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`cw-row ${msg.role}`}>
            {msg.role === "bot" && <div className="cw-avatar">🤖</div>}

            {msg.role === "user" ? (
              <div className="cw-bubble-user">{msg.text}</div>
            ) : (
              <div className="cw-bubble-bot">
                <div className="cw-bot-header">
                  <div className="cw-bot-label">
                    <div className="cw-bot-dots">
                      <div className="cw-dot r"/><div className="cw-dot y"/><div className="cw-dot g"/>
                    </div>
                    MongoDB Schema
                  </div>
                  <button
                    className={`cw-copy-btn ${copied === index ? "ok" : ""}`}
                    onClick={() => handleCopy(msg.text, index)}
                  >
                    {copied === index ? "✓ copied" : "copy"}
                  </button>
                </div>
                <div className="cw-bot-code">
                  <HighlightedSchema text={msg.text} />
                </div>
                <div className="cw-legend">
                  {[
                    { color: "#7ee787", label: "String" },
                    { color: "#f7b84b", label: "Number" },
                    { color: "#c792ea", label: "Date" },
                    { color: "#00e5ff", label: "ObjectId" },
                    { color: "#ff9d6f", label: "Boolean" },
                    { color: "#ff79c6", label: "Array" },
                  ].map(({ color, label }) => (
                    <div className="cw-legend-item" key={label}>
                      <div className="cw-legend-dot" style={{ background: color }} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <div ref={bottomRef} />
      </div>
    </>
  );
}