const C = { dim: "rgba(243,239,228,0.85)", gold: "#D9B45C" };

export default function Contact() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 20px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>Contact</h1>
      <p style={{ fontSize: 16, lineHeight: 1.85, color: C.dim }}>
        Questions, feedback, corrections, or partnership inquiries are welcome.
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.85, color: C.dim }}>
        Email: <a href="mailto:ysj3090@gmail.com" style={{ color: C.gold }}>ysj3090@gmail.com</a>
      </p>
      <p style={{ fontSize: 16, lineHeight: 1.85, color: C.dim }}>
        We aim to respond within a few days during the tournament.
      </p>
    </div>
  );
}
