/**
 * Skeletal formulas as inline SVG. Each vertex and line end is a carbon,
 * hydrogens on carbon are implicit, heteroatoms are written out — the
 * conventions the "How to read a two-dimensional chemical structure" explainer
 * walks through. Stroke and fill follow the text colour so they work on any
 * card. Wedges: a filled wedge is a bond toward the viewer, a hashed wedge is
 * one pointing away.
 */

type Props = { className?: string; title: string };

function Wedge({ from, to, id }: { from: [number, number]; to: [number, number]; id: string }) {
  // A filled triangle: narrow at `from`, wide at `to`.
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = (-dy / len) * 3.2;
  const ny = (dx / len) * 3.2;
  return <polygon id={id} points={`${x1},${y1} ${x2 + nx},${y2 + ny} ${x2 - nx},${y2 - ny}`} fill="currentColor" />;
}

function Hash({ from, to }: { from: [number, number]; to: [number, number] }) {
  // Hashed wedge: short perpendicular strokes that widen toward `to`.
  const [x1, y1] = from;
  const [x2, y2] = to;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = -dy / len;
  const uy = dx / len;
  const strokes = [];
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const t = i / n;
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;
    const w = 0.8 + 2.6 * t;
    strokes.push(<line key={i} x1={cx - ux * w} y1={cy - uy * w} x2={cx + ux * w} y2={cy + uy * w} />);
  }
  return <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">{strokes}</g>;
}

const bond = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const };
const label = { fontFamily: "var(--font-geist-sans), system-ui, sans-serif", fontSize: 11, fill: "currentColor" };

/** H2N–CH2–COOH. Formula C2H5NO2. */
export function GlycineStructure({ className, title }: Props) {
  return (
    <svg viewBox="0 0 140 84" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      {/* N–Cα */}
      <line x1="34" y1="46" x2="56" y2="33" {...bond} />
      {/* Cα–C */}
      <line x1="56" y1="33" x2="78" y2="46" {...bond} />
      {/* C=O */}
      <line x1="78" y1="46" x2="78" y2="22" {...bond} />
      <line x1="83" y1="44" x2="83" y2="24" {...bond} />
      {/* C–OH */}
      <line x1="78" y1="46" x2="100" y2="33" {...bond} />
      <text x="30" y="50" textAnchor="end" {...label}>
        H<tspan baselineShift="sub" fontSize="8">2</tspan>N
      </text>
      <text x="80" y="17" textAnchor="middle" {...label}>O</text>
      <text x="104" y="36" {...label}>OH</text>
    </svg>
  );
}

/** (CH3)2CH–CH2–CH(NH2)–COOH, (S) at C2. Formula C6H13NO2. */
export function LeucineStructure({ className, title }: Props) {
  return (
    <svg viewBox="0 0 170 104" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      {/* isopropyl: CH3–CH(–CH3)– */}
      <line x1="14" y1="40" x2="34" y2="52" {...bond} />
      <line x1="34" y1="52" x2="34" y2="76" {...bond} />
      {/* Cγ–Cβ */}
      <line x1="34" y1="52" x2="54" y2="40" {...bond} />
      {/* Cβ–Cα */}
      <line x1="54" y1="40" x2="74" y2="52" {...bond} />
      {/* Cα–C(carboxyl) */}
      <line x1="74" y1="52" x2="94" y2="40" {...bond} />
      {/* C=O */}
      <line x1="94" y1="40" x2="94" y2="16" {...bond} />
      <line x1="99" y1="38" x2="99" y2="18" {...bond} />
      {/* C–OH */}
      <line x1="94" y1="40" x2="114" y2="52" {...bond} />
      {/* Cα–NH2, toward the viewer */}
      <Wedge id="leu-nh2" from={[74, 52]} to={[74, 76]} />
      <text x="74" y="92" textAnchor="middle" {...label}>
        NH<tspan baselineShift="sub" fontSize="8">2</tspan>
      </text>
      <text x="96" y="11" textAnchor="middle" {...label}>O</text>
      <text x="118" y="56" {...label}>OH</text>
    </svg>
  );
}

/** CH3–CH2–CH(CH3)–CH(NH2)–COOH, (S) at C2 and C3. Formula C6H13NO2. */
export function IsoleucineStructure({ className, title }: Props) {
  return (
    <svg viewBox="0 0 170 104" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      {/* sec-butyl: CH3–CH2–CH(–CH3)– */}
      <line x1="14" y1="40" x2="34" y2="52" {...bond} />
      <line x1="34" y1="52" x2="54" y2="40" {...bond} />
      {/* Cβ–CH3, pointing away from the viewer */}
      <Hash from={[54, 40]} to={[54, 16]} />
      {/* Cβ–Cα */}
      <line x1="54" y1="40" x2="74" y2="52" {...bond} />
      {/* Cα–C(carboxyl) */}
      <line x1="74" y1="52" x2="94" y2="40" {...bond} />
      {/* C=O */}
      <line x1="94" y1="40" x2="94" y2="16" {...bond} />
      <line x1="99" y1="38" x2="99" y2="18" {...bond} />
      {/* C–OH */}
      <line x1="94" y1="40" x2="114" y2="52" {...bond} />
      {/* Cα–NH2, toward the viewer */}
      <Wedge id="ile-nh2" from={[74, 52]} to={[74, 76]} />
      <text x="74" y="92" textAnchor="middle" {...label}>
        NH<tspan baselineShift="sub" fontSize="8">2</tspan>
      </text>
      <text x="96" y="11" textAnchor="middle" {...label}>O</text>
      <text x="118" y="56" {...label}>OH</text>
    </svg>
  );
}

/** A formula with subscripted counts, e.g. C6H13NO2. */
export function Formula({ children, className }: { children: string; className?: string }) {
  const parts = children.match(/[A-Z][a-z]?|\d+/g) ?? [children];
  return (
    <span className={className}>
      {parts.map((p, i) => (/^\d+$/.test(p) ? <sub key={i}>{p}</sub> : <span key={i}>{p}</span>))}
    </span>
  );
}
