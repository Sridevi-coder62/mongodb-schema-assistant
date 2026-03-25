import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill all fields");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/chat");
      } else {
        alert(data.message || "Login failed");
      }
    } catch { alert("Server error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white flex flex-col" style={{ fontFamily: "'Courier New', monospace" }}>
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
        backgroundSize: "40px 40px"
      }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%)" }} />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4" style={{ borderBottom: "1px solid rgba(0,229,255,0.1)", background: "rgba(2,4,8,0.95)" }}>
        <Link to="/home" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-black text-sm" style={{ background: "linear-gradient(135deg, #00e5ff, #0088ff)" }}>S</div>
          <span className="text-lg font-black tracking-widest" style={{ color: "#00e5ff", textShadow: "0 0 20px rgba(0,229,255,0.4)" }}>SCHEMA<span className="text-white">AI</span></span>
        </Link>
        <div className="text-xs text-gray-500 font-bold tracking-wider">
          NO ACCOUNT?{" "}
          <Link to="/register" className="font-black" style={{ color: "#00e5ff" }}>REGISTER →</Link>
        </div>
      </nav>

      {/* Form */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ border: "1px solid rgba(0,229,255,0.3)", background: "rgba(0,229,255,0.05)", boxShadow: "0 0 30px rgba(0,229,255,0.1)" }}>
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-black tracking-widest text-white mb-1">WELCOME BACK</h1>
            <p className="text-xs text-gray-500 tracking-widest font-bold">SIGN IN TO YOUR ACCOUNT</p>
          </div>

          <div className="p-8" style={{ border: "1px solid rgba(0,229,255,0.15)", borderRadius: "16px", background: "rgba(0,229,255,0.02)", boxShadow: "0 0 40px rgba(0,229,255,0.05)" }}>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-black tracking-widest mb-2" style={{ color: "rgba(0,229,255,0.6)" }}>EMAIL ADDRESS</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-700 outline-none transition-all text-sm font-bold"
                  style={{
                    border: focused === "email" ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.15)",
                    borderRadius: "8px",
                    boxShadow: focused === "email" ? "0 0 15px rgba(0,229,255,0.15)" : "none",
                  }}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div>
                <label className="block text-xs font-black tracking-widest mb-2" style={{ color: "rgba(0,229,255,0.6)" }}>PASSWORD</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-700 outline-none transition-all text-sm font-bold"
                  style={{
                    border: focused === "password" ? "1px solid #00e5ff" : "1px solid rgba(0,229,255,0.15)",
                    borderRadius: "8px",
                    boxShadow: focused === "password" ? "0 0 15px rgba(0,229,255,0.15)" : "none",
                  }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 text-sm font-black tracking-widest text-black transition-all mt-2"
                style={{
                  background: loading ? "rgba(0,229,255,0.5)" : "linear-gradient(135deg, #00e5ff, #0088ff)",
                  borderRadius: "8px",
                  boxShadow: loading ? "none" : "0 0 25px rgba(0,229,255,0.35)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                    AUTHENTICATING...
                  </span>
                ) : "SIGN IN →"}
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-gray-700 font-bold tracking-wider mt-6">
            SECURED WITH JWT AUTHENTICATION
          </p>
        </div>
      </div>
    </div>
  );
}