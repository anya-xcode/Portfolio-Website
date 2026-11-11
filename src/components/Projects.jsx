import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useTilt from '../hooks/useTilt.js';
import { siGithub } from 'simple-icons';
import { featured, projectFilters, projects } from '../data.js';
import { Btn, Reveal, Section, SectionHead, ease } from './ui.jsx';

const GitHubIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d={siGithub.path} /></svg>
);
const ArrowIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M7 17L17 7M8 7h9v9" />
  </svg>
);

function LinkPill({ href, children, solid, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
        solid ? 'bg-lime text-ink hover:bg-white' : 'border border-white/25 bg-ink/70 text-white backdrop-blur hover:border-lime hover:text-lime'
      }`}
    >
      {children}
    </a>
  );
}

function Chips({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-mute">{s}</li>
      ))}
    </ul>
  );
}

function ProjectCard({ p, onOpen }) {
  const { handlers, style, glare } = useTilt(9);
  return (
    <div className="h-full [perspective:1200px]">
      <motion.article
        {...handlers}
        style={style}
        className="group relative flex h-full flex-col rounded-2xl border border-line bg-panel transition-colors duration-300 hover:border-lime/40"
      >
        {/* screenshot */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl border-b border-line bg-charcoal">
          <img
            src={p.image}
            alt={`${p.name} screenshot`}
            width="1280"
            height="800"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-ink/70 px-3 py-1 font-mono text-[10px] tracking-widest text-lime backdrop-blur">
            #{p.id}
          </span>
        </div>

        {/* hover actions: float above the card in 3D */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 flex aspect-[16/10] items-center justify-center gap-3 opacity-0 transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
          style={{ transform: 'translateZ(60px)' }}
        >
          <div className="flex translate-y-3 gap-3 transition-transform duration-300 group-hover:translate-y-0">
            {p.live && <LinkPill href={p.live} solid label={`${p.name} live demo`}>Live Demo <ArrowIcon /></LinkPill>}
            {p.github && <LinkPill href={p.github} label={`${p.name} source on GitHub`}><GitHubIcon /> Repo</LinkPill>}
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-6" style={{ transform: 'translateZ(25px)' }}>
          <p className="font-mono text-[11px] tracking-widest text-mute">{p.category}</p>
          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight transition-colors group-hover:text-lime">{p.name}</h3>
          <p className="mt-3 flex-1 text-mute">{p.blurb}</p>
          <div className="mt-5"><Chips items={p.stack} /></div>
          <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={() => onOpen(p)}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:text-lime"
            >
              View details →
            </button>
            <div className="flex gap-2">
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} live demo`} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-lime hover:text-lime">
                  <ArrowIcon />
                </a>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer" aria-label={`${p.name} source on GitHub`} className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-mute transition-colors hover:border-lime hover:text-lime">
                  <GitHubIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.article>
    </div>
  );
}

/** Animated pipeline used as the featured project's visual (no screenshot exists for it). */
function FlowDiagram({ flow }) {
  return (
    <div className="relative flex h-full min-h-[260px] flex-col justify-center gap-6 overflow-hidden rounded-2xl border border-line bg-charcoal p-6 sm:p-8">
      <div className="grid-bg absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-cobalt/30 blur-[80px]" aria-hidden="true" />
      <p className="relative font-mono text-[10px] uppercase tracking-[0.25em] text-mute">// Pipeline</p>
      <div className="relative">
        <div className="absolute left-[12.5%] right-[12.5%] top-1/2 h-px bg-line" aria-hidden="true" />
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 h-1.5 w-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent to-lime shadow-[0_0_12px_#c6ff1a]"
          initial={{ left: '10%' }}
          animate={{ left: ['10%', '82%'] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <ol className="relative grid grid-cols-4 gap-2 sm:gap-3">
          {flow.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.5, ease }}
              className="rounded-xl border border-line bg-ink/90 px-1.5 py-4 text-center"
            >
              <span className="block font-mono text-[10px] text-lime">0{i + 1}</span>
              <span className="mt-1 block font-mono text-[9px] uppercase leading-tight tracking-wider text-white sm:text-[10px]">{f}</span>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="relative flex flex-wrap gap-2">
        {['React', 'Node.js', 'MongoDB', 'LLM'].map((t) => (
          <span key={t} className="rounded-full bg-cobalt/20 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#9db2ff]">{t}</span>
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ onOpen }) {
  const { handlers, style, glare } = useTilt(4);
  const p = featured;
  return (
    <Reveal className="mb-10 [perspective:1600px]">
      <motion.article
        {...handlers}
        style={style}
        className="group relative grid gap-8 rounded-3xl border border-line bg-panel p-6 transition-colors hover:border-lime/40 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center"
      >
        <div style={{ transform: 'translateZ(30px)' }}>
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" /> Featured system · {p.category}
          </p>
          <h3 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">{p.name}</h3>
          <p className="mt-4 text-lg text-mute">{p.blurb}</p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-2 text-sm text-white"><span className="text-lime">▸</span>{pt}</li>
            ))}
          </ul>
          <div className="mt-6"><Chips items={p.stack} /></div>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Btn onClick={() => onOpen(p)} type="button">View Details →</Btn>
            <span className="font-mono text-[10px] uppercase tracking-widest text-mute">Source is private</span>
          </div>
        </div>
        <div style={{ transform: 'translateZ(50px)' }}>
          <FlowDiagram flow={p.flow} />
        </div>
        <motion.div aria-hidden="true" style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </motion.article>
    </Reveal>
  );
}

function Modal({ p, onClose }) {
  useEffect(() => {
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={p.name}
        initial={{ y: 60, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.4, ease }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl border border-line bg-panel sm:rounded-3xl"
      >
        {p.image ? (
          <div className="relative aspect-[16/9] overflow-hidden border-b border-line">
            <img src={p.image} alt={`${p.name} screenshot`} className="h-full w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
          </div>
        ) : (
          <div className="p-4 pb-0"><FlowDiagram flow={p.flow} /></div>
        )}
        <div className="p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <p className="font-mono text-[11px] tracking-widest text-lime">#{p.id} // {p.category}</p>
            <button type="button" onClick={onClose} autoFocus aria-label="Close details" className="font-mono text-xs uppercase tracking-widest text-mute hover:text-lime">
              Close ✕
            </button>
          </div>
          <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{p.name}</h3>
          <p className="mt-4 text-lg text-mute">{p.long}</p>

          <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">// Capabilities</h4>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-white"><span className="text-lime">▸</span> {pt}</li>
            ))}
          </ul>

          <h4 className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">// Stack</h4>
          <div className="mt-3"><Chips items={p.stack} /></div>

          <div className="mt-9 flex flex-wrap gap-3">
            {p.live && <LinkPill href={p.live} solid label={`${p.name} live demo`}>Live Demo <ArrowIcon /></LinkPill>}
            {p.github && <LinkPill href={p.github} label={`${p.name} source on GitHub`}><GitHubIcon /> View Repo</LinkPill>}
            {!p.github && !p.live && <p className="font-mono text-xs uppercase tracking-widest text-mute">Source and demo are not public.</p>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [sel, setSel] = useState(null);
  const [filter, setFilter] = useState('all');
  const shown = filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));
  const count = (id) => (id === 'all' ? projects.length : projects.filter((p) => p.tags.includes(id)).length);

  return (
    <Section id="projects">
      <SectionHead index="03.00" tag="PROJECTS" title="Flagship deployments" sub="Real products, live demos and source code. Hover a card to tilt it and open the links." />

      <FeaturedCard onOpen={setSel} />

      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {projectFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`relative rounded-full border px-4 py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              filter === f.id ? 'border-lime text-ink' : 'border-line text-white hover:border-cobalt hover:bg-cobalt/15'
            }`}
          >
            {filter === f.id && (
              <motion.span layoutId="proj-filter" className="absolute inset-0 rounded-full bg-lime" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <span className="relative">{f.label} <span className={filter === f.id ? 'text-ink/60' : 'text-mute'}>({count(f.id)})</span></span>
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.45, ease }}
            >
              <ProjectCard p={p} onOpen={setSel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>{sel && <Modal p={sel} onClose={() => setSel(null)} />}</AnimatePresence>
    </Section>
  );
}
