const C = 10, GW = 128, GH = 72, F = 0.5, MF = 0.8;
const MOTION = { pop: Easing.easeOutBack, settle: Easing.easeOutCubic, glide: Easing.easeInOutSine };

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const LIGHTS = ['#ff5a5a', '#ffd447', '#5ab8ff', '#7dff9a', '#ff8ce6'];

// Scene builder: sprites are groups of pixels that build in over [from, to]
// seconds after their cue; every pixel later melts away top to bottom.
function makeBuilder(seed) {
  const r = rng(seed), sprites = [], P = [];
  const px = (x, y, c, L, extra) => Object.assign({ x, y, c, L }, extra || {});
  function sprite(cue, from, to, pixels, order) {
    const id = sprites.length;
    sprites.push({ cue, from, to });
    const keyed = pixels.map(p => ({ p, k: order ? order(p) : -p.y + r() * 1.3 }));
    keyed.sort((a, b) => a.k - b.k);
    keyed.forEach((o, i) => { o.p.s = id; o.p.f = keyed.length > 1 ? i / (keyed.length - 1) : 0; P.push(o.p); });
  }
  // A layer of pixels where later writes replace earlier ones at the same spot.
  function canvas(L) {
    const M = new Map();
    const cv = {
      put(x, y, c, extra) {
        x = Math.round(x); y = Math.round(y);
        if (x < 0 || x >= GW || y < 0 || y >= GH) return cv;
        M.set(x + ',' + y, px(x, y, c, L, extra));
        return cv;
      },
      map(rows, leg, x0, y0, extra) {
        rows.forEach((row, y) => [...row].forEach((ch, x) => {
          if (leg[ch]) cv.put(x0 + x, y0 + y, leg[ch], typeof extra === 'function' ? extra(ch, x0 + x, y0 + y) : extra);
        }));
        return cv;
      },
      has(x, y) { return M.has(x + ',' + y); },
      list() { return [...M.values()]; },
    };
    return cv;
  }
  const light = () => ({ light: true, ph: r() * 6.28, ci: Math.floor(r() * LIGHTS.length) });
  function finish() {
    const mk = P.map(p => ({ p, k: p.y + r() * 4 })).sort((a, b) => a.k - b.k);
    mk.forEach((o, i) => { o.p.mf = i / (mk.length - 1); });
    return { P, sprites };
  }
  return { r, px, sprite, canvas, light, finish };
}

function snowGround(b, cue, from, to, top) {
  top = top || 60;
  const cv = b.canvas(1);
  for (let y = top; y < GH; y++) for (let x = 0; x < GW; x++) {
    const d = y - top;
    let c = d === 0 ? '#f6f9ff' : d < 3 ? '#dfe7f5' : d < 6 ? ((x + y) % 2 ? '#c9d5ea' : '#dfe7f5') : d < 9 ? '#c3cfe5' : ((x + y) % 2 ? '#aebcd8' : '#c3cfe5');
    if (d > 0 && b.r() < 0.03) c = '#ffffff';
    cv.put(x, y, c);
  }
  b.sprite(cue, from, to, cv.list());
}

function starField(b, cue, from, to, n, ymax, avoid) {
  const cv = b.canvas(0);
  for (let i = 0; i < n; i++) {
    const x = Math.floor(b.r() * GW), y = 1 + Math.floor(b.r() * ymax);
    if ((avoid && avoid(x, y)) || cv.has(x, y)) continue;
    cv.put(x, y, b.r() < 0.3 ? '#fff4c4' : '#cfd8ff', { tw: true });
    if (b.r() < 0.15 && y > 2) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => cv.put(x + dx, y + dy, '#7f8bd0', { tw: true }));
  }
  b.sprite(cue, from, to, cv.list());
}

function crescentMoon(cv, cx, cy) {
  for (let y = cy - 6; y <= cy + 6; y++) for (let x = cx - 8; x <= cx + 8; x++) {
    const a = (x - cx) ** 2 + (y - cy) ** 2, b = (x - cx - 2.5) ** 2 + (y - cy + 2) ** 2;
    if (a <= 22 && b > 17) cv.put(x, y, a > 13 ? '#d9cf9f' : '#f3ecc8');
  }
}

function fullMoon(cv, cx, cy, rr) {
  for (let y = cy - rr; y <= cy + rr; y++) for (let x = cx - rr; x <= cx + rr; x++) {
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (d > rr + 0.3) continue;
    const crater = ((x - cx + 3) ** 2 + (y - cy + 2) ** 2 < 4) || ((x - cx - 3) ** 2 + (y - cy - 3) ** 2 < 3) || ((x - cx - 2) ** 2 + (y - cy + 4) ** 2 < 1.5);
    cv.put(x, y, d > rr - 1 ? '#d9cf9f' : crater ? '#e3d9ad' : '#f3ecc8');
  }
}

// Snow-tipped pine; `lights` is the chance a needle pixel is a bulb.
function pine(b, cv, x0, base, hgt, opts) {
  opts = opts || {};
  const dark = opts.dark || '#143238', lite = opts.lite || '#1c4650';
  cv.put(x0, base, '#3a2616');
  for (let i = 0; i < hgt; i++) {
    const hw = Math.floor(i / 2), y = base - hgt + i;
    for (let x = x0 - hw; x <= x0 + hw; x++) {
      const edge = i === 0 || (i % 2 === 0 && x === x0 - hw);
      if (!edge && opts.lights && i > 2 && b.r() < opts.lights) cv.put(x, y, LIGHTS[Math.floor(b.r() * 5)], b.light());
      else cv.put(x, y, edge ? '#c9d6ea' : x < x0 ? dark : lite);
    }
  }
}

function present(cv, x0, w, h, col, shade, top, rib, base) {
  base = base || 60;
  const y0 = base - h, mx = x0 + Math.floor(w / 2), my = y0 + Math.floor(h / 2);
  for (let y = y0; y < base; y++) for (let x = x0; x < x0 + w; x++) cv.put(x, y, x === mx || y === my ? rib : y === y0 ? top : x === x0 + w - 1 ? shade : col);
  [[-2, -2], [-1, -1], [1, -1], [2, -2], [-2, -1], [2, -1], [0, -1]].forEach(([dx, dy]) => cv.put(mx + dx, y0 + dy, rib));
}

function renderPixels(SCENE, T, CUES, authoredTotal, arrival, layerTf) {
  const { P, sprites } = SCENE;
  const meltStart = CUES.Melt + 0.1, meltSpan = Math.max(0.1, authoredTotal - CUES.Melt - 0.2 - MF);
  const lit = T > CUES.Celebrate;
  const layers = {}, fly = [], tw = [];
  for (let i = 0; i < P.length; i++) {
    const p = P[i], s = sprites[p.s];
    const ti = CUES[s.cue] + s.from + p.f * (s.to - s.from - F);
    const a = (T - ti) / F;
    if (a <= 0) continue;
    const b = (T - (meltStart + MOTION.glide(p.mf) * meltSpan)) / MF;
    if (b >= 1) continue;
    let c = p.c;
    if (lit && p.light) c = Math.sin(T * 4 + p.ph) > -0.3 ? LIGHTS[(p.ci + Math.floor(T * 1.2 + p.ph)) % LIGHTS.length] : '#3a2a3a';
    if (lit && p.win && Math.sin(T * 2.6 + p.ph) > 0.55) c = '#ffb52e';
    if (a >= 1 && b <= 0) {
      if (p.tw) { tw.push(<rect key={'t' + i} x={p.x} y={p.y} width="1" height="1" fill={c} opacity={0.55 + 0.45 * Math.sin(T * 2.3 + i * 1.3)} />); continue; }
      const L = layers[p.L] || (layers[p.L] = {}); (L[c] || (L[c] = [])).push(`M${p.x} ${p.y}h1v1h-1z`);
      continue;
    }
    // Pixels tucked behind something (e.g. inside a chimney) only exist once settled.
    if (p.hide) continue;
    let sc = 1, dy = 0, op = 1;
    if (a < 1) {
      const e = MOTION.settle(a);
      if (arrival === 'drop') { dy = -(1 - e) * 4; sc = 0.5 + 0.5 * MOTION.pop(a); }
      else if (arrival === 'rise') { dy = (1 - e) * 4; sc = 0.5 + 0.5 * MOTION.pop(a); }
      else sc = MOTION.pop(a);
      op = Math.min(1, a * 3);
    }
    if (b > 0) { const fall = 1 - MOTION.settle(1 - b); dy += fall * 5; sc *= 1 - 0.6 * fall; op *= 1 - MOTION.glide(b); }
    sc = Math.max(0, sc);
    fly.push(<rect key={i} x={p.x + 0.5 - sc / 2} y={p.y + 0.5 - sc / 2 + dy} width={sc} height={sc} fill={c} opacity={op} />);
  }
  const paths = [];
  Object.keys(layers).sort((x, y) => x - y).forEach(li => {
    const L = layers[li], tf = layerTf ? layerTf(+li) : undefined;
    Object.keys(L).forEach(c => paths.push(<path key={li + c} d={L[c].join('')} fill={c} transform={tf} />));
  });
  return { tw, paths, fly };
}

const FLAKES = (() => { const r = rng(80); return Array.from({ length: 80 }, () => ({ x: r() * GW, off: r() * 80, sp: 3 + r() * 5, sw: 0.5 + r() * 1.5, ph: r() * 6.28, c: r() < 0.3 ? '#c9d6ea' : '#ffffff' })); })();

// Shared stage: sky, glows, pixels, scene extras and snowfall.
// env: 0 → 1 over the start of Celebrate, back to 0 just before Melt, so any
// layer motion is back at rest before the pixels melt.
function PixelPiece({ arrival, snow, SCENE, pushCue, origin, layerTf, glows, extras }) {
  const { T, CUES, authoredTotal, time } = useComposition();
  const env = animate({ from: 0, to: 1, start: CUES.Celebrate, end: CUES.Celebrate + 1.5, ease: MOTION.glide })(T)
    * (1 - animate({ from: 0, to: 1, start: CUES.Melt - 1.2, end: CUES.Melt, ease: MOTION.glide })(T));
  const meltOut = 1 - animate({ from: 0, to: 1, start: CUES.Melt, end: CUES.Melt + 1.5, ease: MOTION.glide })(T);
  const { tw, paths, fly } = renderPixels(SCENE, T, CUES, authoredTotal, arrival, layerTf ? n => layerTf(n, T, env) : null);
  const push = animate({ from: 0, to: 1, start: CUES[pushCue], end: CUES.Celebrate, ease: MOTION.glide })(T)
    - animate({ from: 0, to: 1, start: CUES.Celebrate, end: CUES.Celebrate + 1.6, ease: MOTION.glide })(T);
  const snowOp = snow ? animate({ from: 0, to: 1, start: CUES.Celebrate, end: CUES.Celebrate + 1.2, ease: MOTION.glide })(T) * meltOut : 0;
  const flakes = snowOp > 0.01 ? FLAKES.map((f, i) => {
    const y = ((T - CUES.Celebrate) * f.sp + f.off) % 84 - 8;
    const x = (f.x + Math.sin(T * f.sw + f.ph) * 1.5 + GW) % GW;
    return <rect key={'f' + i} x={x} y={y} width="0.6" height="0.6" fill={f.c} opacity={snowOp * 0.9} />;
  }) : null;
  const gl = glows ? glows(T, CUES, env, meltOut) : [];
  const ex = extras ? extras(T, CUES, env, meltOut) : null;
  return (
    <div data-screen-label={'t=' + Math.floor(time) + 's'} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'linear-gradient(#090d28 0%, #141d4a 55%, #26306a 100%)' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${1 + 0.06 * push})`, transformOrigin: origin || '50% 65%' }}>
        {gl.map((g, i) => (
          <div key={'g' + i} style={{ position: 'absolute', left: (g.x + 0.5) * C - g.size / 2, top: (g.y + 0.5) * C - g.size / 2, width: g.size, height: g.size, borderRadius: '50%', background: `radial-gradient(circle, rgba(${g.rgb},${g.a}) 0%, rgba(${g.rgb},${g.a * 0.3}) 40%, rgba(${g.rgb},0) 70%)`, opacity: g.op }}></div>
        ))}
        <svg viewBox={`0 0 ${GW} ${GH}`} width={GW * C} height={GH * C} shapeRendering="crispEdges" style={{ position: 'absolute', left: 0, top: 0 }}>
          {tw}{paths}{fly}
        </svg>
        {ex && <svg viewBox={`0 0 ${GW} ${GH}`} width={GW * C} height={GH * C} shapeRendering="crispEdges" style={{ position: 'absolute', left: 0, top: 0 }}>{ex}</svg>}
        <svg viewBox={`0 0 ${GW} ${GH}`} width={GW * C} height={GH * C} style={{ position: 'absolute', left: 0, top: 0 }}>{flakes}</svg>
      </div>
    </div>
  );
}

function makeApp(Piece) {
  return function App() {
    const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS);
    return (
      <React.Fragment>
        <CompositionStage width={1280} height={720} bg="#090d28" scenes={window.OM_SCENES} playback={window.OM_PLAYBACK}>
          <Piece arrival={t.arrival} snow={t.snow} />
        </CompositionStage>
        <TweaksPanel>
          <TweakSection label="Animation" />
          <TweakRadio label="Pixel arrival" value={t.arrival} options={['drop', 'rise', 'pop']} onChange={v => setTweak('arrival', v)} />
          <TweakToggle label="Snowfall" value={t.snow} onChange={v => setTweak('snow', v)} />
        </TweaksPanel>
      </React.Fragment>
    );
  };
}

// Small pixel shapes for overlays (smoke, notes, sparkles).
function pixelShape(rows, x0, y0, fill, op, key) {
  const out = [];
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') out.push(<rect key={key + '-' + x + '-' + y} x={x0 + x} y={y0 + y} width="1" height="1" fill={fill} opacity={op} />); }));
  return out;
}
