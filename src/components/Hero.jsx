import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { profile } from '../data.js';
import { Btn, Corners, ease } from './ui.jsx';

const PHRASES = ['AI-powered CRMs', 'RAG pipelines', 'AI agents', 'full-stack products'];

function Typewriter() {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = PHRASES[i];
    const t = setTimeout(
      () => {
        if (!del) {
          setText(full.slice(0, text.length + 1));
          if (text.length + 1 === full.length) setTimeout(() => setDel(true), 1200);
        } else {
          setText(full.slice(0, text.length - 1));
          if (text.length - 1 === 0) { setDel(false); setI((i + 1) % PHRASES.length); }
        }
      },
      del ? 35 : 70,
    );
    return () => clearTimeout(t);
  }, [text, del, i]);

  return (
    <span className="text-white">
      {text}
      <span className="caret text-lime">▍</span>
    </span>
  );
}

function ProfileVisual() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20 });
  const sy = useSpring(y, { stiffness: 120, damping: 20 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8]);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const chips = [
    { t: 'SYSTEM STATUS: ONLINE', cls: '-left-2 top-8 sm:-left-8', dot: true },
    { t: 'BUILDING: AI SYSTEMS', cls: '-right-2 top-1/2 sm:-right-8' },
    { t: 'MODE: FULL-STACK + AI', cls: 'bottom-8 -left-2 sm:-left-6' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md [perspective:1000px]" onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="relative aspect-[4/5] [transform-style:preserve-3d]">
        <div className="absolute inset-0 overflow-hidden rounded-3xl border border-line bg-charcoal">
          <img
            src="/images/profile.jpeg"
            alt="Portrait of Ananya Gupta"
            width="640"
            height="800"
            fetchPriority="high"
            className="h-full w-full object-cover object-top grayscale brightness-95 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cobalt/30 via-transparent to-transparent mix-blend-screen" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/90 to-transparent" />
          <div className="scanline absolute inset-x-0 top-0 h-10" aria-hidden="true" />
          <div className="absolute bottom-4 left-4 right-4 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-mute">
            <p>ID // AG-2026</p>
            <p className="text-white">Computer Science · AI &amp; ML</p>
          </div>
        </div>
        <Corners />

        {chips.map((c, k) => (
          <motion.div
            key={c.t}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
            transition={{ opacity: { delay: 1 + k * 0.2 }, scale: { delay: 1 + k * 0.2 }, y: { duration: 4 + k, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ translateZ: 50 }}
            className={`absolute flex items-center gap-2 border border-line bg-ink/80 px-3 py-2 font-mono text-[10px] tracking-widest backdrop-blur ${c.cls}`}
          >
            {c.dot && <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" />}
            {c.t}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="relative mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-20 pt-28 sm:px-8">
      <div className="grid w-full items-center gap-14 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-lime"
          >
            <span className="live-dot h-2 w-2 rounded-full bg-lime" />
            // PORTFOLIO · SOFTWARE ENGINEER INTERN
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1] tracking-tight">
            {['ANANYA', 'GUPTA.'].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1">
                <motion.span
                  className={`block ${i === 1 ? 'text-lime' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 font-mono text-xs tracking-[0.18em] text-lime sm:text-sm"
          >
            {profile.role}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7, ease }}
            className="mt-6 max-w-xl text-base text-mute"
          >
            “{profile.tagline}” I’m a Computer Science student specialising in AI &amp; ML, currently working as a
            Software Engineer Intern — building <Typewriter />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.7, ease }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Btn href="#projects">Explore Projects →</Btn>
            <Btn href="#contact" variant="ghost">Let’s Connect</Btn>
            <Btn href={profile.resume} variant="ghost" download>Resume ↓</Btn>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15 }}
            className="mt-8 flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-mute"
          >
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-lime">GitHub ↗</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-lime">LinkedIn ↗</a>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3, ease }}>
          <ProfileVisual />
        </motion.div>
      </div>
    </section>
  );
}
