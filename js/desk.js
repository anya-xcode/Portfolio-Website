/**
 * Interactive 3D Desk Scene
 * ---------------------------------------------------------------
 * A low-poly workspace built entirely from procedural geometry
 * (no model files). Every object on the desk is a door into a
 * section of the portfolio:
 *
 *   Laptop      -> Projects
 *   Notebook    -> Experience
 *   Sticky wall -> Skills
 *   Trophy      -> Problem Solving
 *   Coffee mug  -> About
 *   Phone       -> Contact
 *   Lamp        -> toggles the light (just for fun)
 *
 * Hover an object to see a label, click it to fly the camera in and
 * scroll to the matching section.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const isSmallScreen = window.innerWidth < 760;

const BRAND = {
    cyan: 0x00d2ff,
    purple: 0x9d50bb,
    green: 0x00ff88,
};

function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
}

function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

function shadowed(mesh, cast = true, receive = true) {
    mesh.castShadow = cast;
    mesh.receiveShadow = receive;
    return mesh;
}

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */

const MAT = {
    wood: new THREE.MeshStandardMaterial({ color: 0x2b1f18, roughness: 0.55, metalness: 0.05 }),
    woodEdge: new THREE.MeshStandardMaterial({ color: 0x1e1510, roughness: 0.6 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x1a1e26, roughness: 0.35, metalness: 0.8 }),
    darkPlastic: new THREE.MeshStandardMaterial({ color: 0x14171d, roughness: 0.5, metalness: 0.3 }),
    laptopBody: new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.35, metalness: 0.7 }),
    keycap: new THREE.MeshStandardMaterial({ color: 0x0f1218, roughness: 0.6, metalness: 0.2 }),
    paper: new THREE.MeshStandardMaterial({ color: 0xbfb49c, roughness: 0.9, envMapIntensity: 0.3 }),
    ceramic: new THREE.MeshStandardMaterial({ color: 0xd6d9de, roughness: 0.3, metalness: 0.05 }),
    coffee: new THREE.MeshStandardMaterial({ color: 0x2a1508, roughness: 0.2, metalness: 0.1 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xffc23d, roughness: 0.22, metalness: 0.95 }),
    marble: new THREE.MeshStandardMaterial({ color: 0x1b1d24, roughness: 0.3, metalness: 0.2 }),
    cork: new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: 1 }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0xa5583a, roughness: 0.8 }),
    soil: new THREE.MeshStandardMaterial({ color: 0x1c130d, roughness: 1 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x2ea86a, roughness: 0.7 }),
    leafDark: new THREE.MeshStandardMaterial({ color: 0x1f7f4d, roughness: 0.7 }),
    ledStrip: new THREE.MeshBasicMaterial({ color: BRAND.cyan }),
    shadowCatcher: new THREE.ShadowMaterial({ opacity: 0.45 }),
};

/* ------------------------------------------------------------------ */
/* Dynamic textures                                                    */
/* ------------------------------------------------------------------ */

/** Laptop screen: a tiny code editor that types itself. */
function createLaptopScreen() {
    const W = 640;
    const H = 400;
    const canvas = makeCanvas(W, H);
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;

    const lines = [
        [['const ', '#c678dd'], ['portfolio', '#e5c07b'], [' = ', '#abb2bf'], ['await ', '#c678dd'], ['build', '#61afef'], ['({', '#abb2bf']],
        [['  developer: ', '#abb2bf'], ["'Ananya Gupta'", '#98c379'], [',', '#abb2bf']],
        [['  stack: [', '#abb2bf'], ["'React'", '#98c379'], [', ', '#abb2bf'], ["'Node'", '#98c379'], [', ', '#abb2bf'], ["'MongoDB'", '#98c379'], ['],', '#abb2bf']],
        [['  ai: [', '#abb2bf'], ["'RAG'", '#98c379'], [', ', '#abb2bf'], ["'LangGraph'", '#98c379'], [', ', '#abb2bf'], ["'LLMs'", '#98c379'], ['],', '#abb2bf']],
        [['  projectsShipped: ', '#abb2bf'], ['10', '#d19a66'], [',', '#abb2bf']],
        [['  openToWork: ', '#abb2bf'], ['true', '#d19a66'], [',', '#abb2bf']],
        [['});', '#abb2bf']],
        [],
        [['// click me to view projects', '#5c6370']],
    ];

    const flat = [];
    lines.forEach((segs, li) => {
        segs.forEach(([text, color]) => {
            for (const ch of text) flat.push({ li, ch, color });
        });
        flat.push({ li, ch: '\n', color: null });
    });

    let cursor = 0;
    let pauseUntil = 0;
    let lastTick = 0;
    let flashUntil = 0;

    function draw(now) {
        // Background
        ctx.fillStyle = '#0d1117';
        ctx.fillRect(0, 0, W, H);

        // Title bar
        ctx.fillStyle = '#161b22';
        ctx.fillRect(0, 0, W, 44);
        ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(24 + i * 22, 22, 7, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.fillStyle = '#0d1117';
        roundRect(ctx, 110, 8, 190, 28, 6);
        ctx.fill();
        ctx.fillStyle = '#e6edf3';
        ctx.font = '600 15px Inter, system-ui, sans-serif';
        ctx.fillText('portfolio.ts', 132, 27);
        ctx.fillStyle = '#00d2ff';
        ctx.beginPath();
        ctx.arc(120, 22, 4, 0, Math.PI * 2);
        ctx.fill();

        // Gutter
        ctx.fillStyle = '#10151c';
        ctx.fillRect(0, 44, 52, H - 44 - 30);

        // Code
        ctx.font = '500 19px "JetBrains Mono", Consolas, "Courier New", monospace';
        const lineH = 30;
        const startY = 78;
        let x = 70;
        let li = 0;
        ctx.textBaseline = 'middle';

        // line numbers
        for (let i = 0; i < lines.length; i++) {
            ctx.fillStyle = '#3b4552';
            ctx.textAlign = 'right';
            ctx.fillText(String(i + 1), 40, startY + i * lineH);
        }
        ctx.textAlign = 'left';

        // active line highlight
        const activeLine = cursor < flat.length ? flat[cursor].li : lines.length - 1;
        ctx.fillStyle = 'rgba(0, 210, 255, 0.06)';
        ctx.fillRect(52, startY + activeLine * lineH - lineH / 2, W - 52, lineH);

        for (let i = 0; i < cursor && i < flat.length; i++) {
            const t = flat[i];
            if (t.ch === '\n') {
                li = t.li + 1;
                x = 70;
                continue;
            }
            ctx.fillStyle = t.color;
            ctx.fillText(t.ch, x, startY + t.li * lineH);
            x += ctx.measureText(t.ch).width;
        }

        // Cursor
        if (Math.floor(now / 500) % 2 === 0) {
            const cy = startY + Math.min(li, lines.length - 1) * lineH;
            ctx.fillStyle = '#00d2ff';
            ctx.fillRect(x + 1, cy - 11, 3, 22);
        }

        // Status bar
        ctx.fillStyle = '#00d2ff';
        ctx.fillRect(0, H - 30, W, 30);
        ctx.fillStyle = '#04121a';
        ctx.font = '600 14px Inter, system-ui, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText('✓  10+ projects shipped', 16, H - 15);
        ctx.textAlign = 'right';
        ctx.fillText('MERN  ·  Python  ·  AI/ML', W - 16, H - 15);
        ctx.textAlign = 'left';

        // Click flash
        if (now < flashUntil) {
            const a = (flashUntil - now) / 600;
            ctx.fillStyle = `rgba(0, 210, 255, ${0.35 * a})`;
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = `rgba(255,255,255,${a})`;
            ctx.font = '700 34px Outfit, Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Opening projects…', W / 2, H / 2);
            ctx.textAlign = 'left';
        }

        texture.needsUpdate = true;
    }

    return {
        texture,
        flash() {
            flashUntil = performance.now() + 700;
        },
        update(now) {
            if (now - lastTick > 45) {
                lastTick = now;
                if (now > pauseUntil) {
                    if (cursor < flat.length) {
                        cursor++;
                    } else {
                        pauseUntil = now + 4000;
                        setTimeout(() => {
                            cursor = 0;
                        }, 4000);
                    }
                }
                draw(now);
            } else if (now < flashUntil) {
                draw(now);
            }
        },
    };
}

/** Phone screen: a little contact app. */
function createPhoneScreen() {
    const W = 256;
    const H = 512;
    const canvas = makeCanvas(W, H);
    const ctx = canvas.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0e1a2a');
    g.addColorStop(1, '#1a0f2e');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Status bar
    ctx.fillStyle = '#e6edf3';
    ctx.font = '600 16px Inter, system-ui, sans-serif';
    ctx.fillText('9:41', 20, 32);
    ctx.textAlign = 'right';
    ctx.fillText('●●●  ▮', W - 20, 32);
    ctx.textAlign = 'left';

    // Avatar circle
    const cx = W / 2;
    const ay = 150;
    const rg = ctx.createRadialGradient(cx, ay, 10, cx, ay, 60);
    rg.addColorStop(0, '#00d2ff');
    rg.addColorStop(1, '#9d50bb');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, ay, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 44px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AG', cx, ay + 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 24px Outfit, Inter, sans-serif';
    ctx.fillText('Ananya Gupta', cx, 240);
    ctx.fillStyle = '#00d2ff';
    ctx.font = '500 15px Inter, system-ui, sans-serif';
    ctx.fillText('Full Stack Developer', cx, 268);

    // Buttons
    const btns = [
        ['✉', 'Email', '#00d2ff'],
        ['in', 'LinkedIn', '#0a66c2'],
        ['⌘', 'GitHub', '#9d50bb'],
    ];
    btns.forEach((b, i) => {
        const bx = 40 + i * 62;
        ctx.fillStyle = b[2];
        roundRect(ctx, bx, 305, 50, 50, 14);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '700 22px Inter, system-ui, sans-serif';
        ctx.fillText(b[0], bx + 25, 331);
        ctx.fillStyle = '#c9d1d9';
        ctx.font = '500 12px Inter, system-ui, sans-serif';
        ctx.fillText(b[1], bx + 25, 372);
    });

    ctx.fillStyle = '#00ff88';
    roundRect(ctx, 34, 410, W - 68, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#04121a';
    ctx.font = '700 17px Inter, system-ui, sans-serif';
    ctx.fillText('Say hi \u{1F44B}', cx, 435);

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    roundRect(ctx, cx - 40, H - 16, 80, 5, 3);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

/** Sticky note texture with a skill name written on it. */
function createStickyTexture(text, color, sub) {
    const S = 256;
    const canvas = makeCanvas(S, S);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, S, S);
    // subtle darker strip at top (glue line)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillRect(0, 0, S, 28);
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 40px Outfit, Inter, sans-serif';
    ctx.fillText(text, S / 2, S / 2 - (sub ? 10 : 0));
    if (sub) {
        ctx.font = '500 22px Inter, system-ui, sans-serif';
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        ctx.fillText(sub, S / 2, S / 2 + 34);
    }
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

/** Notebook cover texture. */
function createNotebookCover() {
    const W = 512;
    const H = 640;
    const canvas = makeCanvas(W, H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#123d4a';
    ctx.fillRect(0, 0, W, H);
    // elastic band
    ctx.fillStyle = '#0b2a33';
    ctx.fillRect(W - 70, 0, 22, H);
    // label
    ctx.fillStyle = '#f1e9d6';
    roundRect(ctx, 70, 200, 330, 200, 14);
    ctx.fill();
    ctx.fillStyle = '#123d4a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 46px Outfit, Inter, sans-serif';
    ctx.fillText('EXPERIENCE', W / 2 - 15, 265);
    ctx.font = '500 24px Inter, system-ui, sans-serif';
    ctx.fillStyle = '#365a63';
    ctx.fillText('Full Stack Intern', W / 2 - 15, 318);
    ctx.fillText('AssessHub · 2026', W / 2 - 15, 352);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

/** Notebook inside page texture. */
function createNotebookPage() {
    const W = 512;
    const H = 640;
    const canvas = makeCanvas(W, H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#cfc4aa';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(30,80,120,0.3)';
    ctx.lineWidth = 2;
    for (let y = 90; y < H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(W - 30, y);
        ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(220,60,60,0.5)';
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(80, H);
    ctx.stroke();
    ctx.fillStyle = '#1c2a33';
    ctx.font = '600 26px "Segoe Print", "Comic Sans MS", cursive';
    const notes = ['AssessHub — AI sales bot', 'Email ingestion pipeline', 'Node + MongoDB backends', 'Client knowledge bases', 'Ship. Learn. Repeat.'];
    notes.forEach((n, i) => ctx.fillText(n, 96, 82 + i * 80));
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

/* ------------------------------------------------------------------ */
/* Object builders                                                     */
/* ------------------------------------------------------------------ */

function buildDesk() {
    const g = new THREE.Group();

    const top = shadowed(new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.16, 2.8), MAT.wood));
    top.position.y = -0.08;
    g.add(top);

    // rounded-feel edge trim
    const trim = shadowed(new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.05, 2.9), MAT.woodEdge), true, false);
    trim.position.y = -0.17;
    g.add(trim);

    // LED strip under the front edge
    const led = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.025, 0.04), MAT.ledStrip);
    led.position.set(0, -0.2, 1.42);
    g.add(led);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.12, 2.0, 0.12);
    [
        [-3.0, -1.2],
        [3.0, -1.2],
        [-3.0, 1.2],
        [3.0, 1.2],
    ].forEach(([x, z]) => {
        const leg = shadowed(new THREE.Mesh(legGeo, MAT.metal));
        leg.position.set(x, -1.17, z);
        g.add(leg);
    });

    // Cross bar at the back
    const bar = shadowed(new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.08, 0.08), MAT.metal));
    bar.position.set(0, -1.9, -1.2);
    g.add(bar);

    // Shadow catcher "floor"
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 10), MAT.shadowCatcher);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.18;
    floor.receiveShadow = true;
    g.add(floor);

    // Soft glow disc under the desk (matches site accent)
    const glowCanvas = makeCanvas(256, 256);
    const gctx = glowCanvas.getContext('2d');
    const rg = gctx.createRadialGradient(128, 128, 10, 128, 128, 128);
    rg.addColorStop(0, 'rgba(0,210,255,0.35)');
    rg.addColorStop(0.5, 'rgba(0,210,255,0.08)');
    rg.addColorStop(1, 'rgba(0,210,255,0)');
    gctx.fillStyle = rg;
    gctx.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(11, 7),
        new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -2.17;
    g.add(glow);

    g.userData.emissives = [{ material: led.material, boost: 2.2 }];
    return g;
}

function buildLaptop(screen) {
    const g = new THREE.Group();

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.07, 1.45), MAT.laptopBody));
    base.position.y = 0.035;
    g.add(base);

    // Keyboard well
    const well = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.01, 0.62), MAT.darkPlastic);
    well.position.set(0, 0.072, -0.25);
    g.add(well);

    // Keys (instanced)
    const cols = 14;
    const rows = 5;
    const keyGeo = new THREE.BoxGeometry(0.095, 0.02, 0.095);
    const keys = new THREE.InstancedMesh(keyGeo, MAT.keycap, cols * rows);
    const m = new THREE.Matrix4();
    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            m.makeTranslation(-0.78 + c * 0.12, 0.085, -0.5 + r * 0.12);
            keys.setMatrixAt(i++, m);
        }
    }
    keys.instanceMatrix.needsUpdate = true;
    g.add(keys);

    // Spacebar
    const space = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.02, 0.095), MAT.keycap);
    space.position.set(0, 0.085, 0.1);
    g.add(space);

    // Trackpad
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.008, 0.38), MAT.darkPlastic);
    pad.position.set(0, 0.075, 0.45);
    g.add(pad);

    // Screen (hinged at the back edge)
    const hinge = new THREE.Group();
    hinge.position.set(0, 0.07, -0.72);
    hinge.rotation.x = -0.28;
    g.add(hinge);

    const lid = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.35, 0.05), MAT.laptopBody));
    lid.position.set(0, 0.675, 0);
    hinge.add(lid);

    const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.25, 0.01), MAT.darkPlastic);
    bezel.position.set(0, 0.675, 0.028);
    hinge.add(bezel);

    const display = new THREE.Mesh(
        new THREE.PlaneGeometry(1.92, 1.2),
        new THREE.MeshBasicMaterial({ map: screen.texture, toneMapped: false })
    );
    display.position.set(0, 0.675, 0.036);
    hinge.add(display);

    // Screen light spill onto the desk
    const spill = new THREE.PointLight(BRAND.cyan, 1.6, 3.5, 2);
    spill.position.set(0, 0.7, 0.4);
    hinge.add(spill);

    // Brand dot on the back of the lid
    const logo = new THREE.Mesh(new THREE.CircleGeometry(0.09, 24), new THREE.MeshBasicMaterial({ color: BRAND.cyan }));
    logo.position.set(0, 0.7, -0.026);
    logo.rotation.y = Math.PI;
    hinge.add(logo);

    g.userData.hinge = hinge;
    g.userData.spill = spill;
    g.userData.emissives = [{ material: display.material, boost: 1.6 }, { material: logo.material, boost: 1.8 }];
    return g;
}

function buildNotebook() {
    const g = new THREE.Group();

    const pages = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.12, 1.45), MAT.paper));
    pages.position.y = 0.06;
    g.add(pages);

    const pageTop = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.4), new THREE.MeshStandardMaterial({ map: createNotebookPage(), roughness: 0.95, envMapIntensity: 0.3 }));
    pageTop.rotation.x = -Math.PI / 2;
    pageTop.position.y = 0.121;
    g.add(pageTop);

    // Cover hinged on the left edge (-x)
    const hinge = new THREE.Group();
    hinge.position.set(-0.6, 0.125, 0);
    g.add(hinge);

    const cover = shadowed(
        new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 1.5), [
            new THREE.MeshStandardMaterial({ color: 0x123d4a, roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ color: 0x123d4a, roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ map: createNotebookCover(), roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ color: 0x0f3540, roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ color: 0x123d4a, roughness: 0.6 }),
            new THREE.MeshStandardMaterial({ color: 0x123d4a, roughness: 0.6 }),
        ])
    );
    cover.position.set(0.6, 0.015, 0);
    hinge.add(cover);

    // Spiral rings
    const ringGeo = new THREE.TorusGeometry(0.05, 0.008, 8, 16);
    const rings = new THREE.InstancedMesh(ringGeo, MAT.metal, 12);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    for (let i = 0; i < 12; i++) {
        m.compose(new THREE.Vector3(-0.6, 0.08, -0.62 + i * 0.113), q, new THREE.Vector3(1, 1, 1));
        rings.setMatrixAt(i, m);
    }
    rings.instanceMatrix.needsUpdate = true;
    g.add(rings);

    // Pen beside it
    const pen = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.95, 12), new THREE.MeshStandardMaterial({ color: BRAND.cyan, roughness: 0.3, metalness: 0.5 })));
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.2;
    pen.position.set(0.05, 0.025, 0.95);
    g.add(pen);
    const penTip = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 12), MAT.metal);
    penTip.rotation.z = -Math.PI / 2;
    penTip.rotation.y = 0.2;
    penTip.position.set(0.05 + 0.505 * Math.cos(0.2), 0.025, 0.95 - 0.505 * Math.sin(0.2));
    g.add(penTip);

    g.userData.hinge = hinge;
    return g;
}

function buildPhone() {
    const g = new THREE.Group();
    const body = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.04, 0.88), MAT.darkPlastic));
    body.position.y = 0.02;
    g.add(body);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.9), MAT.metal);
    frame.position.y = 0.015;
    g.add(frame);

    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.4, 0.82),
        new THREE.MeshBasicMaterial({ map: createPhoneScreen(), toneMapped: false })
    );
    screen.rotation.x = -Math.PI / 2;
    screen.position.y = 0.041;
    g.add(screen);

    const cam = new THREE.Mesh(new THREE.CircleGeometry(0.018, 16), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    cam.rotation.x = -Math.PI / 2;
    cam.position.set(0, 0.042, -0.36);
    g.add(cam);

    g.userData.emissives = [{ material: screen.material, boost: 1.4 }];
    return g;
}

function buildMug() {
    const g = new THREE.Group();
    const cup = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.19, 0.44, 32, 1, true), MAT.ceramic));
    cup.material = MAT.ceramic.clone();
    cup.material.side = THREE.DoubleSide;
    cup.position.y = 0.22;
    g.add(cup);

    const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), MAT.ceramic);
    bottom.rotation.x = Math.PI / 2;
    bottom.position.y = 0.001;
    g.add(bottom);

    const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.205, 32), MAT.coffee);
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.38;
    g.add(coffee);

    // accent band
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.225, 0.225, 0.08, 32, 1, true), new THREE.MeshStandardMaterial({ color: BRAND.cyan, roughness: 0.4 }));
    band.position.y = 0.3;
    g.add(band);

    const handle = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 12, 24, Math.PI), MAT.ceramic));
    handle.position.set(0.22, 0.22, 0);
    handle.rotation.z = -Math.PI / 2;
    handle.rotation.y = 0;
    g.add(handle);

    // Steam sprites
    const steamCanvas = makeCanvas(64, 64);
    const sctx = steamCanvas.getContext('2d');
    const rg = sctx.createRadialGradient(32, 32, 2, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,0.8)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    sctx.fillStyle = rg;
    sctx.fillRect(0, 0, 64, 64);
    const steamTex = new THREE.CanvasTexture(steamCanvas);
    const steam = [];
    for (let i = 0; i < 6; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTex, transparent: true, opacity: 0, depthWrite: false }));
        s.scale.set(0.25, 0.25, 1);
        s.userData.seed = Math.random() * 10;
        s.position.set(0, 0.45, 0);
        g.add(s);
        steam.push(s);
    }
    g.userData.steam = steam;
    return g;
}

function buildTrophy() {
    const g = new THREE.Group();
    const pts = [
        [0.3, 0.0],
        [0.3, 0.06],
        [0.16, 0.09],
        [0.1, 0.12],
        [0.07, 0.42],
        [0.14, 0.47],
        [0.1, 0.52],
        [0.24, 0.62],
        [0.3, 0.85],
        [0.31, 1.02],
        [0.29, 1.03],
        [0.27, 0.9],
        [0.2, 0.7],
        [0.1, 0.6],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const cup = shadowed(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), MAT.gold));
    g.add(cup);

    const base = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.1, 0.62), MAT.marble));
    base.position.y = 0.0;
    g.add(base);
    cup.position.y = 0.05;

    const handleGeo = new THREE.TorusGeometry(0.15, 0.03, 10, 20, Math.PI);
    const h1 = new THREE.Mesh(handleGeo, MAT.gold);
    h1.position.set(0.3, 0.78, 0);
    h1.rotation.z = Math.PI / 2;
    h1.rotation.y = Math.PI / 2;
    g.add(h1);
    const h2 = h1.clone();
    h2.position.x = -0.3;
    h2.rotation.z = -Math.PI / 2;
    g.add(h2);

    // "#1" plate
    const plateCanvas = makeCanvas(128, 64);
    const pctx = plateCanvas.getContext('2d');
    pctx.fillStyle = '#ffc23d';
    pctx.fillRect(0, 0, 128, 64);
    pctx.fillStyle = '#3b2a00';
    pctx.font = '700 34px Outfit, Inter, sans-serif';
    pctx.textAlign = 'center';
    pctx.textBaseline = 'middle';
    pctx.fillText('DSA', 64, 32);
    const plateTex = new THREE.CanvasTexture(plateCanvas);
    plateTex.colorSpace = THREE.SRGBColorSpace;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), new THREE.MeshStandardMaterial({ map: plateTex, metalness: 0.6, roughness: 0.3 }));
    plate.position.set(0, 0.03, 0.311);
    g.add(plate);

    g.userData.cup = cup;
    return g;
}

function buildLamp() {
    const g = new THREE.Group();
    const base = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.06, 32), MAT.metal));
    base.position.y = 0.03;
    g.add(base);

    const pole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 12), MAT.metal));
    pole.position.y = 0.7;
    g.add(pole);

    const joint = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), MAT.metal);
    joint.position.y = 1.35;
    g.add(joint);

    const arm = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 12), MAT.metal));
    arm.position.set(0.45, 1.6, 0.18);
    arm.rotation.z = -1.1;
    arm.rotation.x = 0.3;
    g.add(arm);

    const head = new THREE.Group();
    head.position.set(0.95, 1.8, 0.35);
    head.rotation.z = -0.9;
    head.rotation.x = 0.35;
    g.add(head);

    const shade = shadowed(new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.36, 32, 1, true), MAT.metal.clone()));
    shade.material.side = THREE.DoubleSide;
    shade.rotation.x = Math.PI;
    head.add(shade);

    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffe3a6 });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), bulbMat);
    bulb.position.y = -0.05;
    head.add(bulb);

    const light = new THREE.SpotLight(0xffd9a0, 5, 9, 0.6, 0.8, 1.5);
    light.position.set(0, -0.05, 0);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);
    light.shadow.bias = -0.0005;
    head.add(light);
    const target = new THREE.Object3D();
    target.position.set(1.9, -1.6, 0.1);
    g.add(target);
    light.target = target;

    g.userData.light = light;
    g.userData.bulbMat = bulbMat;
    g.userData.on = true;
    return g;
}

function buildPlant() {
    const g = new THREE.Group();
    const pot = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.42, 24), MAT.terracotta));
    pot.position.y = 0.21;
    g.add(pot);
    const rim = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 24), MAT.terracotta));
    rim.position.y = 0.4;
    g.add(rim);
    const soil = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), MAT.soil);
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.41;
    g.add(soil);

    const leaves = new THREE.Group();
    leaves.position.y = 0.42;
    g.add(leaves);
    const leafGeo = new THREE.SphereGeometry(0.16, 12, 10);
    for (let i = 0; i < 9; i++) {
        const stemLen = 0.35 + Math.random() * 0.4;
        const ang = (i / 9) * Math.PI * 2 + Math.random() * 0.4;
        const tilt = 0.35 + Math.random() * 0.5;
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, stemLen, 6), MAT.leafDark);
        stem.position.set(Math.sin(ang) * Math.sin(tilt) * stemLen * 0.5, Math.cos(tilt) * stemLen * 0.5, Math.cos(ang) * Math.sin(tilt) * stemLen * 0.5);
        stem.rotation.set(Math.cos(ang) * tilt, 0, -Math.sin(ang) * tilt);
        leaves.add(stem);
        const leaf = shadowed(new THREE.Mesh(leafGeo, i % 2 ? MAT.leaf : MAT.leafDark));
        leaf.scale.set(0.7, 1.6, 0.25);
        leaf.position.set(Math.sin(ang) * Math.sin(tilt) * stemLen, Math.cos(tilt) * stemLen + 0.15, Math.cos(ang) * Math.sin(tilt) * stemLen);
        leaf.rotation.set(Math.cos(ang) * tilt * 0.8, ang, -Math.sin(ang) * tilt * 0.8);
        leaves.add(leaf);
    }
    g.userData.leaves = leaves;
    return g;
}

function buildPinboard() {
    const g = new THREE.Group();

    const tiltGroup = new THREE.Group();
    tiltGroup.rotation.x = -0.14;
    g.add(tiltGroup);

    const frame = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.7, 0.07), MAT.woodEdge));
    frame.position.y = 0.95;
    tiltGroup.add(frame);
    const cork = new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.55, 0.03), MAT.cork);
    cork.position.set(0, 0.95, 0.03);
    tiltGroup.add(cork);

    // Header strip
    const strip = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.16, 0.01), new THREE.MeshStandardMaterial({ color: 0x0f1218, roughness: 0.6 }));
    strip.position.set(0, 1.64, 0.05);
    tiltGroup.add(strip);
    const stripCanvas = makeCanvas(1024, 64);
    const sctx = stripCanvas.getContext('2d');
    sctx.fillStyle = '#0f1218';
    sctx.fillRect(0, 0, 1024, 64);
    sctx.fillStyle = '#00d2ff';
    sctx.font = '700 34px Outfit, Inter, sans-serif';
    sctx.textAlign = 'center';
    sctx.textBaseline = 'middle';
    sctx.letterSpacing = '6px';
    sctx.fillText('SKILLS  ·  WHAT I WORK WITH', 512, 32);
    const stripTex = new THREE.CanvasTexture(stripCanvas);
    stripTex.colorSpace = THREE.SRGBColorSpace;
    const stripFace = new THREE.Mesh(new THREE.PlaneGeometry(2.55, 0.16), new THREE.MeshBasicMaterial({ map: stripTex, toneMapped: false }));
    stripFace.position.set(0, 1.64, 0.056);
    tiltGroup.add(stripFace);

    const notes = [
        ['React.js', '#e6c44f', 'frontend'],
        ['Node.js', '#7fd48c', 'backend'],
        ['Python', '#6fb9e6', 'ML & scripts'],
        ['MongoDB', '#e694aa', 'databases'],
        ['RAG / LLMs', '#bf94e6', 'gen AI'],
        ['Docker', '#e6b07f', 'devops'],
    ];
    const pinGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const stickies = [];
    notes.forEach((n, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = -0.82 + col * 0.82;
        const y = 1.22 - row * 0.64;
        const note = new THREE.Mesh(
            new THREE.PlaneGeometry(0.58, 0.58),
            new THREE.MeshStandardMaterial({ map: createStickyTexture(n[0], n[1], n[2]), roughness: 0.95 })
        );
        note.position.set(x, y, 0.06);
        note.rotation.z = (Math.random() - 0.5) * 0.18;
        note.castShadow = true;
        tiltGroup.add(note);
        stickies.push(note);
        const pin = new THREE.Mesh(pinGeo, new THREE.MeshStandardMaterial({ color: [0xff3b5c, 0x00d2ff, 0x9d50bb][i % 3], roughness: 0.3 }));
        pin.position.set(x, y + 0.24, 0.08);
        tiltGroup.add(pin);
    });

    // Feet
    [-1.1, 1.1].forEach((x) => {
        const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.5), MAT.woodEdge);
        foot.position.set(x, 0.03, 0.05);
        g.add(foot);
    });

    g.userData.stickies = stickies;
    g.userData.emissives = [{ material: stripFace.material, boost: 1.3 }];
    return g;
}

/* ------------------------------------------------------------------ */
/* Scene                                                               */
/* ------------------------------------------------------------------ */

class DeskScene {
    constructor(container) {
        this.container = container;
        this.labelEl = document.getElementById('desk-label');
        this.hintEl = document.getElementById('desk-hint');
        this.loaderEl = document.getElementById('desk-loader');
        this.legendEl = document.getElementById('desk-legend');
        this.tooltipEl = document.getElementById('desk-tooltip');

        this.pointer = new THREE.Vector2(-10, -10);
        this.pointerPx = { x: 0, y: 0 };
        this.parallax = { x: 0, y: 0 };
        this.parallaxTarget = { x: 0, y: 0 };
        this.drag = { active: false, startX: 0, startYaw: 0, moved: false };
        this.yaw = 0;
        this.yawTarget = 0;
        this.hovered = null;
        this.focused = null;
        this.visible = true;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.hotspots = [];
        this.interactives = [];
        this.camAnim = null;
        this.intro = { start: performance.now(), duration: 1600 };
        this.hasInteracted = false;
        this.legendHover = null;
        this.emissives = [];

        this.baseCam = new THREE.Vector3(3.5, 3.4, 6.9);
        this.baseLook = new THREE.Vector3(0.1, 0.45, 0);
        this.camPos = this.baseCam.clone();
        this.camLook = this.baseLook.clone();

        this.initRenderer();
        this.initScene();
        this.initLights();
        this.buildObjects();
        this.initPost();
        this.bindEvents();
        this.applyTimeOfDay();

        this.loaderEl && this.loaderEl.classList.add('is-hidden');
        this.container.classList.add('is-ready');
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    /* --- setup ----------------------------------------------------- */

    initRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isSmallScreen ? 1.5 : 1.75));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = !isSmallScreen;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer = renderer;
        this.container.appendChild(renderer.domElement);
        this.resize();
    }

    initScene() {
        this.scene = new THREE.Scene();
        const pmrem = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        this.scene.environmentIntensity = 0.55;
        pmrem.dispose();

        const { width, height } = this.size;
        this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
        this.camera.position.copy(this.baseCam).add(new THREE.Vector3(1.5, 1.2, 3.5));
        this.camera.lookAt(this.baseLook);

        this.world = new THREE.Group();
        this.scene.add(this.world);
    }

    initLights() {
        this.ambient = new THREE.HemisphereLight(0x9fd8ff, 0x1a1030, 0.7);
        this.scene.add(this.ambient);

        this.key = new THREE.DirectionalLight(0xffffff, 2.2);
        this.key.position.set(-4, 7, 5);
        this.key.castShadow = true;
        this.key.shadow.mapSize.set(2048, 2048);
        this.key.shadow.camera.left = -6;
        this.key.shadow.camera.right = 6;
        this.key.shadow.camera.top = 6;
        this.key.shadow.camera.bottom = -6;
        this.key.shadow.camera.near = 1;
        this.key.shadow.camera.far = 25;
        this.key.shadow.bias = -0.0008;
        this.key.shadow.normalBias = 0.02;
        this.scene.add(this.key);

        this.rim = new THREE.DirectionalLight(BRAND.cyan, 1.4);
        this.rim.position.set(5, 3, -6);
        this.scene.add(this.rim);

        this.fill = new THREE.PointLight(BRAND.purple, 3.5, 14, 1.6);
        this.fill.position.set(-5, 1.5, 3);
        this.scene.add(this.fill);
    }

    buildObjects() {
        this.desk = buildDesk();
        this.world.add(this.desk);

        const add = (obj, opts) => {
            obj.position.set(opts.x, 0, opts.z);
            obj.rotation.y = opts.yaw || 0;
            this.desk.add(obj);

            // Highlight ring under the object
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(opts.ring * 0.82, opts.ring, 48),
                new THREE.MeshBasicMaterial({ color: BRAND.cyan, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
            );
            ring.rotation.x = -Math.PI / 2;
            ring.position.set(opts.x, 0.012, opts.z);
            this.desk.add(ring);

            const hs = {
                id: opts.id,
                object: obj,
                ring,
                label: opts.label,
                sub: opts.sub,
                target: opts.target,
                ringSize: opts.ring,
                anchorY: opts.anchorY,
                hover: 0,
                lift: opts.lift ?? 0.08,
                focus: opts.focus,
                onClick: opts.onClick,
                baseY: 0,
                introDelay: opts.delay || 0,
            };
            obj.traverse((m) => {
                if (m.isMesh || m.isSprite) {
                    m.userData.hotspot = hs;
                    if (!m.isSprite) this.interactives.push(m);
                }
            });
            this.hotspots.push(hs);
            return hs;
        };

        // Laptop -> Projects
        this.screen = createLaptopScreen();
        this.laptop = buildLaptop(this.screen);
        add(this.laptop, {
            id: 'laptop',
            x: -0.45,
            z: -0.15,
            yaw: -0.12,
            ring: 1.35,
            anchorY: 1.55,
            label: 'Laptop',
            sub: 'View my projects',
            target: '#projects',
            delay: 0.1,
            focus: { offset: [0.15, 1.35, 3.1], look: [0, 0.72, 0] },
            onClick: () => this.screen.flash(),
        });

        // Notebook -> Experience
        this.notebook = buildNotebook();
        add(this.notebook, {
            id: 'notebook',
            x: -2.15,
            z: 0.5,
            yaw: 0.28,
            ring: 1.0,
            anchorY: 0.5,
            label: 'Notebook',
            sub: 'Read my experience',
            target: '#experience',
            delay: 0.25,
            focus: { offset: [0.2, 2.3, 1.7], look: [0.1, 0.1, 0] },
        });

        // Phone -> Contact
        this.phone = buildPhone();
        add(this.phone, {
            id: 'phone',
            x: 0.95,
            z: 0.95,
            yaw: -0.35,
            ring: 0.62,
            anchorY: 0.35,
            label: 'Phone',
            sub: 'Get in touch',
            target: '#contact',
            delay: 0.4,
            lift: 0.12,
            focus: { offset: [0.0, 1.55, 1.05], look: [0, 0.05, 0] },
        });

        // Mug -> About
        this.mug = buildMug();
        add(this.mug, {
            id: 'mug',
            x: 1.8,
            z: 0.7,
            yaw: 0.6,
            ring: 0.45,
            anchorY: 0.75,
            label: 'Coffee',
            sub: 'A bit about me',
            target: '#about',
            delay: 0.55,
            focus: { offset: [0.7, 1.1, 1.6], look: [0, 0.25, 0] },
        });

        // Trophy -> Problem solving
        this.trophy = buildTrophy();
        add(this.trophy, {
            id: 'trophy',
            x: 2.65,
            z: -0.05,
            yaw: 0.1,
            ring: 0.55,
            anchorY: 1.3,
            label: 'Trophy',
            sub: 'Problem solving & open source',
            target: '#problem-solving',
            delay: 0.7,
            focus: { offset: [0.5, 1.1, 2.1], look: [0, 0.55, 0] },
        });

        // Pinboard -> Skills
        this.pinboard = buildPinboard();
        add(this.pinboard, {
            id: 'pinboard',
            x: 1.15,
            z: -1.05,
            yaw: 0,
            ring: 1.5,
            anchorY: 1.95,
            label: 'Sticky notes',
            sub: 'See my skills',
            target: '#skills',
            delay: 0.85,
            lift: 0.05,
            focus: { offset: [0.1, 1.5, 3.0], look: [0, 0.95, 0] },
        });

        // Lamp -> toggles light
        this.lamp = buildLamp();
        add(this.lamp, {
            id: 'lamp',
            x: -2.0,
            z: -1.0,
            yaw: 0.25,
            ring: 0.42,
            anchorY: 2.25,
            label: 'Lamp',
            sub: 'Lights on / off',
            target: null,
            delay: 1.0,
            lift: 0.03,
            onClick: () => this.toggleLamp(),
        });

        // Plant (decorative, hover only)
        this.plant = buildPlant();
        add(this.plant, {
            id: 'plant',
            x: -2.85,
            z: -0.85,
            yaw: 0,
            ring: 0.42,
            anchorY: 1.35,
            label: 'Plant',
            sub: 'Keeps the desk alive',
            target: null,
            delay: 1.15,
            lift: 0.04,
        });

        this.hotspots.forEach((h) => (h.baseY = h.object.position.y));
        [this.desk, this.laptop, this.phone, this.pinboard].forEach((o) => {
            (o.userData.emissives || []).forEach((e) => this.emissives.push(e));
        });
    }

    initPost() {
        this.composer = null;
        if (isSmallScreen || prefersReducedMotion) return;
        try {
            const { width, height } = this.size;
            const composer = new EffectComposer(this.renderer);
            composer.addPass(new RenderPass(this.scene, this.camera));
            const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), 0.5, 0.5, 1.0);
            composer.addPass(bloom);
            composer.addPass(new OutputPass());
            this.bloom = bloom;
            this.composer = composer;
            // With bloom active, push emissive surfaces above 1.0 so only they glow
            this.emissives.forEach(({ material, boost }) => material.color.multiplyScalar(boost));
        } catch (err) {
            console.warn('[desk] bloom unavailable, falling back to direct render', err);
            this.composer = null;
        }
    }

    applyTimeOfDay() {
        const h = new Date().getHours();
        let preset;
        if (h >= 6 && h < 11) preset = { key: 0xfff2dc, keyI: 1.7, amb: 0.7, lamp: false, name: 'morning' };
        else if (h >= 11 && h < 17) preset = { key: 0xffffff, keyI: 1.9, amb: 0.75, lamp: false, name: 'afternoon' };
        else if (h >= 17 && h < 20) preset = { key: 0xffb27a, keyI: 1.3, amb: 0.55, lamp: true, name: 'evening' };
        else preset = { key: 0x7fa6ff, keyI: 0.9, amb: 0.45, lamp: true, name: 'night' };

        this.key.color.setHex(preset.key);
        this.key.intensity = preset.keyI;
        this.ambient.intensity = preset.amb;
        this.lamp.userData.on = preset.lamp;
        this.lampIntensity = preset.lamp ? 1 : 0;
        this.applyLamp(true);
        this.container.dataset.timeOfDay = preset.name;
    }

    toggleLamp() {
        this.lamp.userData.on = !this.lamp.userData.on;
    }

    applyLamp(immediate = false) {
        const target = this.lamp.userData.on ? 1 : 0;
        this.lampIntensity = immediate ? target : lerp(this.lampIntensity, target, 0.12);
        const { light, bulbMat } = this.lamp.userData;
        light.intensity = 5 * this.lampIntensity;
        const boost = this.composer ? 1.6 : 1;
        bulbMat.color.setHex(0xffe3a6).multiplyScalar(0.12 + boost * this.lampIntensity);
    }

    /* --- events ---------------------------------------------------- */

    bindEvents() {
        const el = this.renderer.domElement;

        const setPointer = (e) => {
            const rect = el.getBoundingClientRect();
            this.pointerPx.x = e.clientX - rect.left;
            this.pointerPx.y = e.clientY - rect.top;
            this.pointer.x = (this.pointerPx.x / rect.width) * 2 - 1;
            this.pointer.y = -(this.pointerPx.y / rect.height) * 2 + 1;
        };

        el.addEventListener('pointermove', (e) => {
            setPointer(e);
            if (this.drag.active) {
                const dx = e.clientX - this.drag.startX;
                if (Math.abs(dx) > 4) this.drag.moved = true;
                this.yawTarget = clamp(this.drag.startYaw + dx * 0.005, -0.7, 0.7);
            } else if (!isTouch) {
                this.parallaxTarget.x = this.pointer.x;
                this.parallaxTarget.y = this.pointer.y;
            }
        });

        el.addEventListener('pointerdown', (e) => {
            setPointer(e);
            this.drag.active = true;
            this.drag.moved = false;
            this.drag.startX = e.clientX;
            this.drag.startYaw = this.yawTarget;
            el.setPointerCapture(e.pointerId);
        });

        const endDrag = (e) => {
            if (!this.drag.active) return;
            this.drag.active = false;
            try {
                el.releasePointerCapture(e.pointerId);
            } catch (_) {
                /* ignore */
            }
            if (!this.drag.moved) {
                setPointer(e);
                const hs = this.pick();
                if (hs) this.activate(hs);
            }
        };
        el.addEventListener('pointerup', endDrag);
        el.addEventListener('pointercancel', endDrag);

        el.addEventListener('pointerleave', () => {
            this.pointer.set(-10, -10);
            this.parallaxTarget.x = 0;
            this.parallaxTarget.y = 0;
            this.setHovered(null);
        });

        // Legend chips mirror the 3D hotspots
        if (this.legendEl) {
            this.legendEl.querySelectorAll('[data-hotspot]').forEach((btn) => {
                const hs = () => this.hotspots.find((h) => h.id === btn.dataset.hotspot);
                btn.addEventListener('mouseenter', () => {
                    this.legendHover = hs();
                    this.setHovered(this.legendHover, true);
                });
                btn.addEventListener('mouseleave', () => {
                    this.legendHover = null;
                    this.setHovered(null);
                });
                btn.addEventListener('click', () => {
                    const h = hs();
                    if (h) this.activate(h);
                });
            });
        }

        window.addEventListener('resize', () => this.resize());
        if ('ResizeObserver' in window) {
            new ResizeObserver(() => this.resize()).observe(this.container);
        }

        // Pause rendering when the desk is scrolled out of view
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(
                (entries) => {
                    this.visible = entries[0].isIntersecting;
                    if (this.visible) this.clock.getDelta();
                },
                { threshold: 0.05 }
            ).observe(this.container);
        }
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) this.clock.getDelta();
        });
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));
        this.size = { width, height };
        this.renderer.setSize(width, height, false);
        if (this.camera) {
            this.camera.aspect = width / height;
            // Push the camera back on narrow/portrait viewports so the desk stays in frame
            const aspectComp = clamp(1.3 / this.camera.aspect, 1, 1.75);
            this.baseCam.set(3.5 * aspectComp, 3.4 * aspectComp, 6.9 * aspectComp);
            this.camera.updateProjectionMatrix();
        }
        if (this.composer) this.composer.setSize(width, height);
    }

    /* --- interaction ---------------------------------------------- */

    pick() {
        if (this.pointer.x < -1 || this.pointer.y < -1) return null;
        this.raycaster.setFromCamera(this.pointer, this.camera);
        const hits = this.raycaster.intersectObjects(this.interactives, false);
        return hits.length ? hits[0].object.userData.hotspot : null;
    }

    setHovered(hs, fromLegend = false) {
        if (this.hovered === hs) return;
        this.hovered = hs;
        const cursorEl = document.querySelector('.neon-cursor');
        if (hs) {
            this.renderer.domElement.style.cursor = 'pointer';
            cursorEl && !fromLegend && cursorEl.classList.add('hover');
            if (this.labelEl) {
                this.labelEl.querySelector('strong').textContent = hs.label;
                this.labelEl.querySelector('span').textContent = hs.sub;
                this.labelEl.hidden = false;
                this.labelEl.classList.add('is-visible');
            }
        } else {
            this.renderer.domElement.style.cursor = '';
            cursorEl && cursorEl.classList.remove('hover');
            if (this.labelEl) this.labelEl.classList.remove('is-visible');
        }
        if (this.legendEl) {
            this.legendEl.querySelectorAll('[data-hotspot]').forEach((b) => {
                b.classList.toggle('is-active', !!hs && b.dataset.hotspot === hs.id);
            });
        }
    }

    activate(hs) {
        if (!this.hasInteracted) {
            this.hasInteracted = true;
            this.hintEl && this.hintEl.classList.add('is-hidden');
        }
        hs.onClick && hs.onClick();
        if (!hs.focus) {
            // small bounce for non-navigating objects
            hs.bounce = 1;
            return;
        }
        this.focused = hs;
        const wp = hs.object.getWorldPosition(new THREE.Vector3());
        const to = wp.clone().add(new THREE.Vector3(...hs.focus.offset));
        const look = wp.clone().add(new THREE.Vector3(...hs.focus.look));
        const dur = prefersReducedMotion ? 0 : 950;
        this.flyTo(to, look, dur, () => {
            if (hs.target) this.navigate(hs.target);
            setTimeout(() => {
                this.focused = null;
                this.camAnim = null; // resume default camera behaviour (lerps back)
            }, 1400);
        });
    }

    flyTo(pos, look, duration, onDone) {
        this.camAnim = {
            fromPos: this.camPos.clone(),
            fromLook: this.camLook.clone(),
            toPos: pos,
            toLook: look,
            start: performance.now(),
            duration,
            onDone,
            hold: true,
        };
    }

    navigate(selector) {
        const target = document.querySelector(selector);
        if (!target) return;
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    /* --- frame loop ----------------------------------------------- */

    animate() {
        requestAnimationFrame(this.animate);
        if (!this.visible || document.hidden) return;

        const dt = Math.min(this.clock.getDelta(), 0.05);
        const t = this.clock.elapsedTime;
        const now = performance.now();

        // Intro: objects drop onto the desk
        const introT = clamp((now - this.intro.start) / this.intro.duration, 0, 1);
        const deskT = easeOutCubic(clamp(introT * 1.6, 0, 1));
        this.desk.scale.setScalar(lerp(0.75, 1, deskT));

        // Hover picking (skip while dragging, focused, or hovering a legend chip)
        if (!this.drag.active && !this.focused && !isTouch && !this.legendHover) {
            this.setHovered(this.pick());
        }

        // Hotspot states
        this.hotspots.forEach((hs) => {
            const targetHover = this.hovered === hs ? 1 : 0;
            hs.hover = lerp(hs.hover, targetHover, 1 - Math.pow(0.001, dt));
            hs.ring.material.opacity = hs.hover * 0.75 * (0.85 + 0.15 * Math.sin(t * 6));
            hs.ring.scale.setScalar(1 + hs.hover * 0.08 + (hs.hover ? Math.sin(t * 4) * 0.02 : 0));

            const objIntro = prefersReducedMotion ? 1 : easeOutBack(clamp((introT * 1.6 - hs.introDelay) / 0.7, 0, 1));
            const drop = (1 - objIntro) * 1.6;

            if (hs.bounce) {
                hs.bounce = Math.max(0, hs.bounce - dt * 2.2);
            }
            const bounceY = hs.bounce ? Math.sin(hs.bounce * Math.PI) * 0.18 : 0;
            hs.object.position.y = hs.baseY + hs.hover * hs.lift + drop + bounceY;
            hs.object.scale.setScalar(Math.max(0.001, objIntro));
        });

        // Object-specific life
        this.screen.update(now);

        const nb = this.hotspots.find((h) => h.id === 'notebook');
        const nbTarget = this.focused === nb ? 1 : nb.hover * 0.45;
        this.notebook.userData.hinge.rotation.z = lerp(this.notebook.userData.hinge.rotation.z, -Math.PI * 0.9 * nbTarget, 1 - Math.pow(0.002, dt));

        const ph = this.hotspots.find((h) => h.id === 'phone');
        this.phone.rotation.x = lerp(this.phone.rotation.x, -0.55 * ph.hover, 1 - Math.pow(0.002, dt));

        const tr = this.hotspots.find((h) => h.id === 'trophy');
        this.trophy.userData.cup.rotation.y += dt * (0.4 + tr.hover * 4);

        const mg = this.hotspots.find((h) => h.id === 'mug');
        this.mug.userData.steam.forEach((s, i) => {
            const phase = (t * 0.45 + s.userData.seed) % 1;
            s.position.set(Math.sin((t + s.userData.seed) * 2.2) * 0.06 * phase, 0.42 + phase * 0.75, Math.cos((t + s.userData.seed) * 1.7) * 0.05 * phase);
            s.material.opacity = Math.sin(phase * Math.PI) * (0.18 + mg.hover * 0.35);
            s.scale.setScalar(0.15 + phase * 0.35);
        });

        const pl = this.hotspots.find((h) => h.id === 'plant');
        this.plant.userData.leaves.rotation.z = Math.sin(t * 1.3) * (0.02 + pl.hover * 0.05);
        this.plant.userData.leaves.rotation.x = Math.cos(t * 1.1) * (0.02 + pl.hover * 0.04);

        const lp = this.hotspots.find((h) => h.id === 'laptop');
        this.laptop.userData.hinge.rotation.x = lerp(this.laptop.userData.hinge.rotation.x, -0.28 - lp.hover * 0.08, 1 - Math.pow(0.002, dt));
        this.laptop.userData.spill.intensity = 1.4 + Math.sin(t * 3.1) * 0.15 + lp.hover * 0.8;

        this.applyLamp();
        if (this.lamp.userData.on) {
            // subtle warm flicker
            this.lamp.userData.light.intensity *= 0.97 + Math.sin(t * 17) * 0.015 + Math.sin(t * 5.3) * 0.015;
        }

        // Whole desk floats gently
        if (!prefersReducedMotion) {
            this.desk.position.y = Math.sin(t * 0.7) * 0.05;
            this.desk.rotation.z = Math.sin(t * 0.5) * 0.004;
        }

        // Camera
        this.parallax.x = lerp(this.parallax.x, this.parallaxTarget.x, 1 - Math.pow(0.01, dt));
        this.parallax.y = lerp(this.parallax.y, this.parallaxTarget.y, 1 - Math.pow(0.01, dt));
        this.yaw = lerp(this.yaw, this.yawTarget, 1 - Math.pow(0.005, dt));
        this.world.rotation.y = this.yaw;

        if (this.camAnim) {
            const a = this.camAnim;
            const k = a.duration === 0 ? 1 : easeInOutCubic(clamp((now - a.start) / a.duration, 0, 1));
            this.camPos.lerpVectors(a.fromPos, a.toPos, k);
            this.camLook.lerpVectors(a.fromLook, a.toLook, k);
            if (k >= 1 && a.onDone) {
                const cb = a.onDone;
                a.onDone = null;
                cb();
            }
        } else {
            const introCam = easeOutCubic(introT);
            const desired = this.baseCam.clone();
            desired.x += this.parallax.x * (prefersReducedMotion ? 0 : 0.55);
            desired.y += this.parallax.y * (prefersReducedMotion ? 0 : 0.3);
            desired.z += (1 - introCam) * 3.0;
            desired.y += (1 - introCam) * 1.2;
            const desiredLook = this.baseLook.clone();
            desiredLook.x += this.parallax.x * 0.15;
            desiredLook.y += this.parallax.y * 0.1;
            const s = 1 - Math.pow(0.02, dt);
            this.camPos.lerp(desired, s);
            this.camLook.lerp(desiredLook, s);
        }
        this.camera.position.copy(this.camPos);
        this.camera.lookAt(this.camLook);

        // Label follows its object
        if (this.hovered && this.labelEl && !this.labelEl.hidden) {
            const p = this.hovered.object.getWorldPosition(new THREE.Vector3());
            p.y += this.hovered.anchorY;
            p.project(this.camera);
            const x = (p.x * 0.5 + 0.5) * this.size.width;
            const y = (-p.y * 0.5 + 0.5) * this.size.height;
            this.labelEl.style.transform = `translate(-50%, -100%) translate(${x.toFixed(1)}px, ${(y - 12).toFixed(1)}px)`;
        }

        if (this.composer) this.composer.render();
        else this.renderer.render(this.scene, this.camera);
    }
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function boot() {
    const container = document.getElementById('desk-scene');
    if (!container) return;

    const canWebGL = (() => {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
        } catch (_) {
            return false;
        }
    })();

    if (!canWebGL) {
        container.closest('.hero-desk')?.classList.add('is-fallback');
        return;
    }

    try {
        window.deskScene = new DeskScene(container);
    } catch (err) {
        console.error('[desk] failed to start 3D scene', err);
        container.closest('.hero-desk')?.classList.add('is-fallback');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}
