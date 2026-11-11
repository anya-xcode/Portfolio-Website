import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Outlined rows that scroll behind the counter; alternate directions.
const ROWS = [
  { text: 'FULL STACK DEVELOPER · SOFTWARE DEVELOPER · ', dir: 'normal', dur: 22 },
  { text: 'WEB DEVELOPER · AI ENGINEER · FULL STACK · ', dir: 'reverse', dur: 18 },
  { text: 'SOFTWARE DEVELOPER · FULL STACK DEVELOPER · ', dir: 'normal', dur: 26 },
];

const DURATION = 2800;

// Full-screen intro: outlined marquee rows, a percentage counter and a glowing cobalt→lime bar.
export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduce ? 400 : DURATION;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min((now - start) / total, 1);
      // ease-in-out so it feels like assets are loading, not a linear timer
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setLeaving(true), 250);
    };
    raf = requestAnimationFrame(tick);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(raf); document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio, ${pct} percent`}
      initial={{ y: 0 }}
      animate={{ y: leaving ? '-100%' : 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leaving && onDone()}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#020308]"
    >
      {/* scrolling outlined text */}
      <div className="absolute inset-0 flex flex-col justify-center gap-[0.18em] font-display text-[clamp(3.25rem,9.5vw,8.5rem)] font-bold leading-[1.15]" aria-hidden="true">
        {ROWS.map((r, i) => (
          <div key={i} className="overflow-hidden whitespace-nowrap">
            <div className="loader-row flex w-max text-outline-loader" style={{ animationDirection: r.dir, animationDuration: `${r.dur}s` }}>
              <span>{r.text.repeat(3)}</span>
              <span>{r.text.repeat(3)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#020308_85%)]" aria-hidden="true" />

      {/* counter + bar */}
      <div className="relative w-[min(88vw,1000px)] text-center">
        <p className="font-display text-[clamp(3.5rem,9vw,6rem)] font-bold leading-none tabular-nums text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          {pct}<span className="text-lime">%</span>
        </p>
        <div className="mt-5 h-12 rounded-full border border-white/10 bg-[#0d1222]/95 p-[5px] shadow-[0_0_0_1px_rgba(34,80,255,0.12),0_20px_60px_rgba(0,0,0,0.6)] sm:h-14 sm:p-1.5">
          <div
            className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-cobalt via-[#3d8bff] to-lime shadow-[0_0_28px_rgba(34,80,255,0.75),0_0_60px_rgba(198,255,26,0.25)]"
            style={{ width: `${Math.max(pct, 4)}%` }}
          >
            <span className="loader-shine absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
            <span className="absolute inset-x-3 top-1 h-1/3 rounded-full bg-white/25 blur-[2px]" />
          </div>
        </div>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.35em] text-mute sm:text-sm">
          Loading environment<span className="caret">…</span>
        </p>
      </div>
    </motion.div>
  );
}
