// Pixel Gingerbread: a gingerbread house, candy garden and cookie friends.
const HOP = { 7.1: 0, 7.2: 1.4, 7.3: 2.5 };

function buildScene() {
  const b = makeBuilder(2412), r = b.r;

  snowGround(b, 'Ground', 0, 2.2);
  starField(b, 'Ground', 1.0, 3.0, 55, 26);

  const far = b.canvas(0.4);
  const h1 = x => Math.round(49 + 4 * Math.sin(x / 15 + 2) + 2 * Math.sin(x / 6));
  for (let x = 0; x < GW; x++) for (let y = h1(x); y < 60; y++) far.put(x, y, y === h1(x) ? '#4a5899' : (x * 3 + y * 5) % 7 === 0 ? '#1f2960' : '#252f66');
  b.sprite('Ground', 0.4, 2.4, far.list());

  const pines = b.canvas(0.7);
  [[3, 9], [124, 10], [118, 7]].forEach(([x, h]) => pine(b, pines, x, 59, h));
  b.sprite('Ground', 1.6, 2.9, pines.list());

  // House walls
  const WALL = '#b06a32', WALL2 = '#9a5a28', ICE = '#f6f9ff';
  const walls = b.canvas(2);
  for (let y = 34; y < 60; y++) for (let x = 44; x <= 84; x++) {
    let c = r() < 0.07 ? WALL2 : WALL;
    if (x === 84 || x === 83) c = '#8a4f22';
    if (y === 34 || y === 35) c = (x % 3 === 0 && y === 35) ? WALL : ICE;
    if ((x === 44 || x === 84) && y % 3 === 0) c = ICE;
    walls.put(x, y, c);
  }
  b.sprite('House', 0, 2.4, walls.list());

  // Door, windows and candy-cane pillars
  const front = b.canvas(2.5);
  for (let y = 45; y < 60; y++) for (let x = 60; x <= 68; x++) {
    const arch = y === 45 && (x === 60 || x === 68);
    if (arch) continue;
    const border = x === 60 || x === 68 || y === 45 || (y === 46 && (x === 61 || x === 67));
    front.put(x, y, border ? ICE : x === 64 ? '#4a2812' : '#5a3218');
  }
  front.put(66, 53, '#ffd447');
  [[48, 39], [73, 39]].forEach(([wx, wy], k) => {
    for (let y = wy; y <= wy + 7; y++) for (let x = wx; x <= wx + 7; x++) {
      const frame = x === wx || x === wx + 7 || y === wy || y === wy + 7;
      const pane = x === wx + 4 || y === wy + 4;
      front.put(x, y, frame || pane ? ICE : '#ffd447', frame || pane ? null : { win: true, ph: k * 2.7 });
    }
    for (let x = wx - 1; x <= wx + 8; x++) front.put(x, wy + 8, '#ff8ce6');
  });
  [57, 71].forEach(cx => {
    for (let y = 44; y < 60; y++) front.put(cx, y, (y + cx) % 4 < 2 ? '#d8343a' : ICE);
    front.put(cx, 43, ICE); front.put(cx + 1, 42, '#d8343a'); front.put(cx + 2, 42, ICE); front.put(cx + 3, 43, '#d8343a');
  });
  b.sprite('House', 2.0, 3.6, front.list());

  // Roof with icing scallops and gumdrop lights
  const roof = b.canvas(3);
  for (let i = 0; i <= 19; i++) {
    const y = 14 + i, hw = Math.round(i * 1.25) + 1;
    for (let x = 64 - hw; x <= 64 + hw; x++) {
      const edge = Math.abs(x - 64) >= hw - 1;
      let c = (x + i) % 5 === 0 ? '#8f5426' : '#b8743a';
      if (i % 4 === 3) c = (x + i) % 3 ? ICE : '#dfe7f5';
      if (edge || i === 19) c = ICE;
      if (!edge && i % 4 === 1 && (x + i) % 6 === 0 && i > 2) roof.put(x, y, LIGHTS[Math.floor(r() * 5)], b.light());
      else roof.put(x, y, c);
    }
  }
  for (let x = 41; x <= 87; x += 4) roof.put(x, 34, LIGHTS[(x >> 2) % 5], b.light());
  b.sprite('House', 3.0, 5.6, roof.list());

  const chim = b.canvas(2.8);
  for (let y = 16; y <= 24; y++) for (let x = 74; x <= 78; x++) chim.put(x, y, y === 16 ? ICE : (x + y) % 4 === 0 ? '#8f5426' : '#a8652e');
  for (let x = 73; x <= 79; x++) chim.put(x, 15, ICE);
  [[0, 2], [1, 4], [0, 6], [2, 8], [1, 10]].forEach(([sx, sy]) => chim.put(76 + sx, 14 - sy, '#8a94c0', { tw: true }));
  const drop = b.canvas(3.2);
  drop.map(['.RRR.', 'RRRRR', 'RWRRR'], { R: '#d8343a', W: '#ff8a8a' }, 62, 11);
  b.sprite('House', 5.4, 6.8, [...chim.list(), ...drop.list()]);

  // Candy garden
  const lolli = b.canvas(4);
  [[29, '#d8343a'], [100, '#2f8f4e']].forEach(([cx, col]) => {
    for (let y = 48; y < 60; y++) lolli.put(cx, y, '#f6f9ff');
    for (let y = 40; y <= 48; y++) for (let x = cx - 4; x <= cx + 4; x++) {
      const dx = x - cx, dy = y - 44, d = dx * dx + dy * dy;
      if (d > 17) continue;
      const ang = Math.atan2(dy, dx) + Math.sqrt(d) * 0.9;
      lolli.put(x, y, Math.sin(ang * 2) > 0 ? col : '#f6f9ff');
    }
  });
  b.sprite('Candy', 0, 1.8, lolli.list());

  const canes = b.canvas(4.1);
  [[10, 1], [117, -1]].forEach(([x, d]) => {
    for (let y = 45; y < 60; y++) for (let k = 0; k < 2; k++) canes.put(x + k * d, y, (y + k) % 4 < 2 ? '#d8343a' : '#f6f9ff');
    [[0, 44], [0, 43], [d, 42], [2 * d, 41], [3 * d, 41], [4 * d, 42], [5 * d, 43], [5 * d, 44], [d, 43], [4 * d, 43]].forEach(([dx, y], i) => canes.put(x + dx, y, i % 2 ? '#d8343a' : '#f6f9ff'));
  });
  b.sprite('Candy', 1.2, 2.8, canes.list());

  const gums = b.canvas(4.2);
  [[37, '#ff5a5a'], [49, '#7dff9a'], [79, '#ffd447'], [91, '#9b5de5'], [108, '#5ab8ff']].forEach(([x, col]) => {
    gums.map(['.GG.', 'GHGG', 'GGGG'], { G: col, H: '#ffffff' }, x, 57);
  });
  const path = b.canvas(1.5);
  for (let y = 60; y < GH; y++) {
    const hw = 4 + Math.floor((y - 60) * 0.7);
    for (let x = 64 - hw; x <= 64 + hw; x++) if ((x + y * 2) % 5 !== 0) path.put(x, y, (x + y) % 3 ? '#e8b3c8' : '#d99ab4');
  }
  b.sprite('Candy', 2.4, 4.0, [...gums.list(), ...path.list()]);

  // Gingerbread friends
  const GB = ['...BBB...', '..BBBBB..', '..BWBWB..', '..BBBBB..', '..BWWWB..', '...BBB...', 'WBBBBBBBW', 'WBBBRBBBW', '...BGB...', '..BBBBB..', '..BB.BB..', '.WBB.BBW.', '.BBB.BBB.'];
  const leg = c => ({ B: c, W: '#f6f9ff', R: '#d8343a', G: '#2f8f4e' });
  [[16, 7.1, '#c07a3e', 0], [34, 7.2, '#b5703a', 1.3], [86, 7.3, '#c98444', 2.6]].forEach(([x, L, col, t0]) => {
    b.sprite('Friends', t0, t0 + 1.6, b.canvas(L).map(GB, leg(col), x, 47).list());
  });

  return b.finish();
}

const SCENE = buildScene();

function GingerbreadPiece({ arrival, snow }) {
  return (
    <PixelPiece arrival={arrival} snow={snow} SCENE={SCENE} pushCue="House" origin="50% 62%"
      layerTf={(n, T, env) => HOP[n] !== undefined ? `translate(0 ${-Math.abs(Math.sin(T * 3 + HOP[n])) * 1.6 * env})` : undefined}
      glows={(T, CUES, env, meltOut) => [
        { x: 64, y: 44, size: 620, rgb: '255,196,110', a: 0.32, op: animate({ from: 0, to: 1, start: CUES.House + 2.5, end: CUES.Candy, ease: MOTION.glide })(T) * meltOut * (0.85 + 0.15 * Math.sin(T * 2)) },
      ]}
    />
  );
}

window.GingerbreadApp = makeApp(GingerbreadPiece);
