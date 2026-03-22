import { useState } from "react";
import ChatInput from "../components/ChatInput";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cp-root { display:flex; height:100vh; background:#080c12; color:white; overflow:hidden; }
        .cp-main { display:flex; flex-direction:column; flex:1; overflow:hidden; }

        .cp-header { padding:13px 24px; background:#06090f; border-bottom:1px solid #0f1820; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; position:relative; }
        .cp-header::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,#00e5ff12,transparent); }

        .cp-header-left { display:flex; align-items:center; gap:12px; }

        .cp-title { font-family:'Syne',sans-serif; font-size:14.5px; font-weight:800; color:#3a6080; }
        .cp-title strong { color:#7aaac0; font-weight:800; }

        .cp-sep { color:#1a3050; font-size:16px; }

        .cp-sub { font-family:'JetBrains Mono',monospace; font-size:11px; color:#1a3050; }

        .cp-header-right { display:flex; align-items:center; gap:8px; }

        .cp-badge { background:#00e5ff0e; border:1px solid #00e5ff22; border-radius:6px; padding:3px 10px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#00e5ff; letter-spacing:0.5px; }

        .cp-status-pill { display:flex; align-items:center; gap:6px; background:#0c1520; border:1px solid #152030; border-radius:6px; padding:4px 10px; font-family:'JetBrains Mono',monospace; font-size:10px; color:#2a5070; }
        .cp-pulse { width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;animation:cpblink 2s infinite; }
        @keyframes cpblink{0%,100%{opacity:1}50%{opacity:.3}}
      `}</style>

      <div className="cp-root">
        <Sidebar setMessages={setMessages} />
        <div className="cp-main">
          <div className="cp-header">
            <div className="cp-header-left">
              <div className="cp-title"><strong>MongoDB</strong> Schema Generator</div>
              <span className="cp-sep">›</span>
              <div className="cp-sub">describe your data model</div>
            </div>
            <div className="cp-header-right">
              <div className="cp-status-pill"><div className="cp-pulse"/>live</div>
              <div className="cp-badge">v1.0</div>
            </div>
          </div>

          <ChatWindow messages={messages} />
          <ChatInput setMessages={setMessages} />
        </div>
      </div>
    </>
  );
};

export default ChatPage;