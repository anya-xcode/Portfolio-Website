import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { skills } from '../data.js';
import { SkillIcon, brandColor } from '../icons.jsx';
import { Section, SectionHead, ease } from './ui.jsx';

// Cluster slots for the cubes (percent of the stage) and a size multiplier.
const SLOTS = [
  { x: 14, y: 6, s: 1.0, tx: -22, tz: 8 },
  { x: 50, y: 0, s: 0.82, tx: -14, tz: -10 },
  { x: 74, y: 20, s: 0.95, tx: -26, tz: 4 },
  { x: 4, y: 44, s: 0.8, tx: -18, tz: -6 },
  { x: 38, y: 34, s: 1.18, tx: -24, tz: 10 },
  { x: 70, y: 58, s: 0.84, tx: -12, tz: -8 },
  { x: 24, y: 70, s: 0.9, tx: -20, tz: 6 },
];

// Fake lighting: each face gets its own silver gradient so the cube reads as a solid.
const FACES = [
  { t: (h) => `translateZ(${h}px)`, bg: 'linear-gradient(145deg,#eef1f7,#aeb5c5)' },
  { t: (h) => `rotateY(180deg) translateZ(${h}px)`, bg: 'linear-gradient(145deg,#d9dde6,#9aa1b2)' },
  { t: (h) => `rotateY(90deg) translateZ(${h}px)`, bg: 'linear-gradient(145deg,#c9ced9,#8c93a5)' },
  { t: (h) => `rotateY(-90deg) translateZ(${h}px)`, bg: 'linear-gradient(145deg,#c9ced9,#8c93a5)' },
  { t: (h) => `rotateX(90deg) translateZ(${h}px)`, bg: 'linear-gradient(145deg,#f7f9fc,#c7cdd9)' },
  { t: (h) => `rotateX(-90deg) translateZ(${h}px)`, bg: 'linear-gradient(145deg,#9aa1b2,#6f7689)' },
];

function useIsSmall() {
  const [small, setSmall] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 639px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const on = () => setSmall(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return small;
}

function Cube({ name, slot, base, index }) {
  const size = Math.round(base * slot.s);
  const h = size / 2;
  return (
    <motion.div
      className="group absolute [transform-style:preserve-3d]"
      style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: size, height: size }}
      initial={{ opacity: 0, scale: 0.2, rotate: -40 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: [0, -12, 0] }}
      exit={{ opacity: 0, scale: 0.2, rotate: 40, transition: { duration: 0.3 } }}
      whileHover={{ scale: 1.18 }}
      transition={{
        opacity: { duration: 0.3, delay: index * 0.07 },
        scale: { type: 'spring', stiffness: 220, damping: 16, delay: index * 0.07 },
        rotate: { type: 'spring', stiffness: 180, damping: 18, delay: index * 0.07 },
        y: { duration: 4 + index * 0.6, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      <div
        className="cube3d relative h-full w-full [transform-style:preserve-3d] group-hover:[animation-play-state:paused]"
        style={{
          '--tx': `${slot.tx}deg`,
          '--tz': `${slot.tz}deg`,
          animationDuration: `${14 + index * 2.5}s`,
          animationDirection: index % 2 ? 'reverse' : 'normal',
          animationDelay: `${-index * 3}s`,
        }}
      >
        {FACES.map((f, i) => (
          <span
            key={i}
            className="absolute inset-0 flex items-center justify-center rounded-[14%] [backface-visibility:hidden]"
            style={{
              transform: f.t(h),
              background: f.bg,
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.4), inset 0 -8px 16px rgba(10,14,30,.18), inset 0 8px 14px rgba(255,255,255,.25)',
            }}
          >
            <SkillIcon name={name} size={Math.round(size * 0.48)} surface="light" />
          </span>
        ))}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-line bg-ink/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-lime opacity-0 transition-opacity group-hover:opacity-100">
        {name}
      </span>
    </motion.div>
  );
}

function CubeScene({ items }) {
  const small = useIsSmall();
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotY = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 90, damping: 18 });
  const rotX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 90, damping: 18 });

  return (
    <div
      className="relative mx-auto h-[340px] w-full max-w-[520px] sm:h-[460px] [perspective:1100px]"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => { px.set(0); py.set(0); }}
    >
      <div className="absolute inset-[10%] rounded-full bg-cobalt/25 blur-[90px]" aria-hidden="true" />
      <div className="absolute inset-x-[15%] bottom-0 h-10 rounded-[50%] bg-black/60 blur-2xl" aria-hidden="true" />
      <motion.div aria-hidden="true" className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: rotX, rotateY: rotY }}>
        <AnimatePresence>
          {items.slice(0, SLOTS.length).map((name, i) => (
            <Cube key={name} name={name} slot={SLOTS[i]} base={small ? 70 : 108} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function Skills() {
  const [tab, setTab] = useState(0);
  const g = skills[tab];

  return (
    <Section id="skills">
      <SectionHead
        index="04.00"
        tag="MATRIX"
        title="Technologies I work with"
        sub="The core tools I use to build interfaces, back-ends and AI systems, grouped by the layer they live in. Hover a cube to inspect it."
      />

      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div role="tablist" aria-label="Skill groups" className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <button
                key={s.id}
                role="tab"
                id={`skill-tab-${i}`}
                aria-selected={tab === i}
                aria-controls="skill-panel"
                onClick={() => setTab(i)}
                className={`relative rounded-full border px-5 py-2.5 font-display text-sm font-medium transition-colors ${
                  tab === i ? 'border-lime text-ink' : 'border-line text-white hover:border-cobalt hover:bg-cobalt/15'
                }`}
              >
                {tab === i && (
                  <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-full bg-lime" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                )}
                <span className="relative">{s.id}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.ul
              key={g.id}
              id="skill-panel"
              role="tabpanel"
              aria-labelledby={`skill-tab-${tab}`}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
              transition={{ staggerChildren: 0.05 }}
              className="mt-10 grid gap-x-6 gap-y-4 sm:grid-cols-2"
            >
              {g.items.map((s) => (
                <motion.li
                  key={s}
                  variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.4, ease }}
                  className="group flex items-center gap-4"
                  style={{ '--brand': brandColor(s) }}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-panel transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[var(--brand)] group-hover:shadow-[0_0_24px_-6px_var(--brand)]">
                    <SkillIcon name={s} size={22} />
                  </span>
                  <span className="font-display text-lg font-medium text-white/90 transition-colors group-hover:text-white">{s}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>

        <CubeScene items={g.items} />
      </div>
    </Section>
  );
}
