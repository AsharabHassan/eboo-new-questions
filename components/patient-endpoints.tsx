"use client";

/**
 * Patient endpoint overlay — a full-viewport SVG that draws:
 *   • LEFT arm illustration with an IV needle drawing venous blood
 *   • RIGHT arm illustration with an IV needle returning oxygenated blood
 *   • Long rouge tube: LEFT arm → off-frame → into machine area
 *   • Long gold tube: machine area → off-frame → RIGHT arm
 *
 * Tubes terminate at hardcoded viewport positions chosen to land where the
 * machine SVG's body ports render (approx. on a 1440x900 desktop and scaled
 * via preserveAspectRatio for other sizes).
 *
 * Sits behind the machine SVG (lower z-index) so the machine's connector
 * sockets appear on top, giving the visual impression of the tubes plugging
 * into the machine.
 */
export function PatientEndpoints() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1500 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <filter id="ep-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="ep-soft">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <linearGradient id="armSkin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F2B47" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#0B0F1A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#070A12" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="vein">
          <stop offset="0%" stopColor="#6B1D2E" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6B1D2E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ==================== LEFT ARM — VENOUS DRAW ==================== */}
      <g>
        {/* Editorial label */}
        <g transform="translate(40, 640)">
          <line x1="0" y1="0" x2="36" y2="0" stroke="#6B1D2E" strokeWidth="1" opacity="0.8" />
          <text x="0" y="-12" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#C9A347" letterSpacing="3" fontWeight="500">
            01 · VENOUS DRAW
          </text>
          <text x="0" y="20" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#9C9586" letterSpacing="2">
            PATIENT · LEFT ARM
          </text>
          <text x="0" y="36" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#6B6356" letterSpacing="1">
            Deoxygenated, residue-bearing
          </text>
        </g>

        {/* Forearm silhouette (horizontal, exits left edge of viewBox) */}
        <g transform="translate(0, 700)">
          {/* Soft skin tone shadow */}
          <path
            d="M -20 -40 Q 60 -45, 130 -40 Q 200 -38, 250 -28 L 250 0 Q 200 10 130 8 Q 60 5 -20 0 Z"
            fill="url(#armSkin)"
            opacity="0.7"
          />
          {/* Vein — visible under the skin */}
          <path
            d="M -20 -22 Q 60 -28, 140 -22 Q 200 -20, 240 -16"
            stroke="url(#vein)"
            strokeWidth="6"
            fill="none"
            opacity="0.65"
          />
          {/* IV needle entry point */}
          <circle cx="180" cy="-22" r="2" fill="#6B1D2E" filter="url(#ep-glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" />
          </circle>
          {/* IV needle — gold angled cannula */}
          <g transform="translate(180, -22) rotate(-32)">
            <rect x="0" y="-2.4" width="38" height="4.8" rx="1" fill="#C9A347" stroke="#6E5320" strokeWidth="0.6" />
            <rect x="32" y="-4.5" width="14" height="9" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.8" />
            <circle cx="39" cy="0" r="1.6" fill="#6B1D2E">
              <animate attributeName="opacity" values="0.55;1;0.55" dur="2.4s" repeatCount="indefinite" />
            </circle>
            {/* Catheter hub */}
            <rect x="46" y="-6" width="10" height="12" rx="1.5" fill="#1F2B47" stroke="#C9A347" strokeWidth="0.7" />
          </g>
          {/* IV insertion edge marker */}
          <line x1="178" y1="-26" x2="178" y2="-18" stroke="#C9A347" strokeWidth="0.5" opacity="0.5" />
        </g>
      </g>

      {/* ==================== ROUGE TUBE — LEFT ARM → MACHINE BODY ==================== */}
      <g>
        {/* The path: from IV catheter hub (around 240,684) → rises and right → meets
            the machine's left lower port (approx 700, 510 in this viewBox for desktop) */}
        {/* Outer halo */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#6B1D2E"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          opacity="0.18"
          filter="url(#ep-soft)"
        />
        {/* Outer wall */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#1F2B47"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        {/* Gold rim */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#C9A347"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          opacity="0.32"
        />
        {/* Rouge liquid core */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#6B1D2E"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Highlight stripe */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#9c2a45"
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Flow dashes — scrolling INTO machine */}
        <path
          d="M 248 684 C 360 700 480 620 580 480 C 600 450 610 420 618 393"
          stroke="#E4C97A"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 22"
          opacity="0.85"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2.2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ==================== GOLD TUBE — MACHINE → RIGHT ARM ==================== */}
      <g>
        {/* From machine body output port (approx 920, 340 in this viewBox) → up and right → into RIGHT arm IV (approx 1380, 220) */}
        {/* Halo */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#C9A347"
          strokeWidth="24"
          fill="none"
          strokeLinecap="round"
          opacity="0.26"
          filter="url(#ep-soft)"
        />
        {/* Wall */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#1F2B47"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
        />
        {/* Gold rim */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#C9A347"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Gold liquid core */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#C9A347"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        {/* Bright highlight */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#E4C97A"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Flow dashes — scrolling OUT */}
        <path
          d="M 971 234 C 1080 215 1200 220 1330 230"
          stroke="#F5F1E8"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="2 22"
          opacity="0.95"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-48" dur="2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ==================== RIGHT ARM — OXYGENATED RETURN ==================== */}
      <g>
        {/* Forearm silhouette (horizontal, exits right edge of viewBox) */}
        <g transform="translate(1340, 220)">
          <path
            d="M -100 -10 Q -40 -16 30 -16 Q 100 -16 180 -10 Q 230 -7 240 0 L 230 18 Q 160 24 100 22 Q 30 20 -100 18 Z"
            fill="url(#armSkin)"
            opacity="0.7"
          />
          {/* Vein */}
          <path
            d="M -100 0 Q -40 -4 30 -4 Q 100 -4 180 -2 Q 220 0 240 4"
            stroke="#C9A347"
            strokeWidth="6"
            fill="none"
            opacity="0.4"
          />
          {/* IV needle entry */}
          <circle cx="-30" cy="-2" r="2" fill="#E4C97A" filter="url(#ep-glow)">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.4s" repeatCount="indefinite" begin="-1.2s" />
          </circle>
          {/* IV needle — angled gold cannula going INTO the arm */}
          <g transform="translate(-30, -2) rotate(150)">
            <rect x="0" y="-2.4" width="38" height="4.8" rx="1" fill="#C9A347" stroke="#6E5320" strokeWidth="0.6" />
            <rect x="32" y="-4.5" width="14" height="9" rx="2" fill="#0B0F1A" stroke="#C9A347" strokeWidth="0.8" />
            <circle cx="39" cy="0" r="1.6" fill="#E4C97A">
              <animate attributeName="opacity" values="0.55;1;0.55" dur="2.4s" repeatCount="indefinite" begin="-1.2s" />
            </circle>
            <rect x="46" y="-6" width="10" height="12" rx="1.5" fill="#1F2B47" stroke="#C9A347" strokeWidth="0.7" />
          </g>
          <line x1="-32" y1="-7" x2="-32" y2="3" stroke="#C9A347" strokeWidth="0.5" opacity="0.5" />
        </g>

        {/* Editorial label */}
        <g transform="translate(1520, 280)" textAnchor="end">
          <line x1="-36" y1="0" x2="0" y2="0" stroke="#C9A347" strokeWidth="1" opacity="0.8" />
          <text y="-12" fontFamily="JetBrains Mono, monospace" fontSize="11" fill="#C9A347" letterSpacing="3" fontWeight="500">
            02 · OXYGENATED RETURN
          </text>
          <text y="20" fontFamily="JetBrains Mono, monospace" fontSize="10" fill="#9C9586" letterSpacing="2">
            PATIENT · RIGHT ARM
          </text>
          <text y="36" fontFamily="Georgia, serif" fontStyle="italic" fontSize="11" fill="#6B6356" letterSpacing="1">
            Cleaned, O₂ + O₃ enriched
          </text>
        </g>
      </g>
    </svg>
  );
}
