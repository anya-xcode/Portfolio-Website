import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { nav, profile } from '../data.js';

export default function Nav() {
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', ...nav.map((n) => n.id)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-ink/70 backdrop-blur-xl">
      <motion.div style={{ scaleX: progress }} className="absolute inset-x-0 top-0 h-[2px] origin-left bg-lime" />
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          AG<span className="text-lime">.</span>
        </a>

        <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
          {nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:text-white ${active === n.id ? 'text-lime' : 'text-mute'}`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-mute sm:flex lg:hidden xl:flex">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" /> Available
          </span>
          <a
            href="#contact"
            className="hidden rounded-full border border-cobalt px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-lime transition-colors hover:bg-cobalt hover:text-white sm:block"
          >
            Connect →
          </a>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`h-px w-5 bg-white transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`h-px w-5 bg-white transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-ink lg:hidden"
          >
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-5 py-4 font-mono text-sm uppercase tracking-widest text-mute hover:text-lime"
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li>
              <a href={profile.resume} className="block px-5 py-4 font-mono text-sm uppercase tracking-widest text-lime">
                Resume ↓
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
