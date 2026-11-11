import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { siGithub, siLeetcode, siCodeforces, siX } from 'simple-icons';
import { nav, profile } from '../data.js';

const Svg = ({ path, size = 16 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={path} /></svg>
);
// simple-icons no longer ships LinkedIn, so this is a plain "in" mark.
const LinkedInMark = () => <span className="font-display text-[15px] font-bold leading-none">in</span>;

const SOCIALS = [
  { label: 'GitHub', href: profile.github, icon: <Svg path={siGithub.path} /> },
  { label: 'LinkedIn', href: profile.linkedin, icon: <LinkedInMark /> },
  { label: 'LeetCode', href: profile.leetcode, icon: <Svg path={siLeetcode.path} /> },
  { label: 'Codeforces', href: profile.codeforces, icon: <Svg path={siCodeforces.path} /> },
  { label: 'X / Twitter', href: profile.twitter, icon: <Svg path={siX.path} size={14} /> },
];

function useIstClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const colHead = 'font-mono text-[11px] uppercase tracking-[0.22em] text-lime';
const linkCls = 'group inline-flex items-center gap-2 text-mute transition-colors hover:text-white';

export default function Footer() {
  const time = useIstClock();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line bg-[#03050b]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-lime/60 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-cobalt/15 blur-[120px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">
          {/* brand */}
          <div>
            <a href="#top" className="font-display text-3xl font-bold tracking-tight">
              Ananya<span className="text-lime"> Gupta.</span>
            </a>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-cobalt">AI Engineer // Full-Stack Developer</p>
            <p className="mt-5 max-w-sm text-mute">
              Building full-stack web applications and AI-powered systems with React, Node.js and Python. Always learning, always shipping.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/5 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-lime">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" /> Open to internships &amp; opportunities
            </div>
            <a href={`mailto:${profile.email}`} className="mt-5 block break-all font-display text-lg text-white transition-colors hover:text-lime">
              {profile.email}
            </a>
          </div>

          {/* explore */}
          <nav aria-label="Footer">
            <h4 className={colHead}>Explore</h4>
            <ul className="mt-5 space-y-3">
              {[{ id: 'top', label: 'Home' }, ...nav].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="group inline-flex items-center text-mute transition-colors hover:text-white">
                    <span className="h-px w-0 bg-lime transition-all duration-300 group-hover:mr-2 group-hover:w-4" />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* profiles */}
          <div>
            <h4 className={colHead}>Profiles</h4>
            <ul className="mt-5 space-y-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    <span className="flex w-4 justify-center">{s.icon}</span>
                    {s.label}
                    <span className="text-lime opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* resume */}
          <div>
            <h4 className={colHead}>Resume</h4>
            <div className="mt-5 space-y-3">
              {[
                { href: profile.resume, t: 'Full Stack', d: 'MERN & web development' },
                { href: profile.resumeAi, t: 'AI / ML', d: 'RAG, LangGraph & LLMs' },
              ].map((r) => (
                <a
                  key={r.t}
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel/70 p-4 transition-colors hover:border-lime/50"
                >
                  <span>
                    <strong className="block font-display text-white">{r.t} Resume</strong>
                    <small className="font-mono text-[11px] text-mute">{r.d}</small>
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-lime transition-all group-hover:border-lime group-hover:bg-lime group-hover:text-ink">↓</span>
                </a>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-lime hover:text-lime"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* status strip */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
          <span className="flex items-center gap-2"><span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" /> System status: online</span>
          <span>India · {time} IST</span>
          <span className="hidden sm:inline">Stack: React · Tailwind · Framer Motion</span>
        </div>
      </div>

      {/* giant wordmark: outline that fills with the brand gradient on hover */}
      <div className="group relative mx-auto max-w-[100rem] select-none px-3 pt-8" aria-hidden="true">
        <p className="text-outline whitespace-nowrap text-center font-display text-[13.5vw] font-bold leading-[0.8] tracking-tighter xl:text-[13rem]">
          ANANYA GUPTA
        </p>
        <p className="absolute inset-x-3 top-8 whitespace-nowrap bg-gradient-to-r from-cobalt via-[#4f7bff] to-lime bg-clip-text text-center font-display text-[13.5vw] font-bold leading-[0.8] tracking-tighter text-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 xl:text-[13rem]">
          ANANYA GUPTA
        </p>
      </div>

      {/* bottom bar */}
      <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 font-mono text-[11px] uppercase tracking-widest text-mute sm:flex-row sm:px-8">
        <p>© {year} Ananya Gupta. All rights reserved.</p>
        <p>Designed &amp; built with <span className="text-lime">♥</span> and a lot of coffee</p>
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          aria-label="Back to top"
          className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-white transition-colors hover:border-lime hover:text-lime"
        >
          Back to top <span aria-hidden="true">↑</span>
        </motion.button>
      </div>
    </footer>
  );
}
