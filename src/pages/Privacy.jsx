const C = { dim: "rgba(243,239,228,0.85)", gold: "#D9B45C", chalk: "#F3EFE4" };

const SECTIONS = [
  {
    h: "Overview",
    p: [
      "This Privacy Policy explains how WC26 Sim (\"we\", \"this site\") handles information when you visit. WC26 Sim is a statistical simulation tool and content site; we do not require accounts, and we do not ask you to submit personal information to use any feature.",
      "Last updated: June 2026.",
    ],
  },
  {
    h: "Information We Collect",
    p: [
      "We do not directly collect names, email addresses, or other personal identifiers. Simulation results are computed entirely in your browser and are not transmitted to or stored on our servers.",
      "Like most websites, our hosting provider and analytics tools may automatically receive standard technical data such as IP address, browser type, device type, pages visited, and referring URLs. This data is used in aggregate to understand site traffic and improve the experience.",
    ],
  },
  {
    h: "Cookies and Advertising",
    p: [
      "We use Google AdSense to display advertising, which is how this free site is supported. Google and its partners use cookies — including the DoubleClick cookie — to serve ads based on your prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites on the Internet.",
      "You may opt out of personalized advertising by visiting Google's Ads Settings at https://adssettings.google.com. You can also opt out of some third-party vendors' use of cookies for personalized advertising at https://www.aboutads.info.",
      "Where required by law (including in the European Economic Area and the UK), a consent banner will ask for your permission before advertising cookies are set, and you may withdraw consent at any time.",
    ],
  },
  {
    h: "Analytics",
    p: [
      "We use Google Analytics to measure aggregate site usage (page views, approximate geography, device types). Google Analytics uses cookies and collects data in accordance with Google's Privacy Policy, available at https://policies.google.com/privacy. We do not use analytics data to identify individual visitors.",
    ],
  },
  {
    h: "Third-Party Links",
    p: [
      "Pages on this site may link to external websites. We are not responsible for the privacy practices or content of third-party sites, and we encourage you to review their policies.",
    ],
  },
  {
    h: "Children's Privacy",
    p: [
      "This site is general-audience sports content and is not directed at children under 13. We do not knowingly collect personal information from children.",
    ],
  },
  {
    h: "Changes to This Policy",
    p: [
      "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.",
    ],
  },
  {
    h: "Contact",
    p: [
      "For privacy-related questions, contact us at ysj3090@gmail.com.",
    ],
  },
];

export default function Privacy() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 20px" }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 24, color: C.chalk }}>
        Privacy Policy
      </h1>
      {SECTIONS.map((s) => (
        <section key={s.h} style={{ marginBottom: 26 }}>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: C.gold, marginBottom: 10 }}>
            {s.h}
          </h2>
          {s.p.map((t, i) => (
            <p
              key={i}
              style={{ fontSize: 15, lineHeight: 1.85, color: C.dim, marginBottom: 12 }}
            >
              {t}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
