import { useState } from 'react';
import { motion } from 'framer-motion';
import { profile } from '../data.js';
import { Btn, Reveal, Section } from './ui.jsx';

const field =
  'w-full border border-line bg-ink/70 px-4 py-3 text-white placeholder:text-mute/60 transition-colors focus:border-lime focus:outline-none';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch { window.location.href = `mailto:${profile.email}`; }
  };

  // No backend: the form composes an email in the visitor's own mail client.
  const submit = (e) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = encodeURIComponent(`Portfolio enquiry from ${d.get('name')}`);
    const body = encodeURIComponent(`${d.get('message')}\n\n— ${d.get('name')} (${d.get('email')})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <Section id="contact">
      <p className="font-mono text-xs tracking-[0.2em] text-lime">// 07.00 SEC_CONTACT · DIRECT CONNECT</p>
      {/* The in-view trigger lives on the h2 (not the clipped lines), otherwise IntersectionObserver never sees them. */}
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        transition={{ staggerChildren: 0.12 }}
        className="mt-5 font-display text-[clamp(2rem,6vw,4.5rem)] font-bold uppercase leading-[1.05] tracking-tight"
      >
        {[["Let's build", ''], ['something', ''], ['intelligent.', 'text-outline']].map(([l, cls]) => (
          <span key={l} className="block overflow-hidden pb-1">
            <motion.span
              className={`block ${cls}`}
              variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {l}
            </motion.span>
          </span>
        ))}
      </motion.h2>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-panel/80 p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Email</p>
              <a href={`mailto:${profile.email}`} className="mt-2 block break-all font-display text-lg hover:text-lime sm:text-xl">
                {profile.email}
              </a>
              <button type="button" onClick={copy} className="mt-4 font-mono text-xs uppercase tracking-widest text-lime hover:text-white">
                {copied ? '✓ Copied to clipboard' : 'Copy email address'}
              </button>
              <span className="sr-only" role="status">{copied ? 'Email copied to clipboard' : ''}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-line bg-panel/80 p-6 font-mono text-xs uppercase tracking-widest transition-colors hover:border-lime hover:text-lime">
                LinkedIn ↗
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-line bg-panel/80 p-6 font-mono text-xs uppercase tracking-widest transition-colors hover:border-lime hover:text-lime">
                GitHub ↗
              </a>
            </div>
            <Btn href={profile.resume} download>Download Resume ↓</Btn>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-panel/80 p-6 sm:p-8">
            <div>
              <label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Name</label>
              <input id="name" name="name" required autoComplete="name" className={`${field} mt-2`} placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={`${field} mt-2`} placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="message" className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">Message</label>
              <textarea id="message" name="message" required rows={5} className={`${field} mt-2 resize-y`} placeholder="What are we building?" />
            </div>
            <Btn type="submit">Send Message →</Btn>
            <p role="status" className="font-mono text-[11px] text-mute">
              {sent ? 'Opening your email app to send this…' : 'Opens a pre-filled email in your mail app.'}
            </p>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
