import { useEffect, useState } from "react";

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Sidebar({ setMessages }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/all");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handleHistoryClick = (item) => {
    setActiveId(item._id);
    setMessages([
      { role: "user", text: item.description },
      { role: "bot", text: JSON.stringify(item.generatedSchema, null, 2) },
    ]);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Syne:wght@600;700;800&display=swap');

        .sb { width:265px; min-width:265px; background:#06090f; border-right:1px solid #0f1923; display:flex; flex-direction:column; height:100vh; font-family:'Syne',sans-serif; position:relative; overflow:hidden; }
        .sb::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#00e5ff,#0066ff,#a855f7); z-index:1; }

        .sb-top { padding:22px 16px 16px; border-bottom:1px solid #0f1923; }
        .sb-logo { display:flex; align-items:center; gap:10px; margin-bottom:18px; }
        .sb-logo-mark { width:36px; height:36px; background:linear-gradient(135deg,#00e5ff12,#0066ff20); border:1px solid #00e5ff28; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:16px; }
        .sb-logo-name { font-size:18px; font-weight:800; color:#ddeeff; letter-spacing:0.2px; }
        .sb-logo-name em { color:#00e5ff; font-style:normal; }

        .sb-new { width:100%; background:linear-gradient(135deg,#00e5ff10,#0066ff10); border:1px solid #00e5ff22; border-radius:9px; padding:10px 14px; color:#00e5ff; font-family:'Syne',sans-serif; font-weight:700; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:8px; transition:all .2s; letter-spacing:0.3px; }
        .sb-new:hover { background:linear-gradient(135deg,#00e5ff1e,#0066ff1e); border-color:#00e5ff44; box-shadow:0 0 20px #00e5ff12; transform:translateY(-1px); }

        .sb-hist { flex:1; overflow-y:auto; padding:14px 10px; scrollbar-width:thin; scrollbar-color:#1a2640 transparent; }
        .sb-hist::-webkit-scrollbar { width:3px; }
        .sb-hist::-webkit-scrollbar-thumb { background:#1a2640; border-radius:2px; }

        .sb-hlabel { font-family:'JetBrains Mono',monospace; font-size:9.5px; font-weight:700; color:#1e3350; letter-spacing:2.5px; text-transform:uppercase; padding:0 6px 10px; display:flex; align-items:center; gap:6px; }
        .sb-hlabel::after { content:''; flex:1; height:1px; background:#0f1923; }

        .sb-loading { display:flex; gap:5px; padding:10px 6px; }
        .sb-dot { width:4px;height:4px;border-radius:50%;background:#1e3350;animation:sbp 1.4s infinite; }
        .sb-dot:nth-child(2){animation-delay:.2s} .sb-dot:nth-child(3){animation-delay:.4s}
        @keyframes sbp{0%,80%,100%{opacity:.3;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}

        .sb-empty { font-family:'JetBrains Mono',monospace; font-size:11px; color:#1e3350; padding:10px 6px; font-style:italic; }

        .sb-list { display:flex; flex-direction:column; gap:2px; }

        .sb-item { width:100%; background:transparent; border:1px solid transparent; border-radius:7px; padding:9px 10px; cursor:pointer; display:flex; flex-direction:column; gap:3px; text-align:left; transition:all .15s; overflow:hidden; }
        .sb-item:hover { background:#0c1620; border-color:#1a2f45; }
        .sb-item.act { background:#0c1e30; border-color:#00e5ff28; }

        .sb-item-top { display:flex; align-items:center; gap:6px; overflow:hidden; }
        .sb-item-arrow { font-size:9px; color:#2a4060; flex-shrink:0; }
        .sb-item.act .sb-item-arrow { color:#00e5ff; }
        .sb-item-txt { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:#3a5570; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1; }
        .sb-item:hover .sb-item-txt { color:#7aaac0; }
        .sb-item.act .sb-item-txt { color:#00e5ff; }

        .sb-item-time { font-family:'JetBrains Mono',monospace; font-size:9px; color:#1a3050; padding-left:15px; }

        .sb-foot { padding:12px 16px; border-top:1px solid #0f1923; display:flex; align-items:center; gap:7px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#1e3350; }
        .sb-online { width:6px;height:6px;border-radius:50%;background:#00e5ff;box-shadow:0 0 7px #00e5ff;animation:blink 2s infinite;flex-shrink:0; }
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>

      <div className="sb">
        <div className="sb-top">
          <div className="sb-logo">
            <div className="sb-logo-mark">🗄</div>
            <div className="sb-logo-name">Schema<em>AI</em></div>
          </div>
          <button className="sb-new" onClick={() => { setMessages([]); setActiveId(null); fetchHistory(); }}>
            <span style={{fontSize:'17px',lineHeight:1}}>＋</span> New Schema
          </button>
        </div>

        <div className="sb-hist">
          <div className="sb-hlabel">History</div>
          {loading ? (
            <div className="sb-loading"><div className="sb-dot"/><div className="sb-dot"/><div className="sb-dot"/></div>
          ) : history.length === 0 ? (
            <div className="sb-empty">// no sessions yet</div>
          ) : (
            <div className="sb-list">
              {history.map(item => (
                <button key={item._id} className={`sb-item ${activeId === item._id ? 'act' : ''}`} onClick={() => handleHistoryClick(item)} title={item.description}>
                  <div className="sb-item-top">
                    <span className="sb-item-arrow">▸</span>
                    <span className="sb-item-txt">{item.description}</span>
                  </div>
                  <div className="sb-item-time">{timeAgo(item.createdAt)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sb-foot">
          <div className="sb-online"/>
          MongoDB connected
        </div>
      </div>
    </>
  );
}