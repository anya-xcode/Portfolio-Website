import { motion } from 'framer-motion';
import { focusAreas } from '../data.js';
import { Reveal, Section, SectionHead } from './ui.jsx';

const MARQUEE = ['React', 'Node.js', 'MongoDB', 'Python', 'RAG', 'AI Agents', 'LLM Integration', 'REST APIs', 'Docker', 'Flutter', 'PostgreSQL'];

export default function About() {
  return (
    <>
      <div className="overflow-hidden border-y border-line bg-charcoal/60 py-4" aria-hidden="true">
        <div className="marquee flex w-max gap-10 font-mono text-xs uppercase tracking-[0.25em] text-mute">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m} <span className="text-lime">◆</span>
            </span>
          ))}
        </div>
      </div>

      <Section id="about">
        <SectionHead index="01.00" tag="ABOUT" title="Engineer profile & philosophy" />
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-lg leading-relaxed text-mute">
            <Reveal>
              <p>
                I’m a Computer Science student specialising in <span className="text-white">AI &amp; ML</span>, working
                at the intersection of full-stack engineering and applied AI. I enjoy taking an idea all the way from
                the interface to the model behind it.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                My focus is practical, production-oriented software: clean APIs, well-modelled data, and AI features
                that are grounded in real information rather than bolted on. That means React and Node.js on one side,
                and Python, LLMs, retrieval and agents on the other.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <blockquote className="border-l-2 border-lime pl-5 font-display text-2xl leading-snug text-white">
                Intelligent features are only as good as the systems underneath them.
              </blockquote>
            </Reveal>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {focusAreas.map((f, i) => (
              <Reveal key={f.k} delay={i * 0.08}>
                <motion.li whileHover={{ x: 8 }} className="group flex gap-5 py-6">
                  <span className="font-mono text-sm text-lime">{f.k}.</span>
                  <div>
                    <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-lime">{f.t}</h3>
                    <p className="mt-1 text-mute">{f.d}</p>
                  </div>
                </motion.li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>
    </>
  );
}
