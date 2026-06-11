import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Simulator from "./pages/Simulator.jsx";
import Articles from "./pages/Articles.jsx";
import Article from "./pages/Article.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";

const C = {
  pitch: "#0C2E20",
  pitchDeep: "#081F15",
  chalk: "#F3EFE4",
  chalkDim: "rgba(243,239,228,0.55)",
  line: "rgba(243,239,228,0.18)",
  gold: "#D9B45C",
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.pitchDeep,
        color: C.chalk,
        fontFamily:
          "'Inter','Helvetica Neue',-apple-system,'Noto Sans KR',sans-serif",
      }}
    >
      <ScrollToTop />

      {/* ── Nav ── */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 20px",
          borderBottom: `1px solid ${C.line}`,
          background: C.pitch,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Link
          to="/"
          style={{
            color: C.gold,
            fontWeight: 900,
            fontSize: 15,
            letterSpacing: "0.08em",
            textDecoration: "none",
          }}
        >
          ⚽ WC26 SIM
        </Link>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
          <NavLink to="/">Simulator</NavLink>
          <NavLink to="/previews">Group Previews</NavLink>
          <NavLink to="/about">About</NavLink>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Simulator />} />
        <Route path="/previews" element={<Articles />} />
        <Route path="/previews/:slug" element={<Article />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: `1px solid ${C.line}`,
          padding: "28px 20px 40px",
          background: C.pitch,
          marginTop: 40,
        }}
      >
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 13,
          }}
        >
          <div style={{ color: C.chalkDim, lineHeight: 1.6 }}>
            WC26 Sim — Monte Carlo tournament simulator.
            <br />
            Statistical estimates for entertainment. Not betting advice.
            <br />
            Not affiliated with FIFA or any football association.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <FootLink to="/about">About</FootLink>
            <FootLink to="/contact">Contact</FootLink>
            <FootLink to="/privacy">Privacy Policy</FootLink>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: C.chalkDim,
        textDecoration: "none",
        fontWeight: 700,
        fontSize: 13,
      }}
    >
      {children}
    </Link>
  );
}

function FootLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{ color: C.chalkDim, textDecoration: "underline", fontWeight: 600 }}
    >
      {children}
    </Link>
  );
}
