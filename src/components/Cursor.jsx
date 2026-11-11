import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const INTERACTIVE = 'a, button, [role="tab"], label, summary, [data-cursor]';
const TEXT = 'input, textarea, select, [contenteditable="true"]';

/**
 * Square reticle cursor: four lime corner brackets that trail the pointer, plus an exact dot.
 * Over links/buttons it turns 45° into a diamond and grows; it squeezes while pressed.
 * Only on fine pointers (mouse/trackpad) and when reduced motion is off — touch keeps the native behaviour.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState('idle'); // idle | hover | text
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 520, damping: 38, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 520, damping: 38, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target instanceof Element ? e.target : null;
      setMode(t?.closest(TEXT) ? 'text' : t?.closest(INTERACTIVE) ? 'hover' : 'idle');
    };
    const leave = () => setVisible(false);
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === 'hover' ? 46 : mode === 'text' ? 22 : 34;
  const corner = 'absolute h-[34%] w-[34%] border-lime';

  return (
    // difference blend: lime on dark backgrounds, inverts over light ones (e.g. a hovered white button)
    <div className="pointer-events-none fixed inset-0 z-[200] mix-blend-difference" aria-hidden="true">
      <motion.div className="absolute left-0 top-0" style={{ x: sx, y: sy }}>
        <motion.div
          className="absolute"
          animate={{
            width: size,
            height: size,
            x: -size / 2,
            y: -size / 2,
            rotate: mode === 'hover' ? 45 : 0,
            scale: down ? 0.78 : 1,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        >
          <span className={`${corner} left-0 top-0 rounded-tl-[3px] border-l-2 border-t-2`} />
          <span className={`${corner} right-0 top-0 rounded-tr-[3px] border-r-2 border-t-2`} />
          <span className={`${corner} bottom-0 left-0 rounded-bl-[3px] border-b-2 border-l-2`} />
          <span className={`${corner} bottom-0 right-0 rounded-br-[3px] border-b-2 border-r-2`} />
          {mode === 'hover' && <span className="absolute inset-[22%] bg-lime/10" />}
        </motion.div>
      </motion.div>

      {/* exact-position dot */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 bg-lime shadow-[0_0_10px_#c6ff1a]"
          animate={{ opacity: visible ? 1 : 0, scale: mode === 'text' ? 0.6 : 1, rotate: mode === 'hover' ? 45 : 0 }}
        />
      </motion.div>
    </div>
  );
}
