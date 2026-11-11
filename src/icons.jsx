import {
  siReact, siJavascript, siTypescript, siTailwindcss, siHtml5, siCss, siFlutter,
  siNodedotjs, siExpress, siMongodb, siMysql, siPostgresql,
  siPython, siGit, siGithub, siDocker, siPostman,
} from 'simple-icons';

const brand = (i) => ({ kind: 'brand', path: i.path, hex: `#${i.hex}` });
// Concepts have no logo, so they get simple stroke glyphs in the site palette.
const glyph = (d, hex = '#c6ff1a') => ({ kind: 'glyph', d, hex });

export const skillIcons = {
  'React.js': brand(siReact),
  JavaScript: brand(siJavascript),
  TypeScript: brand(siTypescript),
  'Tailwind CSS': brand(siTailwindcss),
  HTML5: brand(siHtml5),
  CSS3: brand(siCss),
  Flutter: brand(siFlutter),
  'Node.js': brand(siNodedotjs),
  'Express.js': brand(siExpress),
  MongoDB: brand(siMongodb),
  MySQL: brand(siMysql),
  PostgreSQL: brand(siPostgresql),
  Python: brand(siPython),
  Git: brand(siGit),
  GitHub: brand(siGithub),
  Docker: brand(siDocker),
  Postman: brand(siPostman),
  'REST APIs': glyph(['M8 3H7a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2 2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h1', 'M16 3h1a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2 2 2 0 0 0-2 2v4a2 2 0 0 1-2 2h-1']),
  'Machine Learning': glyph(['M5 6l7 6-7 6', 'M12 12l7-6', 'M12 12l7 6', 'M5 6v12', 'M19 6v12'], '#6b8cff'),
  'Generative AI': glyph(['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', 'M19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z']),
  RAG: glyph(['M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'M15.5 15.5L21 21', 'M7.5 9h6', 'M7.5 12h4'], '#6b8cff'),
  'AI Agents': glyph(['M6 8h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z', 'M12 4v4', 'M9 14h.01', 'M15 14h.01']),
  'LLM Integration': glyph(['M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.5-5.4A8.5 8.5 0 1 1 21 12z', 'M8.5 12h.01', 'M12 12h.01', 'M15.5 12h.01'], '#6b8cff'),
};

const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => v / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** Renders a skill's logo. `surface` = 'dark' lifts near-black brand colours to white so they stay visible. */
export function SkillIcon({ name, size = 22, surface = 'dark', color }) {
  const icon = skillIcons[name];
  if (!icon) return null;
  let fill = color || icon.hex;
  if (!color && surface === 'dark' && lum(icon.hex) < 0.12) fill = '#f4f4f5';
  if (!color && surface === 'light' && icon.kind === 'glyph') fill = '#2250ff';

  return icon.kind === 'brand' ? (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={fill} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={fill} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon.d.map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

export const brandColor = (name) => skillIcons[name]?.hex ?? '#c6ff1a';
