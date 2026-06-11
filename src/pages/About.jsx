const C = { chalk: "#F3EFE4", dim: "rgba(243,239,228,0.85)", gold: "#D9B45C" };

export default function About() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 20px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 20 }}>About WC26 Sim</h1>
      {[
        "WC26 Sim is an independent statistical project that simulates the 2026 FIFA World Cup thousands of times to estimate each nation's chances — of winning their group, surviving the knockout rounds, and lifting the trophy.",
        "The engine works in three layers. First, every national team is assigned an Elo-style strength rating derived from recent international results. Second, each individual match is modeled with Poisson goal distributions calibrated to those ratings, which produces realistic scorelines rather than simple win/loss coin flips. Third, a Monte Carlo layer plays out the entire 104-match tournament — group tables, third-place tiebreakers, and a full knockout bracket — up to 10,000 times, and the frequencies across those simulated tournaments become the probabilities you see on the site.",
        "The match-by-match predictions on the group stage page are computed analytically from the same model: for each fixture we calculate the full grid of possible scorelines and report the win/draw/loss probabilities and the single most likely score.",
        "This site was built by an engineering student and lifelong football fan as a one-tournament project. All probabilities are statistical estimates for entertainment and analysis — they are not guarantees and not betting advice. WC26 Sim is not affiliated with FIFA, any confederation, or any national football association.",
      ].map((p, i) => (
        <p key={i} style={{ fontSize: 16, lineHeight: 1.85, color: C.dim, marginBottom: 18 }}>{p}</p>
      ))}
    </div>
  );
}
