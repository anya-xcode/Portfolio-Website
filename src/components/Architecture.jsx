import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { layers } from '../data.js';
import { Section, SectionHead, ease } from './ui.jsx';

export default function Architecture() {
  const [sel, setSel] = useState(0);
  const L = layers[sel];

  const onKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); setSel((s) => Math.min(s + 1, layers.length - 1)); }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
  };

  return (
    <Section id="architecture">
      <SectionHead index="06.00" tag="ARCHITECTURE" title="How I build systems" sub="Click a layer to inspect its purpose." />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div role="tablist" aria-label="System layers" aria-orientation="vertical" onKeyDown={onKey} className="relative">
          {layers.map((l, i) => {
            const on = i === sel;
            return (
              <div key={l.id} className="relative">
                <button
                  role="tab"
                  id={`tab-${l.id}`}
                  aria-selected={on}
                  aria-controls="layer-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                  className={`relative z-10 flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
                    on ? "border-lime bg-lime/10" : 'border-line bg-panel/80 hover:border-cobalt/50'
                  }`}
                >
                  <span className={`font-mono text-xs ${on ? 'text-lime' : 'text-mute'}`}>{l.id}</span>
                  <span className="font-display text-lg font-semibold">{l.name}</span>
                  {on && <motion.span layoutId="layer-dot" className="live-dot ml-auto h-2 w-2 rounded-full bg-lime" />}
                </button>
                {i < layers.length - 1 && (
                  <svg className="mx-auto block h-7 w-4" viewBox="0 0 4 28" aria-hidden="true">
                    <line x1="2" y1="0" x2="2" y2="28" stroke={i < sel ? '#c6ff1a' : '#2a3350'} strokeWidth="2" strokeDasharray="4 4" className="flow" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        <div className="relative min-h-[320px] rounded-2xl border border-line bg-panel/80 p-7 sm:p-10 lg:sticky lg:top-24 lg:self-start">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div
              key={L.id}
              id="layer-panel"
              role="tabpanel"
              aria-labelledby={`tab-${L.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease }}
            >
              <p className="font-mono text-[11px] tracking-[0.2em] text-lime">{L.tag}</p>
              <h3 className="mt-4 font-display text-4xl font-semibold">{L.name}</h3>
              <p className="mt-5 text-lg leading-relaxed text-mute">{L.d}</p>
              <ul className="mt-8 flex flex-wrap gap-2">
                {L.tech.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white">{t}</li>
                ))}
              </ul>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-mute">
                Flow: Frontend → API → Services → Database → AI / LLM
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
