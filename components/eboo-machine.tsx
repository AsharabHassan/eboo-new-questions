"use client";

/**
 * Custom HSW-branded EBOO machine — editorial vector illustration.
 *
 * Architecture follows a real EBOO unit but rendered in HSW's palette as
 * an object of beauty: brushed-navy body with gold trim, a luminous filter
 * cartridge on the left, a watch-face pump dial centre-right, an HSW
 * brand mark front-and-centre, and editorial status readouts.
 *
 * All animations are pure SVG (SMIL + transforms) for zero JS overhead.
 */
export function EbooMachine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 540"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HSW EBOO blood oxygenation machine"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Body fill — deep navy with subtle top sheen */}
        <linearGradient id="bodyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2B47" />
          <stop offset="30%" stopColor="#131A2C" />
          <stop offset="100%" stopColor="#0A0E18" />
        </linearGradient>
        <linearGradient id="bodyEdge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E4C97A" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#8E6F2A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#C9A347" stopOpacity="0.85" />
        </linearGradient>

        {/* Brushed-gold top band */}
        <linearGradient id="topBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6E5320" />
          <stop offset="20%" stopColor="#C9A347" />
          <stop offset="50%" stopColor="#E4C97A" />
          <stop offset="80%" stopColor="#C9A347" />
          <stop offset="100%" stopColor="#6E5320" />
        </linearGradient>

        {/* Face panel inset */}
        <linearGradient id="facePanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101728" />
          <stop offset="100%" stopColor="#070A12" />
        </linearGradient>

        {/* Filter cartridge — rouge liquid */}
        <linearGradient id="cartridgeLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a0a12" />
          <stop offset="30%" stopColor="#6B1D2E" />
          <stop offset="70%" stopColor="#9c2a45" />
          <stop offset="100%" stopColor="#2a0a12" />
        </linearGradient>
        <linearGradient id="cartridgeGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
        </linearGradient>

        {/* Pump dial gradients */}
        <radialGradient id="pumpDial" cx="0.5" cy="0.35">
          <stop offset="0%" stopColor="#F0DA9C" />
          <stop offset="40%" stopColor="#C9A347" />
          <stop offset="100%" stopColor="#4F3B16" />
        </radialGradient>
        <radialGradient id="pumpInner" cx="0.5" cy="0.4">
          <stop offset="0%" stopColor="#1A2540" />
          <stop offset="100%" stopColor="#070A12" />
        </radialGradient>
        <radialGradient id="pumpCore" cx="0.5" cy="0.5">
          <stop offset="0%" stopColor="#F5F1E8" />
          <stop offset="35%" stopColor="#C9A347" />
          <stop offset="100%" stopColor="#6E5320" stopOpacity="0" />
        </radialGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="softBloom">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Drop shadow */}
      <rect
        x="148" y="118" width="500" height="324" rx="6"
        fill="#000" opacity="0.5"
        transform="translate(0, 18)"
        filter="url(#softBloom)"
      />

      {/* ============ MAIN BODY ============ */}
      <rect
        x="148" y="118" width="500" height="324" rx="6"
        fill="url(#bodyFill)"
        stroke="url(#bodyEdge)"
        strokeWidth="1"
      />

      {/* Brushed gold top band */}
      <rect x="148" y="118" width="500" height="14" rx="5" fill="url(#topBand)" opacity="0.85" />
      <line x1="148" y1="132" x2="648" y2="132" stroke="#0B0F1A" strokeWidth="0.6" opacity="0.7" />

      {/* Gold hairlines top + bottom edges */}
      <line x1="158" y1="148" x2="638" y2="148" stroke="#C9A347" strokeWidth="0.4" opacity="0.5" />
      <line x1="158" y1="416" x2="638" y2="416" stroke="#C9A347" strokeWidth="0.4" opacity="0.5" />

      {/* Decorative screws */}
      {[[164, 124], [632, 124], [164, 436], [632, 436]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="#070A12" stroke="#C9A347" strokeWidth="0.5" />
          <line
            x1={x - 2} y1={y} x2={x + 2} y2={y}
            stroke="#C9A347" strokeWidth="0.5" opacity="0.7"
            transform={`rotate(${30 + i * 25}, ${x}, ${y})`}
          />
        </g>
      ))}

      {/* ============ BLOOD TUBES — INTERCONNECTED LOOPS ============
        Real EBOO machines: tubes loop between the cartridge and the body.
        Here:
          1. Cartridge BOTTOM ↔ machine body lower-left port (rouge — blood
             enters body and travels to the pump).
          2. Cartridge TOP ↔ machine body upper-left port (rouge — return
             from cartridge into body for ozonation).
          3. Body OUTPUT port (top-right) → off-frame top-right (gold —
             oxygenated blood back to the patient). This is the only tube
             extending into the atmosphere.
      */}

      {/* IN LOOP — Cartridge BOTTOM to machine body lower-left port */}
      <g>
        {/* Body lower-left port socket — sits on the body edge */}
        <circle cx="158" cy="380" r="11" fill="#0B0F1A" stroke="#C9A347" strokeWidth="1" />
        <circle cx="158" cy="380" r="9" fill="none" stroke="#C9A347" strokeWidth="0.4" opacity="0.5" />
        <circle cx="158" cy="380" r="5" fill="#6B1D2E" filter="url(#glow)">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="2.6s" repeatCount="indefinite" />
        </circle>
        {/* Tube halo */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#6B1D2E"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          opacity="0.22"
          filter="url(#softBloom)"
        />
        {/* Tube outer wall */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#1F2B47"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tube gold rim */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#C9A347"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Liquid rouge core */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#6B1D2E"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight stripe */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#9c2a45"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Flow dashes — scrolling toward body (rouge → body) */}
        <path
          d="M 92 462 C 92 480, 130 410, 158 380"
          stroke="#E4C97A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 16"
          opacity="0.8"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.8s" repeatCount="indefinite" />
        </path>
        {/* Connector sleeve at body port (visible gold collar where the tube plugs in) */}
        <rect x="148" y="374" width="14" height="12" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.6" />
      </g>

      {/* RETURN LOOP — Cartridge TOP back into machine body upper-left port */}
      <g>
        {/* Body upper-left port socket */}
        <circle cx="158" cy="180" r="11" fill="#0B0F1A" stroke="#C9A347" strokeWidth="1" />
        <circle cx="158" cy="180" r="9" fill="none" stroke="#C9A347" strokeWidth="0.4" opacity="0.5" />
        <circle cx="158" cy="180" r="5" fill="#6B1D2E" filter="url(#glow)">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="2.6s" repeatCount="indefinite" begin="-1.1s" />
        </circle>
        {/* Tube halo */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#6B1D2E"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
          opacity="0.18"
          filter="url(#softBloom)"
        />
        {/* Tube outer wall */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#1F2B47"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />
        {/* Tube gold rim */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#C9A347"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Liquid rouge core */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#6B1D2E"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight stripe */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#9c2a45"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.65"
        />
        {/* Flow dashes — rouge moving toward body */}
        <path
          d="M 92 84 C 92 60, 130 130, 158 180"
          stroke="#E4C97A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 16"
          opacity="0.75"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-36" dur="1.8s" repeatCount="indefinite" />
        </path>
        {/* Connector sleeve */}
        <rect x="148" y="174" width="14" height="12" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.6" />
      </g>

      {/* OUT tube is now drawn at the page level by <PatientEndpoints> so it
          extends all the way to the patient's right arm. The output port
          socket (drawn below) is what the tube visibly plugs into. */}

      {/* ============ FILTER CARTRIDGE (LEFT, prominent) ============ */}
      <g>
        {/* Bracket clamps */}
        <rect x="54" y="170" width="76" height="14" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.6" />
        <rect x="54" y="360" width="76" height="14" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.6" />
        <circle cx="64" cy="177" r="2.5" fill="#C9A347" opacity="0.7" />
        <circle cx="120" cy="177" r="2.5" fill="#C9A347" opacity="0.7" />
        <circle cx="64" cy="367" r="2.5" fill="#C9A347" opacity="0.7" />
        <circle cx="120" cy="367" r="2.5" fill="#C9A347" opacity="0.7" />

        {/* Cartridge top fitting */}
        <rect x="76" y="92" width="32" height="14" rx="3" fill="#1F2B47" stroke="#C9A347" strokeWidth="0.6" />
        <rect x="80" y="84" width="24" height="10" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.5" />

        {/* Cartridge bottom fitting */}
        <rect x="76" y="438" width="32" height="14" rx="3" fill="#1F2B47" stroke="#C9A347" strokeWidth="0.6" />
        <rect x="80" y="450" width="24" height="10" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.5" />

        {/* Cartridge glow halo */}
        <ellipse cx="92" cy="270" rx="34" ry="170" fill="#6B1D2E" opacity="0.35" filter="url(#softBloom)" />

        {/* Cartridge body */}
        <rect x="68" y="104" width="48" height="338" rx="22" fill="url(#cartridgeLiquid)" />
        <rect x="68" y="104" width="48" height="338" rx="22" fill="url(#cartridgeGlass)" />
        <rect x="68" y="104" width="48" height="338" rx="22" fill="none" stroke="#C9A347" strokeWidth="1" opacity="0.85" />
        {/* Inner reflection line */}
        <line x1="74" y1="120" x2="74" y2="425" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" />
        <line x1="112" y1="120" x2="112" y2="425" stroke="#ffffff" strokeWidth="0.5" opacity="0.15" />

        {/* Dialysis fibres — vertical strands */}
        <g opacity="0.45" stroke="#E4C97A" strokeWidth="0.35">
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={i} x1={73 + i * 4} y1="114" x2={73 + i * 4} y2="432" />
          ))}
        </g>

        {/* Animated particles inside — rouge rising, transmuting */}
        {Array.from({ length: 8 }).map((_, i) => {
          const startX = 76 + (i % 4) * 8;
          return (
            <circle key={i} r="1.6" fill="#E4C97A" filter="url(#glow)" opacity="0.95">
              <animate
                attributeName="cy"
                values="432;112;432"
                dur={`${6 + i * 0.4}s`}
                begin={`-${i * 0.7}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cx"
                values={`${startX};${startX + 4};${startX}`}
                dur={`${6 + i * 0.4}s`}
                begin={`-${i * 0.7}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.9;0.9;0"
                keyTimes="0;0.15;0.85;1"
                dur={`${6 + i * 0.4}s`}
                begin={`-${i * 0.7}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Cartridge engraved label, vertical */}
        <g transform="translate(92, 270) rotate(-90)">
          <text
            textAnchor="middle"
            fontFamily="Georgia, serif"
            fontWeight="500"
            fontSize="9"
            fill="#E4C97A"
            letterSpacing="3"
            opacity="0.9"
          >
            CT-1500 · DIALYSIS GRADE
          </text>
        </g>
      </g>

      {/* ============ FACE PANEL (centre) ============ */}
      <rect x="170" y="160" width="280" height="248" rx="3" fill="url(#facePanel)" stroke="#C9A347" strokeWidth="0.5" opacity="0.95" />
      {/* Inner inset hairline */}
      <rect x="174" y="164" width="272" height="240" rx="2" fill="none" stroke="#C9A347" strokeWidth="0.3" opacity="0.35" />

      {/* HSW brand mark — large, centered */}
      <g transform="translate(310, 220)" textAnchor="middle">
        <text
          fontFamily="Georgia, 'Fraunces', serif"
          fontWeight="700"
          fontSize="56"
          fill="#C9A347"
          letterSpacing="6"
        >
          HSW
        </text>
        <line x1="-50" y1="14" x2="50" y2="14" stroke="#C9A347" strokeWidth="0.5" opacity="0.7" />
        <text
          y="32"
          fontFamily="Georgia, serif"
          fontStyle="italic"
          fontSize="9"
          fill="#9C9586"
          letterSpacing="3"
        >
          Harley Street Wellness
        </text>
      </g>

      {/* Live waveform readout */}
      <g transform="translate(190, 280)">
        <text fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="2.5">FLOW</text>
        <text x="240" y="0" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#C9A347" letterSpacing="2" textAnchor="end">1.5 L · HR</text>
        {/* Waveform */}
        <polyline
          points="0,18 18,8 36,16 54,4 72,14 90,18 108,2 126,16 144,10 162,18 180,6 198,14 216,8 234,18 240,12"
          fill="none"
          stroke="#C9A347"
          strokeWidth="0.8"
          opacity="0.75"
        >
          <animate
            attributeName="points"
            dur="4s"
            repeatCount="indefinite"
            values="
              0,18 18,8 36,16 54,4 72,14 90,18 108,2 126,16 144,10 162,18 180,6 198,14 216,8 234,18 240,12;
              0,14 18,18 36,4 54,16 72,8 90,14 108,18 126,2 144,16 162,8 180,18 198,6 216,14 234,10 240,18;
              0,18 18,8 36,16 54,4 72,14 90,18 108,2 126,16 144,10 162,18 180,6 198,14 216,8 234,18 240,12
            "
          />
        </polyline>
      </g>

      <g transform="translate(190, 322)">
        <text fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="2.5">O₃ DOSE</text>
        <text x="240" y="0" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#F5F1E8" letterSpacing="2" textAnchor="end">40 μg · mL</text>
        <line x1="0" y1="6" x2="240" y2="6" stroke="#C9A347" strokeWidth="0.3" opacity="0.35" />
      </g>

      <g transform="translate(190, 344)">
        <text fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="2.5">PRESSURE</text>
        <text x="240" y="0" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#F5F1E8" letterSpacing="2" textAnchor="end">112 mmHg</text>
        <line x1="0" y1="6" x2="240" y2="6" stroke="#C9A347" strokeWidth="0.3" opacity="0.35" />
      </g>

      <g transform="translate(190, 366)">
        <text fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="2.5">STATUS</text>
        <g transform="translate(218, -3)">
          <circle r="3" fill="#E4C97A" filter="url(#glow)">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
        <text x="240" y="0" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#C9A347" letterSpacing="2" textAnchor="end">ACTIVE</text>
      </g>

      {/* ============ PUMP DIAL (large, right side) ============ */}
      <g transform="translate(550, 280)">
        {/* Outer ring with tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 60;
          const isMajor = i % 5 === 0;
          const r1 = isMajor ? 76 : 80;
          const r2 = 84;
          const round = (n: number) => Math.round(n * 100) / 100;
          return (
            <line
              key={i}
              x1={round(Math.cos(angle) * r1)}
              y1={round(Math.sin(angle) * r1)}
              x2={round(Math.cos(angle) * r2)}
              y2={round(Math.sin(angle) * r2)}
              stroke={isMajor ? "#C9A347" : "#8E6F2A"}
              strokeWidth={isMajor ? 0.9 : 0.4}
              opacity={isMajor ? 0.85 : 0.4}
            />
          );
        })}

        {/* Numeric markers — every 90° */}
        {[
          { angle: -Math.PI / 2, label: "0" },
          { angle: 0, label: "90" },
          { angle: Math.PI / 2, label: "180" },
          { angle: Math.PI, label: "270" },
        ].map((m, i) => {
          const round = (n: number) => Math.round(n * 100) / 100;
          return (
            <text
              key={i}
              x={round(Math.cos(m.angle) * 70)}
              y={round(Math.sin(m.angle) * 70 + 3)}
              fontFamily="JetBrains Mono, monospace"
              fontSize="7"
              fill="#C9A347"
              textAnchor="middle"
              opacity="0.7"
            >
              {m.label}
            </text>
          );
        })}

        {/* Dial body — gold metallic */}
        <circle r="60" fill="url(#pumpDial)" stroke="#4F3B16" strokeWidth="1" />
        {/* Inset shadow */}
        <circle r="56" fill="none" stroke="#000" strokeWidth="0.6" opacity="0.5" />
        {/* Inner well */}
        <circle r="48" fill="url(#pumpInner)" stroke="#C9A347" strokeWidth="0.4" opacity="0.6" />
        {/* Core glow */}
        <circle r="36" fill="url(#pumpCore)" opacity="0.55">
          <animate attributeName="opacity" values="0.35;0.7;0.35" dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Rotating indicator */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0"
            to="360"
            dur="7s"
            repeatCount="indefinite"
          />
          <line x1="0" y1="0" x2="0" y2="-44" stroke="#F5F1E8" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="0" cy="-44" r="2.5" fill="#F5F1E8" filter="url(#glow)" />
          <line x1="0" y1="0" x2="0" y2="20" stroke="#C9A347" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </g>

        {/* Centre cap */}
        <circle r="8" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.7" />
        <circle r="3" fill="#C9A347" />

        {/* Label */}
        <text y="105" fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="3.5" textAnchor="middle">
          PUMP · 18 RPM
        </text>
        <text y="-100" fontFamily="Georgia, serif" fontStyle="italic" fontSize="9" fill="#C9A347" letterSpacing="2" textAnchor="middle" opacity="0.85">
          Circulation
        </text>
      </g>

      {/* ============ SWITCH BANK (top-right of body) ============ */}
      <g transform="translate(488, 168)">
        {[
          { x: 0, color: "#5fffd0", label: "O₂", delay: 0 },
          { x: 22, color: "#E4C97A", label: "O₃", delay: 0.4 },
          { x: 44, color: "#b8395a", label: "BL", delay: 0.8 },
        ].map((s) => (
          <g key={s.label}>
            <rect x={s.x - 7} y="0" width="14" height="22" rx="2" fill="#0A0E18" stroke="#C9A347" strokeWidth="0.6" />
            <circle cx={s.x} cy="11" r="3.5" fill={s.color} filter="url(#glow)">
              <animate
                attributeName="opacity"
                values="0.4;1;0.4"
                dur={`${2.2 + s.delay}s`}
                repeatCount="indefinite"
                begin={`${s.delay}s`}
              />
            </circle>
            <text x={s.x} y="34" fontFamily="JetBrains Mono, monospace" fontSize="6" fill="#9C9586" letterSpacing="1.5" textAnchor="middle">
              {s.label}
            </text>
          </g>
        ))}
      </g>

      {/* ============ OUTPUT PORT — connector socket at top-right where OUT tube plugs in ============ */}
      <g transform="translate(628, 168)">
        {/* Socket ring */}
        <circle r="12" fill="#0B0F1A" stroke="#C9A347" strokeWidth="1" />
        <circle r="10" fill="none" stroke="#C9A347" strokeWidth="0.4" opacity="0.5" />
        {/* Inner gold core (the lit indicator) */}
        <circle r="6" fill="#C9A347" filter="url(#glow)">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="2.6s" repeatCount="indefinite" begin="-1.3s" />
        </circle>
        <circle r="2" fill="#F5F1E8" />
        <text x="-22" y="-18" fontFamily="JetBrains Mono, monospace" fontSize="6.5" fill="#9C9586" letterSpacing="2" textAnchor="middle">
          OUT · O₃ + O₂
        </text>
      </g>

      {/* ============ BOTTOM ENGRAVED PLATE ============ */}
      <g transform="translate(398, 430)" textAnchor="middle">
        <text fontFamily="JetBrains Mono, monospace" fontSize="7" fill="#9C9586" letterSpacing="4.5">
          EBOO · CT-1500 · EXTRACORPOREAL BLOOD OXYGENATION
        </text>
      </g>

      {/* Subtle ambient micro-vents top-left of body */}
      <g opacity="0.3" stroke="#C9A347" strokeWidth="0.3">
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={i} x1={158} y1={398 - i * 6} x2={175} y2={398 - i * 6} />
        ))}
      </g>
    </svg>
  );
}
