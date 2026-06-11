import { useState, useRef, useCallback } from "react";

// ───────────────────────────────────────────────
// 2026 FIFA World Cup — official group draw (Dec 5, 2025 + playoff winners)
// elo: approximate Elo ratings (June 2026 estimates)
// ───────────────────────────────────────────────
const GROUPS = {
  A: [
    { id: "MEX", name: "Mexico", flag: "🇲🇽", elo: 1850 },
    { id: "RSA", name: "South Africa", flag: "🇿🇦", elo: 1700 },
    { id: "KOR", name: "South Korea", flag: "🇰🇷", elo: 1800 },
    { id: "CZE", name: "Czechia", flag: "🇨🇿", elo: 1730 },
  ],
  B: [
    { id: "CAN", name: "Canada", flag: "🇨🇦", elo: 1810 },
    { id: "BIH", name: "Bosnia & Herz.", flag: "🇧🇦", elo: 1700 },
    { id: "QAT", name: "Qatar", flag: "🇶🇦", elo: 1640 },
    { id: "SUI", name: "Switzerland", flag: "🇨🇭", elo: 1840 },
  ],
  C: [
    { id: "BRA", name: "Brazil", flag: "🇧🇷", elo: 2030 },
    { id: "MAR", name: "Morocco", flag: "🇲🇦", elo: 1920 },
    { id: "HAI", name: "Haiti", flag: "🇭🇹", elo: 1560 },
    { id: "SCO", name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", elo: 1760 },
  ],
  D: [
    { id: "USA", name: "United States", flag: "🇺🇸", elo: 1830 },
    { id: "PAR", name: "Paraguay", flag: "🇵🇾", elo: 1790 },
    { id: "AUS", name: "Australia", flag: "🇦🇺", elo: 1760 },
    { id: "TUR", name: "Türkiye", flag: "🇹🇷", elo: 1830 },
  ],
  E: [
    { id: "GER", name: "Germany", flag: "🇩🇪", elo: 1950 },
    { id: "CUW", name: "Curaçao", flag: "🇨🇼", elo: 1600 },
    { id: "CIV", name: "Ivory Coast", flag: "🇨🇮", elo: 1750 },
    { id: "ECU", name: "Ecuador", flag: "🇪🇨", elo: 1870 },
  ],
  F: [
    { id: "NED", name: "Netherlands", flag: "🇳🇱", elo: 1990 },
    { id: "JPN", name: "Japan", flag: "🇯🇵", elo: 1880 },
    { id: "SWE", name: "Sweden", flag: "🇸🇪", elo: 1750 },
    { id: "TUN", name: "Tunisia", flag: "🇹🇳", elo: 1720 },
  ],
  G: [
    { id: "BEL", name: "Belgium", flag: "🇧🇪", elo: 1900 },
    { id: "EGY", name: "Egypt", flag: "🇪🇬", elo: 1740 },
    { id: "IRN", name: "Iran", flag: "🇮🇷", elo: 1790 },
    { id: "NZL", name: "New Zealand", flag: "🇳🇿", elo: 1590 },
  ],
  H: [
    { id: "ESP", name: "Spain", flag: "🇪🇸", elo: 2180 },
    { id: "CPV", name: "Cape Verde", flag: "🇨🇻", elo: 1580 },
    { id: "KSA", name: "Saudi Arabia", flag: "🇸🇦", elo: 1660 },
    { id: "URU", name: "Uruguay", flag: "🇺🇾", elo: 1920 },
  ],
  I: [
    { id: "FRA", name: "France", flag: "🇫🇷", elo: 2050 },
    { id: "SEN", name: "Senegal", flag: "🇸🇳", elo: 1820 },
    { id: "IRQ", name: "Iraq", flag: "🇮🇶", elo: 1650 },
    { id: "NOR", name: "Norway", flag: "🇳🇴", elo: 1900 },
  ],
  J: [
    { id: "ARG", name: "Argentina", flag: "🇦🇷", elo: 2150 },
    { id: "ALG", name: "Algeria", flag: "🇩🇿", elo: 1760 },
    { id: "AUT", name: "Austria", flag: "🇦🇹", elo: 1850 },
    { id: "JOR", name: "Jordan", flag: "🇯🇴", elo: 1640 },
  ],
  K: [
    { id: "POR", name: "Portugal", flag: "🇵🇹", elo: 2010 },
    { id: "COD", name: "DR Congo", flag: "🇨🇩", elo: 1640 },
    { id: "UZB", name: "Uzbekistan", flag: "🇺🇿", elo: 1670 },
    { id: "COL", name: "Colombia", flag: "🇨🇴", elo: 1940 },
  ],
  L: [
    { id: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", elo: 2090 },
    { id: "CRO", name: "Croatia", flag: "🇭🇷", elo: 1930 },
    { id: "GHA", name: "Ghana", flag: "🇬🇭", elo: 1700 },
    { id: "PAN", name: "Panama", flag: "🇵🇦", elo: 1700 },
  ],
};

const ALL_TEAMS = {};
Object.entries(GROUPS).forEach(([g, teams]) =>
  teams.forEach((t) => (ALL_TEAMS[t.id] = { ...t, group: g }))
);

// Official fixture pattern per group (index into the 4-team array):
// MD1: 1v2, 3v4 · MD2: 4v2, 1v3 · MD3: 4v1, 2v3
// (verified against Groups A–F official schedule)
const FIXTURE_PATTERN = [
  { md: 1, pairs: [[0, 1], [2, 3]] },
  { md: 2, pairs: [[3, 1], [0, 2]] },
  { md: 3, pairs: [[3, 0], [1, 2]] },
];

const STAGES = ["r32", "r16", "qf", "sf", "final", "champ"];
const STAGE_LABELS = {
  r32: "Round of 32",
  r16: "Round of 16",
  qf: "Quarterfinal",
  sf: "Semifinal",
  final: "Final",
  champ: "Champion",
};

// ── Probability engine ─────────────────────────
function winProb(eloA, eloB) {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

function lambdas(a, b) {
  const p = winProb(a.elo, b.elo);
  return [Math.max(0.2, 0.2 + 2.2 * p), Math.max(0.2, 0.2 + 2.2 * (1 - p))];
}

function poissonPmf(lambda, k) {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / f;
}

// Analytical W/D/L + most likely scoreline (no sampling needed)
function matchOutcome(a, b) {
  const [lA, lB] = lambdas(a, b);
  const MAX = 9;
  let pW = 0,
    pD = 0,
    pL = 0,
    best = { ga: 0, gb: 0, p: -1 };
  for (let ga = 0; ga <= MAX; ga++) {
    const pa = poissonPmf(lA, ga);
    for (let gb = 0; gb <= MAX; gb++) {
      const p = pa * poissonPmf(lB, gb);
      if (ga > gb) pW += p;
      else if (ga === gb) pD += p;
      else pL += p;
      if (p > best.p) best = { ga, gb, p };
    }
  }
  return { pW, pD, pL, best };
}

function poisson(lambda) {
  const L = Math.exp(-lambda);
  let k = 0,
    p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function simMatch(a, b) {
  const [lA, lB] = lambdas(a, b);
  return [poisson(lA), poisson(lB)];
}

function simGroup(teams) {
  const tbl = teams.map((t) => ({ team: t, pts: 0, gd: 0, gf: 0 }));
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++) {
      const [gi, gj] = simMatch(tbl[i].team, tbl[j].team);
      tbl[i].gd += gi - gj;
      tbl[j].gd += gj - gi;
      tbl[i].gf += gi;
      tbl[j].gf += gj;
      if (gi > gj) tbl[i].pts += 3;
      else if (gj > gi) tbl[j].pts += 3;
      else {
        tbl[i].pts += 1;
        tbl[j].pts += 1;
      }
    }
  tbl.sort(
    (x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || Math.random() - 0.5
  );
  return tbl;
}

function simKnockoutMatch(a, b) {
  const [ga, gb] = simMatch(a, b);
  if (ga !== gb) return ga > gb ? a : b;
  const p = 0.5 + (winProb(a.elo, b.elo) - 0.5) * 0.4;
  return Math.random() < p ? a : b;
}

function seedOrder(n) {
  let order = [1];
  while (order.length < n) {
    const next = [];
    const m = order.length * 2;
    order.forEach((s) => next.push(s, m + 1 - s));
    order = next;
  }
  return order;
}
const SEED32 = seedOrder(32);

function buildKnockoutField() {
  const winners = [],
    runners = [],
    thirds = [];
  Object.values(GROUPS).forEach((teams) => {
    const tbl = simGroup(teams);
    winners.push(tbl[0]);
    runners.push(tbl[1]);
    thirds.push(tbl[2]);
  });
  thirds.sort(
    (x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || Math.random() - 0.5
  );
  const rankPool = (arr) =>
    [...arr].sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
  const seeded = [
    ...rankPool(winners),
    ...rankPool(runners),
    ...rankPool(thirds.slice(0, 8)),
  ].map((e) => e.team);
  return { seeded, groupTables: null };
}

function simulateTournament() {
  const reached = {};
  const { seeded } = buildKnockoutField();
  seeded.forEach((t) => (reached[t.id] = 0));

  let field = SEED32.map((s) => seeded[s - 1]);
  let stageIdx = 1;
  while (field.length > 1) {
    const next = [];
    for (let i = 0; i < field.length; i += 2)
      next.push(simKnockoutMatch(field[i], field[i + 1]));
    next.forEach((t) => (reached[t.id] = stageIdx));
    field = next;
    stageIdx++;
  }
  reached[field[0].id] = STAGES.length - 1;
  return { reached };
}

function simulateOneShot() {
  const log = { groups: {}, rounds: [], champion: null, final: null };
  const winners = [],
    runners = [],
    thirds = [];
  Object.entries(GROUPS).forEach(([g, teams]) => {
    const tbl = simGroup(teams);
    log.groups[g] = tbl;
    winners.push(tbl[0]);
    runners.push(tbl[1]);
    thirds.push(tbl[2]);
  });
  thirds.sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
  const rankPool = (arr) =>
    [...arr].sort((x, y) => y.pts - x.pts || y.gd - x.gd || y.gf - x.gf);
  const seeded = [
    ...rankPool(winners),
    ...rankPool(runners),
    ...rankPool(thirds.slice(0, 8)),
  ].map((e) => e.team);

  let field = SEED32.map((s) => seeded[s - 1]);
  const roundNames = [
    "Round of 32",
    "Round of 16",
    "Quarterfinal",
    "Semifinal",
    "Final",
  ];
  let r = 0;
  while (field.length > 1) {
    const matches = [];
    const next = [];
    for (let i = 0; i < field.length; i += 2) {
      const a = field[i],
        b = field[i + 1];
      const [ga, gb] = simMatch(a, b);
      let pen = false,
        w;
      if (ga === gb) {
        pen = true;
        const p = 0.5 + (winProb(a.elo, b.elo) - 0.5) * 0.4;
        w = Math.random() < p ? a : b;
      } else w = ga > gb ? a : b;
      matches.push({ a, b, ga, gb, pen, w });
      next.push(w);
    }
    log.rounds.push({ name: roundNames[r], matches });
    if (field.length === 2) log.final = matches[0];
    field = next;
    r++;
  }
  log.champion = field[0];
  return log;
}

// ── UI ─────────────────────────────────────────
const C = {
  pitch: "#0C2E20",
  pitchDeep: "#081F15",
  chalk: "#F3EFE4",
  chalkDim: "rgba(243,239,228,0.55)",
  line: "rgba(243,239,228,0.18)",
  gold: "#D9B45C",
  red: "#E8323F",
  away: "#7BA7BC",
  bar: "rgba(243,239,228,0.10)",
};

function pct(n, total) {
  if (!total) return 0;
  return (n / total) * 100;
}

function Bar({ value, color, height = 8 }) {
  return (
    <div
      style={{
        background: C.bar,
        height,
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, value)}%`,
          height: "100%",
          background: color,
          borderRadius: 2,
          transition: "width 600ms cubic-bezier(.22,1,.36,1)",
        }}
      />
    </div>
  );
}

function TriBar({ pW, pD, pL }) {
  return (
    <div
      style={{
        display: "flex",
        height: 8,
        borderRadius: 2,
        overflow: "hidden",
        background: C.bar,
      }}
    >
      <div style={{ width: `${pW * 100}%`, background: C.gold }} />
      <div style={{ width: `${pD * 100}%`, background: "rgba(243,239,228,0.28)" }} />
      <div style={{ width: `${pL * 100}%`, background: C.away }} />
    </div>
  );
}

function SectionTitle({ kicker, title }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          color: C.gold,
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: C.chalk,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
    </div>
  );
}

export default function WorldCupSimulator() {
  const [numSims, setNumSims] = useState(5000);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [oneShot, setOneShot] = useState(null);
  const [activeGroup, setActiveGroup] = useState("A");
  const [predGroup, setPredGroup] = useState("A");
  const [spotlightId, setSpotlightId] = useState("KOR");
  const [showAllOdds, setShowAllOdds] = useState(false);
  const cancelRef = useRef(false);

  const runSimulation = useCallback(async () => {
    setRunning(true);
    setProgress(0);
    setOneShot(null);
    cancelRef.current = false;

    const counts = {};
    Object.keys(ALL_TEAMS).forEach((id) => {
      counts[id] = { r32: 0, r16: 0, qf: 0, sf: 0, final: 0, champ: 0 };
    });

    const chunk = 250;
    let done = 0;
    while (done < numSims && !cancelRef.current) {
      const n = Math.min(chunk, numSims - done);
      for (let i = 0; i < n; i++) {
        const { reached } = simulateTournament();
        Object.entries(reached).forEach(([id, idx]) => {
          for (let s = 0; s <= idx; s++) counts[id][STAGES[s]]++;
        });
      }
      done += n;
      setProgress(done / numSims);
      await new Promise((r) => setTimeout(r, 0));
    }

    setResults({ counts, total: done });
    setRunning(false);
  }, [numSims]);

  const spotlight = ALL_TEAMS[spotlightId];
  const spotCounts = results ? results.counts[spotlightId] : null;

  const champOdds = results
    ? Object.entries(results.counts)
        .map(([id, c]) => ({
          team: ALL_TEAMS[id],
          p: pct(c.champ, results.total),
        }))
        .sort((a, b) => b.p - a.p)
    : [];
  const maxChamp = champOdds.length ? champOdds[0].p : 1;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${C.pitch} 0%, ${C.pitchDeep} 100%)`,
        color: C.chalk,
        fontFamily:
          "'Inter','Helvetica Neue',-apple-system,'Noto Sans KR',sans-serif",
        padding: "0 0 80px",
      }}
    >
      {/* ── Hero with chalk center circle ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "56px 20px 40px",
          borderBottom: `2px solid ${C.line}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            left: "50%",
            transform: "translateX(-50%)",
            width: 420,
            height: 420,
            border: `2px solid ${C.line}`,
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.3em",
              color: C.gold,
              fontWeight: 700,
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            WORLD CUP 26 · MONTE CARLO ENGINE
          </div>
          <h1
            style={{
              fontSize: "clamp(34px, 7vw, 54px)",
              fontWeight: 900,
              textAlign: "center",
              lineHeight: 1.05,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            AI World Cup
            <br />
            Simulator
          </h1>
          <p
            style={{
              textAlign: "center",
              color: C.chalkDim,
              fontSize: 14,
              maxWidth: 440,
              margin: "16px auto 28px",
              lineHeight: 1.6,
            }}
          >
            Every match of all 48 nations, simulated thousands of times.
            Elo-driven Poisson scoring model — title odds, group exits, and
            score predictions for all 72 group games.
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {[1000, 5000, 10000].map((n) => (
              <button
                key={n}
                onClick={() => setNumSims(n)}
                disabled={running}
                style={{
                  padding: "8px 16px",
                  borderRadius: 4,
                  border: `1px solid ${numSims === n ? C.gold : C.line}`,
                  background:
                    numSims === n ? "rgba(217,180,92,0.12)" : "transparent",
                  color: numSims === n ? C.gold : C.chalkDim,
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {n.toLocaleString()} runs
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={runSimulation}
              disabled={running}
              style={{
                padding: "14px 34px",
                borderRadius: 4,
                border: "none",
                background: running ? "rgba(217,180,92,0.4)" : C.gold,
                color: C.pitchDeep,
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: "0.06em",
                cursor: running ? "default" : "pointer",
              }}
            >
              {running
                ? `Simulating ${Math.round(progress * 100)}%`
                : "Run simulation"}
            </button>
            <button
              onClick={() => setOneShot(simulateOneShot())}
              disabled={running}
              style={{
                padding: "14px 22px",
                borderRadius: 4,
                border: `1px solid ${C.red}`,
                background: "transparent",
                color: C.red,
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Destiny mode
            </button>
          </div>

          {running && (
            <div style={{ maxWidth: 320, margin: "18px auto 0" }}>
              <Bar value={progress * 100} color={C.gold} height={4} />
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        {/* ── Match predictor (always available, analytical) ── */}
        <div style={{ marginTop: 40 }}>
          <SectionTitle
            kicker="GROUP STAGE PREDICTOR"
            title="Match-by-match predictions"
          />
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {Object.keys(GROUPS).map((g) => (
              <button
                key={g}
                onClick={() => setPredGroup(g)}
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 4,
                  border: `1px solid ${predGroup === g ? C.gold : C.line}`,
                  background:
                    predGroup === g ? "rgba(217,180,92,0.12)" : "transparent",
                  color: predGroup === g ? C.gold : C.chalkDim,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {FIXTURE_PATTERN.map(({ md, pairs }) => (
              <div key={md}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    color: C.chalkDim,
                    fontWeight: 700,
                    margin: "10px 0 8px",
                  }}
                >
                  MATCHDAY {md}
                </div>
                {pairs.map(([i, j]) => {
                  const a = GROUPS[predGroup][i];
                  const b = GROUPS[predGroup][j];
                  const { pW, pD, pL, best } = matchOutcome(a, b);
                  return (
                    <div
                      key={a.id + b.id}
                      style={{
                        border: `1px solid ${C.line}`,
                        borderRadius: 6,
                        padding: "14px 16px",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 10,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <span style={{ fontSize: 18 }}>{a.flag}</span>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {a.name}
                          </span>
                        </div>
                        <div
                          style={{
                            padding: "4px 12px",
                            border: `1px solid ${C.gold}`,
                            borderRadius: 4,
                            color: C.gold,
                            fontWeight: 900,
                            fontSize: 15,
                            fontVariantNumeric: "tabular-nums",
                            margin: "0 12px",
                            whiteSpace: "nowrap",
                          }}
                          title="Most likely score"
                        >
                          {best.ga} : {best.gb}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flex: 1,
                            minWidth: 0,
                            justifyContent: "flex-end",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {b.name}
                          </span>
                          <span style={{ fontSize: 18 }}>{b.flag}</span>
                        </div>
                      </div>
                      <TriBar pW={pW} pD={pD} pL={pL} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 6,
                          fontSize: 12,
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        <span style={{ color: C.gold, fontWeight: 700 }}>
                          {(pW * 100).toFixed(0)}% win
                        </span>
                        <span style={{ color: C.chalkDim }}>
                          {(pD * 100).toFixed(0)}% draw
                        </span>
                        <span style={{ color: C.away, fontWeight: 700 }}>
                          {(pL * 100).toFixed(0)}% win
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Destiny mode result ── */}
        {oneShot && (
          <div
            style={{
              marginTop: 36,
              border: `1px solid ${C.red}`,
              borderRadius: 6,
              padding: 22,
              background: "rgba(232,50,63,0.06)",
            }}
          >
            <SectionTitle kicker="ONE-SHOT DESTINY" title="In this universe…" />
            <div style={{ fontSize: 30, fontWeight: 900, marginBottom: 6 }}>
              {oneShot.champion.flag} {oneShot.champion.name} win it all
            </div>
            {oneShot.final && (
              <div
                style={{ color: C.chalkDim, fontSize: 14, marginBottom: 14 }}
              >
                Final: {oneShot.final.a.flag} {oneShot.final.a.name}{" "}
                <strong
                  style={{
                    color: C.chalk,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {oneShot.final.ga} : {oneShot.final.gb}
                </strong>{" "}
                {oneShot.final.b.name} {oneShot.final.b.flag}
                {oneShot.final.pen && " (penalties)"}
              </div>
            )}
            <SpotlightPath log={oneShot} team={spotlight} />
          </div>
        )}

        {/* ── Spotlight team card ── */}
        {results && spotCounts && (
          <div
            style={{
              marginTop: 36,
              border: `1px solid ${C.line}`,
              borderLeft: `4px solid ${C.red}`,
              borderRadius: 6,
              padding: 22,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              <SectionTitle
                kicker="TEAM SPOTLIGHT"
                title={`${spotlight.flag} ${spotlight.name} — stage odds`}
              />
              <select
                value={spotlightId}
                onChange={(e) => setSpotlightId(e.target.value)}
                style={{
                  background: C.pitchDeep,
                  color: C.chalk,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: "8px 10px",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {Object.values(ALL_TEAMS)
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (Group {t.group})
                    </option>
                  ))}
              </select>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              {STAGES.map((s) => {
                const v = pct(spotCounts[s], results.total);
                return (
                  <div
                    key={s}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 96,
                        fontSize: 13,
                        color: C.chalkDim,
                        fontWeight: 600,
                      }}
                    >
                      {STAGE_LABELS[s]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Bar value={v} color={C.red} />
                    </div>
                    <div
                      style={{
                        width: 56,
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {v.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Championship board ── */}
        {results && (
          <div style={{ marginTop: 44 }}>
            <SectionTitle kicker="CHAMPIONSHIP BOARD" title="Title odds" />
            <div style={{ display: "grid", gap: 10 }}>
              {(showAllOdds ? champOdds : champOdds.slice(0, 12)).map(
                (e, i) => (
                  <div
                    key={e.team.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 12px",
                      background:
                        i === 0 ? "rgba(217,180,92,0.08)" : "transparent",
                      borderRadius: 4,
                      border:
                        i === 0
                          ? `1px solid rgba(217,180,92,0.35)`
                          : "1px solid transparent",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        fontSize: 12,
                        color: C.chalkDim,
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 700,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ width: 26, fontSize: 18 }}>{e.team.flag}</div>
                    <div style={{ width: 120, fontWeight: 700, fontSize: 14 }}>
                      {e.team.name}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Bar
                        value={(e.p / maxChamp) * 100}
                        color={e.team.id === spotlightId ? C.red : C.gold}
                        height={6}
                      />
                    </div>
                    <div
                      style={{
                        width: 58,
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                        color: i === 0 ? C.gold : C.chalk,
                      }}
                    >
                      {e.p.toFixed(1)}%
                    </div>
                  </div>
                )
              )}
            </div>
            <button
              onClick={() => setShowAllOdds(!showAllOdds)}
              style={{
                marginTop: 14,
                background: "transparent",
                border: `1px solid ${C.line}`,
                color: C.chalkDim,
                padding: "8px 18px",
                borderRadius: 4,
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {showAllOdds ? "Collapse" : "Show all 48 nations"}
            </button>
          </div>
        )}

        {/* ── Group advancement odds ── */}
        {results && (
          <div style={{ marginTop: 44 }}>
            <SectionTitle
              kicker="GROUP STAGE"
              title="Round of 32 qualification odds"
            />
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {Object.keys(GROUPS).map((g) => (
                <button
                  key={g}
                  onClick={() => setActiveGroup(g)}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 4,
                    border: `1px solid ${activeGroup === g ? C.gold : C.line}`,
                    background:
                      activeGroup === g
                        ? "rgba(217,180,92,0.12)"
                        : "transparent",
                    color: activeGroup === g ? C.gold : C.chalkDim,
                    fontWeight: 800,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {GROUPS[activeGroup]
                .map((t) => ({
                  team: t,
                  p: pct(results.counts[t.id].r32, results.total),
                }))
                .sort((a, b) => b.p - a.p)
                .map((e) => (
                  <div
                    key={e.team.id}
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ width: 26, fontSize: 18 }}>{e.team.flag}</div>
                    <div style={{ width: 120, fontWeight: 700, fontSize: 14 }}>
                      {e.team.name}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Bar
                        value={e.p}
                        color={e.team.id === spotlightId ? C.red : C.chalk}
                        height={6}
                      />
                    </div>
                    <div
                      style={{
                        width: 58,
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: 14,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {e.p.toFixed(1)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!results && !running && !oneShot && (
          <div
            style={{
              marginTop: 48,
              textAlign: "center",
              color: C.chalkDim,
              fontSize: 14,
              lineHeight: 1.8,
            }}
          >
            Match predictions above are live. Run the simulation to unlock
            <br />
            title odds and stage-by-stage probabilities for all 48 nations.
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 20,
            borderTop: `1px solid ${C.line}`,
            fontSize: 12,
            color: C.chalkDim,
            lineHeight: 1.7,
          }}
        >
          Model: Elo ratings → Poisson goal distributions → Monte Carlo
          tournament simulation. Match predictions are computed analytically
          from the same model. Knockout bracket uses a seeding approximation.
          All figures are statistical estimates for entertainment — not
          guarantees, not betting advice.
        </div>
      </div>
    </div>
  );
}

function SpotlightPath({ log, team }) {
  const tbl = log.groups[team.group];
  const rank = tbl.findIndex((e) => e.team.id === team.id) + 1;
  const entry = tbl[rank - 1];

  const teamMatches = [];
  log.rounds.forEach((round) => {
    round.matches.forEach((m) => {
      if (m.a.id === team.id || m.b.id === team.id)
        teamMatches.push({ round: round.name, ...m });
    });
  });

  return (
    <div
      style={{
        borderTop: `1px solid rgba(232,50,63,0.3)`,
        paddingTop: 14,
        fontSize: 14,
        lineHeight: 1.8,
      }}
    >
      <div style={{ fontWeight: 800, marginBottom: 4, color: "#E8323F" }}>
        {team.flag} {team.name}'s journey
      </div>
      <div style={{ color: "rgba(243,239,228,0.7)" }}>
        Group {team.group}: finished {rank}
        {["st", "nd", "rd", "th"][Math.min(rank - 1, 3)]} ({entry.pts} pts, GD{" "}
        {entry.gd >= 0 ? "+" : ""}
        {entry.gd}){teamMatches.length === 0 && " — eliminated in groups"}
      </div>
      {teamMatches.map((m, i) => {
        const isA = m.a.id === team.id;
        const opp = isA ? m.b : m.a;
        const gT = isA ? m.ga : m.gb;
        const gO = isA ? m.gb : m.ga;
        const won = m.w.id === team.id;
        return (
          <div key={i} style={{ color: "rgba(243,239,228,0.85)" }}>
            {m.round}: vs {opp.flag} {opp.name}{" "}
            <strong style={{ fontVariantNumeric: "tabular-nums" }}>
              {gT}:{gO}
            </strong>
            {m.pen && " (pens)"} →{" "}
            <span
              style={{
                color: won ? "#D9B45C" : "rgba(243,239,228,0.5)",
                fontWeight: 700,
              }}
            >
              {won ? "through" : "out"}
            </span>
          </div>
        );
      })}
    </div>
  );
}