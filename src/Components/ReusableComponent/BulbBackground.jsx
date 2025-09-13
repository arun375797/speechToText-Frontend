import { useMemo } from "react";

/** tiny deterministic rng so bulbs don't reshuffle on every render */
function rng(seed) {
  let t = seed + 1;
  return () => (t = Math.imul(48271, t) % 0x7fffffff) / 0x7fffffff;
}

/**
 * Glowing bulbs that drift/pulse gently.
 * - fixed, pointer-events-none, z-0 (content sits above at z-10)
 * - mix-blend: screen to glow on black
 */
export default function BulbBackground({ count = 14, seed = 7 }) {
  const bulbs = useMemo(() => {
    const r = rng(seed);
    const palette = [
      "#6366F1", // indigo-500
      "#A855F7", // purple-500
      "#22D3EE", // cyan-400
      "#F472B6", // pink-400
      "#F59E0B", // amber-500
      "#10B981", // emerald-500
      "#60A5FA", // blue-400
    ];
    // fewer bulbs on small screens for perf
    const isSmall =
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 640px)").matches;
    const n = isSmall ? Math.max(8, Math.floor(count * 0.6)) : count;

    return Array.from({ length: n }, (_, i) => ({
      top: 5 + r() * 90,      // % of viewport
      left: 5 + r() * 90,     // % of viewport
      size: 70 + r() * 150,   // px
      color: palette[i % palette.length],
      dur: 18 + r() * 16,     // seconds
      delay: -r() * 20,       // negative delay to desync starts
      tx: (r() * 40 - 20) + "px", // small wander vector
      ty: (r() * 40 - 20) + "px",
    }));
  }, [count, seed]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="bulb"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            "--bulb-color": b.color,
            "--dur": `${b.dur}s`,
            animationDelay: `${b.delay}s`,
            "--tx": b.tx,
            "--ty": b.ty,
          }}
        />
      ))}
      {/* gentle vignette so UI stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0)_60%,rgba(0,0,0,.6)_100%)]" />
    </div>
  );
}
