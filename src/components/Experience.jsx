import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experience as x } from '../data.js';
import { Reveal, Section, SectionHead, ease } from './ui.jsx';

export default function Experience() {
  const [open, setOpen] = useState(true);

  return (
    <Section id="experience">
      <SectionHead index="02.00" tag="EXPERIENCE" title="Where I’m building now" sub="Shipping AI and full-stack features on a real product team." />

      <div className="relative pl-8 sm:pl-14">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease }}
          className="absolute bottom-0 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-lime via-cobalt-deep to-transparent sm:left-[15px]"
        />
        <span className="live-dot absolute left-0 top-2 h-4 w-4 rounded-full border-2 border-lime bg-ink sm:left-2" />

        <Reveal>
          <article className="overflow-hidden rounded-2xl border border-line bg-panel/80 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="exp-details"
              className="flex w-full flex-col gap-4 p-6 text-left sm:flex-row sm:items-start sm:justify-between sm:p-8"
            >
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-lime">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-lime" /> Current
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{x.role}</h3>
                <p className="mt-1 text-lg text-mute">{x.company}</p>
                <p className="mt-4 max-w-xl text-mute">{x.summary}</p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <span className="font-mono text-xs tracking-widest text-white">{x.period}</span>
                <motion.span animate={{ rotate: open ? 45 : 0 }} className="flex h-9 w-9 items-center justify-center border border-line font-mono text-lg text-lime" aria-hidden="true">
                  +
                </motion.span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id="exp-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-px border-t border-line bg-line sm:grid-cols-2">
                    {x.details.map((d, i) => (
                      <motion.li
                        key={d.t}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="bg-panel p-6 transition-colors hover:bg-charcoal"
                      >
                        <p className="font-mono text-[11px] text-lime">0{i + 1}</p>
                        <h4 className="mt-2 font-display text-lg font-semibold">{d.t}</h4>
                        <p className="mt-1 text-sm text-mute">{d.d}</p>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 border-t border-line p-6 sm:px-8">
                    {x.stack.map((s) => (
                      <span key={s} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-mute">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
