import { Link, useParams } from "react-router-dom";
import { ARTICLES, getArticle } from "../data/articles.js";

const C = {
  chalk: "#F3EFE4",
  chalkDim: "rgba(243,239,228,0.6)",
  line: "rgba(243,239,228,0.18)",
  gold: "#D9B45C",
};

export default function Articles() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 20px" }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          color: C.gold,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        GROUP PREVIEWS
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px" }}>
        All 12 Groups, Analyzed
      </h1>
      <p style={{ color: C.chalkDim, fontSize: 15, lineHeight: 1.7, marginBottom: 34 }}>
        Data-driven previews for every group at the 2026 World Cup — favorites,
        dark horses, key fixtures, and what our simulation engine expects.
      </p>
      <div style={{ display: "grid", gap: 14 }}>
        {ARTICLES.map((a) => (
          <Link
            key={a.slug}
            to={`/previews/${a.slug}`}
            style={{
              border: `1px solid ${C.line}`,
              borderRadius: 6,
              padding: "18px 20px",
              textDecoration: "none",
              color: C.chalk,
              display: "block",
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.2em",
                color: C.gold,
                fontWeight: 800,
                marginBottom: 6,
              }}
            >
              GROUP {a.group}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, lineHeight: 1.35, marginBottom: 6 }}>
              {a.title}
            </div>
            <div style={{ color: C.chalkDim, fontSize: 14, lineHeight: 1.6 }}>
              {a.summary}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 20px" }}>
        <h1 style={{ fontWeight: 900 }}>Preview not found</h1>
        <Link to="/previews" style={{ color: C.gold }}>
          ← Back to all previews
        </Link>
      </div>
    );
  }

  return (
    <article style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 20px" }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          color: C.gold,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        GROUP {article.group} · 2026 WORLD CUP PREVIEW
      </div>
      <h1
        style={{
          fontSize: "clamp(26px, 5vw, 36px)",
          fontWeight: 900,
          lineHeight: 1.2,
          margin: "0 0 22px",
        }}
      >
        {article.title}
      </h1>
      {article.paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color: "rgba(243,239,228,0.88)",
            marginBottom: 18,
          }}
        >
          {p}
        </p>
      ))}
      <div
        style={{
          marginTop: 36,
          paddingTop: 20,
          borderTop: `1px solid ${C.line}`,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <Link to="/previews" style={{ color: C.gold, fontWeight: 700 }}>
          ← All group previews
        </Link>
        <Link to="/" style={{ color: C.gold, fontWeight: 700 }}>
          Run the simulator →
        </Link>
      </div>
    </article>
  );
}
