import { motion } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];

export function Reveal({ children, delay = 0, y = 28, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({ index, tag, title, sub }) {
  return (
    <div className="mb-14 max-w-3xl">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] text-lime">
          // {index} SEC_{tag} <span className="text-mute">[{index.slice(0, 2)} / 07]</span>
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">{title}</h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="mt-5 text-lg text-mute">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 md:py-32 ${className}`}>
      {children}
    </section>
  );
}

export function Corners() {
  const c = 'absolute h-4 w-4 border-lime';
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </div>
  );
}

export function Btn({ href, onClick, children, variant = 'solid', ...rest }) {
  const base =
    'inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-medium uppercase tracking-[0.14em] transition-colors';
  const styles = {
    solid: 'bg-lime text-ink hover:bg-white',
    ghost: 'border border-line text-white hover:border-cobalt hover:bg-cobalt/15 hover:text-white',
  };
  const Tag = href ? motion.a : motion.button;
  return (
    <Tag
      href={href}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles[variant]}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
