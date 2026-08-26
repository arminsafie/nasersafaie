type Props = {
  className?: string;
  flip?: boolean;
};

/**
 * A single hand-built branching hyphal line — the page's signature motif.
 * Echoes the way fungal mycelium (and the pathogens studied) spread and fork.
 * Colored entirely via currentColor / CSS so it inherits theme tokens.
 */
export default function Mycelium({ className = "", flip = false }: Props) {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
    >
      <path
        d="M0 30 C 120 30, 160 10, 260 18 C 340 24, 360 44, 430 40 C 500 36, 520 16, 600 30 C 680 44, 700 18, 780 22 C 860 26, 880 42, 960 34 C 1040 26, 1080 34, 1200 30"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <path
        d="M260 18 C 280 6, 300 2, 320 8"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <path
        d="M430 40 C 445 52, 465 56, 485 50"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <path
        d="M780 22 C 795 8, 815 4, 835 10"
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <circle cx="600" cy="30" r="2.5" fill="var(--rust)" />
      <circle cx="260" cy="18" r="2" fill="var(--navy-tint)" />
      <circle cx="960" cy="34" r="2" fill="var(--moss)" />
    </svg>
  );
}
