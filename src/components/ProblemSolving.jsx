import { motion } from 'framer-motion';
import { siCodeforces, siLeetcode, siGithub } from 'simple-icons';
import { platforms } from '../data.js';
import useTilt from '../hooks/useTilt.js';
import { Reveal, Section, SectionHead } from './ui.jsx';

// GitHub's brand colour is near-black, so it uses white on this dark UI.
const BRAND = {
  codeforces: { icon: siCodeforces, color: '#1F8ACB' },
  leetcode: { icon: siLeetcode, color: '#FFA116' },
  github: { icon: siGithub, color: '#f4f4f5' },
};

const Logo = ({ id, size }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
    <path d={BRAND[id].icon.path} />
  </svg>
);

function PlatformCard({ p, i }) {
  const { color } = BRAND[p.id];
  const { handlers, style, glare } = useTilt(8, `${color}22`);

  return (
    <Reveal delay={i * 0.1} className="h-full [perspective:1200px]">
      <motion.article
        {...handlers}
        style={{ ...style, '--brand': color }}
        className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-panel p-7 transition-colors duration-300 hover:border-[var(--brand)]/50"
      >
        {/* oversized watermark logo */}
        <span
          className="pointer-events-none absolute -bottom-10 -right-10 text-[var(--brand)] opacity-[0.05] transition-all duration-700 group-hover:-rotate-12 group-hover:scale-110 group-hover:opacity-[0.1]"
          aria-hidden="true"
        >
          <Logo id={p.id} size={210} />
        </span>

        <div className="relative flex items-start justify-between" style={{ transform: 'translateZ(30px)' }}>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-ink text-[var(--brand)] transition-all duration-300 group-hover:border-[var(--brand)] group-hover:shadow-[0_0_30px_-6px_var(--brand)]">
            <Logo id={p.id} size={26} />
          </span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-ink/80 px-3 py-1.5 font-mono text-[11px] text-white">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />@{p.handle}
          </span>
        </div>

        <div className="relative mt-7 flex flex-1 flex-col" style={{ transform: 'translateZ(20px)' }}>
          <p className="font-mono text-[10px] tracking-[0.22em] text-[var(--brand)]">{p.tag}</p>
          <h3 className="mt-2 font-display text-3xl font-semibold">{p.name}</h3>
          <p className="mt-1 truncate font-mono text-xs text-mute">{p.display}</p>

          <ul className="mt-6 flex-1 space-y-3">
            {p.points.map((pt) => (
              <li key={pt} className="flex items-center gap-3 text-white/90">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)] shadow-[0_0_8px_var(--brand)]" />
                {pt}
              </li>
            ))}
          </ul>

          <motion.a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View ${p.name} profile (@${p.handle})`}
            whileTap={{ scale: 0.97 }}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-lime py-3.5 font-mono text-xs font-medium uppercase tracking-[0.16em] text-ink shadow-[0_10px_30px_-10px_rgba(198,255,26,0.6)] transition-colors hover:bg-white"
          >
            View Profile
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17L17 7M8 7h9v9" />
            </svg>
          </motion.a>
        </div>

        <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.article>
    </Reveal>
  );
}

export default function ProblemSolving() {
  return (
    <Section id="problem-solving">
      <SectionHead
        index="05.00"
        tag="PROBLEM_SOLVING"
        title="Problem solving & open source"
        sub="Sharpening DSA through competitive programming, and writing real-world code in the open."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p, i) => (
          <PlatformCard key={p.id} p={p} i={i} />
        ))}
      </div>
    </Section>
  );
}
