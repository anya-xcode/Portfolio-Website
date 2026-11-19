import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { openSource as os } from '../data.js';
import { Reveal, Section, SectionHead, ease } from './ui.jsx';

const KINDS = {
  merged: { label: 'Merged', sub: 'Landed upstream', verb: 'merged', color: '#c6ff1a', empty: 'Nothing merged yet.' },
  open: { label: 'In review', sub: 'Open with maintainers', verb: 'opened', color: '#6b8cff', empty: 'Nothing waiting on review right now.' },
};
const VISIBLE_PER_REPO = 3;

const Stroke = ({ size = 16, children }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const MergeIcon = ({ size }) => (
  <Stroke size={size}><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></Stroke>
);
const PrIcon = ({ size }) => (
  <Stroke size={size}><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><path d="M6 9v12" /></Stroke>
);
const ArrowIcon = () => (
  <Stroke size={14}><path d="M7 17L17 7M8 7h9v9" /></Stroke>
);
const ICONS = { merged: MergeIcon, open: PrIcon };

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const month = (d) => monthFmt.format(new Date(`${d}T00:00:00Z`));
const pad = (n) => String(n).padStart(2, '0');
// Long repo names (hacktoberfest-2025-frontend) should wrap at separators, not mid-word.
const breakable = (s) => s.split(/(?<=[-_])/).flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]));
const stars = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n));

/* ---------- live data from GitHub ----------
 * Which PRs show up is decided at runtime, so nothing in data.js needs editing:
 *  - only merged and open PRs are fetched (closed-unmerged ones never use up result slots)
 *  - a repo is shown when a GitHub *organization* owns it; personal repos (friends' and
 *    team projects) are hidden unless listed in `os.repos`, and `os.exclude` hides any repo
 *  - `os.repos` also supplies hand-written descriptions; stars and language come from GitHub
 */
const API = 'https://api.github.com';
const META_KEY = 'os-repo-meta-v1'; // per-repo owner type / stars / language, refreshed daily
const META_TTL = 24 * 60 * 60 * 1000;
const LIVE_KEY = 'os-live-v1'; // last successful result, shown first on the next visit

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode / quota */ } },
};

// data.js keys may be typed in any casing; GitHub's casing wins when it is known.
const curated = Object.fromEntries(Object.entries(os.repos).map(([name, m]) => [name.toLowerCase(), { ...m, name }]));
const excluded = new Set((os.exclude ?? []).map((r) => r.toLowerCase()));
const snapshot = { prs: os.prs, repos: os.repos, date: os.snapshot };

const getJson = (url, signal) =>
  fetch(url, { signal, headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`GitHub ${r.status}`))));

async function searchPrs(state, signal) {
  const q = `author:${os.user} type:pr is:${state} -user:${os.user}`;
  const items = [];
  for (let page = 1; page <= 10; page++) { // the search API stops at 1,000 results
    const d = await getJson(`${API}/search/issues?q=${encodeURIComponent(q)}&per_page=100&page=${page}`, signal);
    if (d.incomplete_results) throw new Error('Incomplete GitHub result');
    items.push(...d.items);
    if (d.items.length < 100 || items.length >= d.total_count) break;
  }
  return items;
}

/** Owner type, stars and language per repo, cached for a day so repeat visits stay inside the rate limit. */
async function repoMeta(fullNames, signal) {
  const cache = store.get(META_KEY) ?? {};
  const now = Date.now();
  await Promise.all(fullNames.map(async (full) => {
    const key = full.toLowerCase();
    if (cache[key] && now - cache[key].at < META_TTL) return;
    try {
      const r = await getJson(`${API}/repos/${full}`, signal);
      cache[key] = { at: now, org: r.owner.type === 'Organization', name: r.full_name, about: r.description, stars: r.stargazers_count, lang: r.language };
    } catch (e) {
      if (e.name === 'AbortError') throw e; // otherwise keep any stale entry; resolveRepo decides without it
    }
  }));
  store.set(META_KEY, cache);
  return cache;
}

/** Display metadata for a repo, or null when it should stay hidden. */
function resolveRepo(full, live) {
  const key = full.toLowerCase();
  const c = curated[key];
  const l = live[key];
  if (excluded.has(key) || (!c && !l?.org)) return null; // personal repo, or ownership unknown
  return { name: l?.name ?? c.name, about: c?.about ?? l.about ?? '', stars: l?.stars ?? c?.stars, lang: l?.lang ?? c?.lang };
}

async function fetchLive(signal) {
  const [merged, open] = await Promise.all([searchPrs('merged', signal), searchPrs('open', signal)]);
  const items = [...merged, ...open];
  if (!items.length) throw new Error('Empty GitHub result');

  const fullName = (item) => item.repository_url.split('/repos/')[1];
  const live = await repoMeta([...new Set(items.map(fullName))], signal);
  const repos = {};
  const prs = [];
  for (const item of items) {
    const meta = resolveRepo(fullName(item), live);
    if (!meta) continue;
    repos[meta.name] = meta;
    const mergedAt = item.pull_request?.merged_at;
    prs.push({
      repo: meta.name,
      number: item.number,
      state: mergedAt ? 'merged' : 'open',
      date: (mergedAt || item.created_at).slice(0, 10),
      title: item.title.replace(/\s+/g, ' ').trim(),
    });
  }
  return { prs, repos, date: new Date().toISOString().slice(0, 10) };
}

/** Shows the last result this browser saw (or the data.js snapshot), then swaps in live data from GitHub. */
function usePullRequests() {
  const [data, setData] = useState(() => {
    const saved = store.get(LIVE_KEY);
    const usable = Array.isArray(saved?.prs) && saved.repos && /^\d{4}-\d{2}-\d{2}$/.test(saved.date ?? '');
    return { ...(usable ? saved : snapshot), status: 'syncing' };
  });

  useEffect(() => {
    const ctrl = new AbortController();
    fetchLive(ctrl.signal)
      .then((d) => { store.set(LIVE_KEY, d); setData({ ...d, status: 'live' }); })
      // Rate-limited or offline: keep what is on screen, just say how old it is.
      .catch((e) => { if (e.name !== 'AbortError') setData((s) => ({ ...s, status: 'cached' })); });
    return () => ctrl.abort();
  }, []);

  return data;
}

function groupByRepo(prs) {
  const groups = new Map();
  [...prs]
    .sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number)
    .forEach((p) => groups.set(p.repo, [...(groups.get(p.repo) ?? []), p]));
  return [...groups];
}

function Avatar({ owner }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-charcoal font-display text-sm font-semibold uppercase text-lime">
      {failed ? (
        owner[0]
      ) : (
        <img
          src={`https://github.com/${owner}.png?size=72`}
          alt=""
          width="36"
          height="36"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}
    </span>
  );
}

function PrRow({ p }) {
  const k = KINDS[p.state];
  const Icon = ICONS[p.state];
  return (
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease }}
      className="overflow-hidden"
    >
      <a
        href={`https://github.com/${p.repo}/pull/${p.number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.04]"
      >
        <span className="mt-0.5 shrink-0" style={{ color: k.color }}><Icon size={16} /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm leading-snug text-white/85 transition-colors group-hover:text-white">{p.title}</span>
          <span className="mt-1 block font-mono text-[11px] text-mute">
            #{p.number} · {k.verb} {month(p.date)}
          </span>
        </span>
        <span className="mt-0.5 shrink-0 text-lime opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowIcon />
        </span>
      </a>
    </motion.li>
  );
}

function RepoGroup({ repo, meta = {}, prs }) {
  const [expanded, setExpanded] = useState(false);
  const [owner, name] = repo.split('/');
  const hidden = prs.length - VISIBLE_PER_REPO;
  const shown = expanded ? prs : prs.slice(0, VISIBLE_PER_REPO);

  return (
    <li className="border-t border-line first:border-t-0">
      <div className="flex items-start gap-3 px-5 pt-5 sm:px-6">
        <Avatar owner={owner} />
        <div className="min-w-0 flex-1">
          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="break-words font-mono text-sm text-white transition-colors hover:text-lime"
          >
            <span className="text-mute">{owner}/</span><wbr />{breakable(name)}
          </a>
          <p className="mt-0.5 line-clamp-2 text-xs text-mute">
            {meta.about}
            {meta.lang && <span className="text-mute/70">{meta.about ? ' · ' : ''}{meta.lang}</span>}
          </p>
        </div>
        {/* hide tiny counts: a "★ 1" badge undersells more than it adds */}
        {meta.stars >= 10 && (
          <span className="shrink-0 font-mono text-[11px] text-mute" title={`${meta.stars.toLocaleString()} stars`}>
            ★ {stars(meta.stars)}
          </span>
        )}
      </div>

      <ul className="px-2 pb-3 pt-2 sm:px-3">
        <AnimatePresence initial={false}>
          {shown.map((p) => <PrRow key={p.number} p={p} />)}
        </AnimatePresence>
      </ul>

      {hidden > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((e) => !e)}
          className="mb-4 ml-5 font-mono text-[11px] uppercase tracking-[0.16em] text-mute transition-colors hover:text-lime sm:ml-6"
        >
          {expanded ? '− Show less' : `+ ${hidden} more in ${name}`}
        </button>
      )}
    </li>
  );
}

function Board({ kind, prs, repos }) {
  const k = KINDS[kind];
  const Icon = ICONS[kind];
  const groups = groupByRepo(prs);

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-panel/80 backdrop-blur-sm">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-charcoal/60 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full border"
            style={{ color: k.color, borderColor: `${k.color}55`, background: `${k.color}14` }}
          >
            <Icon size={18} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight">{k.label}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{k.sub}</p>
          </div>
        </div>
        <span className="font-display text-3xl font-semibold tabular-nums" style={{ color: k.color }}>{pad(prs.length)}</span>
      </header>

      {groups.length ? (
        <ul>{groups.map(([repo, list]) => <RepoGroup key={repo} repo={repo} meta={repos[repo]} prs={list} />)}</ul>
      ) : (
        <p className="px-6 py-8 text-sm text-mute">{k.empty}</p>
      )}
    </article>
  );
}

const STATUS = {
  syncing: () => ({ text: 'Syncing with GitHub…', dot: 'bg-mute' }),
  live: () => ({ text: 'Live from GitHub', dot: 'live-dot bg-lime' }),
  cached: (date) => ({ text: `Snapshot · ${month(date)}`, dot: 'bg-mute' }),
};

function Stat({ n, label, color }) {
  return (
    <div className="bg-panel px-5 py-5 sm:px-6">
      <p className="font-display text-3xl font-semibold tabular-nums" style={{ color }}>{pad(n)}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</p>
    </div>
  );
}

export default function OpenSource() {
  const { prs, repos, date, status } = usePullRequests();
  const merged = prs.filter((p) => p.state === 'merged');
  const open = prs.filter((p) => p.state === 'open');
  const repoCount = new Set(prs.map((p) => p.repo)).size;
  const s = STATUS[status](date);

  return (
    <Section id="open-source">
      <SectionHead
        index="04.00"
        tag="OPEN_SOURCE"
        title="Contributing upstream"
        sub="Pull requests to open-source projects I don’t own: what has landed, and what is with maintainers for review."
      />

      <Reveal>
        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4">
          <Stat n={merged.length} label="PRs merged" color={KINDS.merged.color} />
          <Stat n={open.length} label="In review" color={KINDS.open.color} />
          <Stat n={repoCount} label="Repositories" />
          <a
            href={`https://github.com/${os.user}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-center bg-panel px-5 py-5 transition-colors hover:bg-charcoal sm:px-6"
          >
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-mute" aria-live="polite">
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {s.text}
            </span>
            <span className="mt-2 flex items-center gap-1.5 font-mono text-sm text-white transition-colors group-hover:text-lime">
              @{os.user} <ArrowIcon />
            </span>
          </a>
        </div>
      </Reveal>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Reveal><Board kind="merged" prs={merged} repos={repos} /></Reveal>
        <Reveal delay={0.1}><Board kind="open" prs={open} repos={repos} /></Reveal>
      </div>
    </Section>
  );
}
