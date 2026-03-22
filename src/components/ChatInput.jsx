import { useState, useRef, useEffect } from "react";

export default function ChatInput({ setMessages }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef(null);

  // Listen for quick-hint clicks from ChatWindow empty state
  useEffect(() => {
    const handler = (e) => setInput(e.detail);
    window.addEventListener("schema-hint", handler);
    return () => window.removeEventListener("schema-hint", handler);
  }, []);

  const sendMessage = async (description) => {
    if (!description.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: description }]);
    setInput("");
    setFileName(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.success
            ? JSON.stringify(data.data, null, 2)
            : "❌ Error: " + data.error,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "❌ Could not connect to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const name = file.name.toLowerCase();
    const text = await file.text();

    if (name.endsWith(".json")) {
      try {
        const json = JSON.parse(text);
        const keys = Object.keys(json).join(", ");
        sendMessage(`Generate MongoDB schema for a system with these fields: ${keys}`);
      } catch { alert("Invalid JSON file."); }
    } else if (name.endsWith(".txt")) {
      sendMessage(text.trim());
    } else if (name.endsWith(".js") || name.endsWith(".ts") || name.endsWith(".jsx")) {
      sendMessage(`Analyze this code and generate a MongoDB schema:\n${text.substring(0, 500)}`);
    } else {
      alert("Supported: .json, .txt, .js, .ts, .jsx");
    }
    e.target.value = "";
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@500;600;700&display=swap');

        .ci-root { padding:14px 20px 20px; background:#080c12; border-top:1px solid #0f1820; position:relative; }
        .ci-root::before { content:''; position:absolute; top:0; left:60px; right:60px; height:1px; background:linear-gradient(90deg,transparent,#00e5ff18,transparent); }

        .ci-upload-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
        .ci-upload-btn { background:#0c1520; border:1px solid #192a3a; border-radius:7px; padding:6px 12px; font-family:'JetBrains Mono',monospace; font-size:11px; color:#2a5070; cursor:pointer; display:flex; align-items:center; gap:7px; transition:all .2s; white-space:nowrap; }
        .ci-upload-btn:hover { border-color:#00e5ff35; color:#00e5ff; background:#0f1e2e; }
        .ci-filename { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#00e5ff; background:#00e5ff0e; border:1px solid #00e5ff22; border-radius:5px; padding:3px 9px; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .ci-hint { font-family:'JetBrains Mono',monospace; font-size:10px; color:#1a3050; }

        .ci-input-row { display:flex; gap:10px; align-items:flex-end; }
        .ci-textarea { flex:1; background:#0c1520; border:1px solid #192a3a; border-radius:10px; padding:12px 16px; font-family:'Syne',sans-serif; font-size:13.5px; color:#c8dff0; outline:none; resize:none; transition:border-color .2s,box-shadow .2s; line-height:1.5; }
        .ci-textarea::placeholder { color:#1a3050; }
        .ci-textarea:focus { border-color:#00e5ff30; box-shadow:0 0 0 3px #00e5ff08; }
        .ci-textarea:disabled { opacity:.5; cursor:not-allowed; }

        .ci-send { background:linear-gradient(135deg,#0050cc,#0077ff); border:none; border-radius:10px; width:48px; height:48px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; flex-shrink:0; box-shadow:0 4px 16px #0055dd28; }
        .ci-send:hover:not(:disabled) { background:linear-gradient(135deg,#0066ff,#00aaff); transform:translateY(-1px); box-shadow:0 6px 22px #0066ff38; }
        .ci-send:disabled { opacity:.35; cursor:not-allowed; transform:none; }
        .ci-send svg { width:18px; height:18px; fill:white; }

        .ci-lds { display:flex; gap:3px; align-items:center; }
        .ci-ld { width:5px;height:5px;border-radius:50%;background:white;animation:ldp 1.2s infinite; }
        .ci-ld:nth-child(2){animation-delay:.15s} .ci-ld:nth-child(3){animation-delay:.3s}
        @keyframes ldp{0%,80%,100%{opacity:.3;transform:scale(.7)}40%{opacity:1;transform:scale(1)}}
      `}</style>

      <div className="ci-root">
        <div className="ci-upload-row">
          <button className="ci-upload-btn" onClick={() => fileRef.current.click()}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload File
          </button>
          {fileName
            ? <span className="ci-filename">📄 {fileName}</span>
            : <span className="ci-hint">.json .txt .js .ts .jsx</span>
          }
          <input ref={fileRef} type="file" accept=".json,.txt,.js,.ts,.jsx" onChange={handleFileUpload} style={{display:'none'}} />
        </div>

        <div className="ci-input-row">
          <textarea
            className="ci-textarea"
            rows={2}
            placeholder="Describe your database schema... e.g. I need schema for a blog app"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            disabled={loading}
          />
          <button className="ci-send" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
            {loading ? (
              <div className="ci-lds"><div className="ci-ld"/><div className="ci-ld"/><div className="ci-ld"/></div>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}