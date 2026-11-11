import { useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from 'framer-motion';

/**
 * Pointer-driven 3D tilt with a soft glare that follows the cursor.
 * Mouse only (touch keeps cards flat) and disabled for reduced motion.
 * Spread `handlers` on the element, apply `style`, and use `glare` as a background on an overlay.
 */
export default function useTilt(max = 10, glareColor = 'rgba(198,255,26,0.13)') {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const cfg = { stiffness: 180, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), cfg);
  const rotateX = useSpring(useTransform(py, [0, 1], [max * 0.8, -max * 0.8]), cfg);
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, ${glareColor}, transparent 45%)`;

  const handlers = reduce
    ? {}
    : {
        onPointerMove: (e) => {
          if (e.pointerType !== 'mouse') return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        },
        onPointerLeave: () => { px.set(0.5); py.set(0.5); },
      };

  return { handlers, style: reduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }, glare };
}
