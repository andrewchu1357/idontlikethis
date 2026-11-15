// Pixel Carolers: a snowy street of townhouses and a shop, carolers singing under a lamp.
const SWAY = { 7.1: 0, 7.2: 0.9, 7.3: 1.8, 7.4: 2.7 };
const SINGERS = [77, 87, 97, 107];
const NOTE_A = ['..X', '..X', '..X', 'XXX', 'XX.'];
const NOTE_B = ['.XXXX', '.X..X', '.X..X', 'XX.XX', 'XX.XX'];
const LAMP = [118, 22];

function buildScene() {
  const b = makeBuilder(2512), r = b.r;

  snowGround(b, 'Ground', 0, 2.2);
  starField(b, 'Ground', 1.0, 3.0, 50, 16);
  const moon = b.canvas(0);
  crescentMoon(moon, 14, 7);
  b.sprite('Ground', 1.2, 2.8, moon.list());

  const wreath = (cv, cx, cy) => {
    cv.map(['.GGG.', 'GG.GG', 'G...G', 'GG.GG', '.GRG.'], { G: '#2f8f4e', R: '#d8343a' }, cx - 2, cy - 2);
    cv.put(cx - 1, cy - 1, '#226f3c'); cv.put(cx + 1, cy + 1, '#47ad5c');
  };
  const window4 = (cv, x0, y0, w, h, ph) => {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
      const bar = x === x0 + Math.floor(w / 2) || y === y0 + Math.floor(h / 2);
      cv.put(x, y, bar ? '#3a2a2a' : '#ffd447', bar ? null : { win: true, ph });
    }
    for (let x = x0 - 1; x <= x0 + w; x++) cv.put(x, y0 + h, '#f6f9ff');
  };

  // House A: brick, flat roof
  const A = b.canvas(2);
  for (let y = 22; y < 60; y++) for (let x = 3; x <= 33; x++) A.put(x, y, y < 24 ? '#f6f9ff' : y === 24 ? '#5a2a22' : (y % 3 === 0 || (x + (Math.floor(y / 3) % 2) * 2) % 4 === 0) ? '#6a3127' : '#7a3b2e');
  [9, 17, 25].forEach(x => { window4(A, x, 28, 4, 5, r() * 6); window4(A, x, 37, 4, 5, r() * 6); });
  for (let y = 49; y < 60; y++) for (let x = 16; x <= 21; x++) A.put(x, y, x === 16 || x === 21 || y === 49 ? '#f6f9ff' : '#1f5a34');
  wreath(A, 18, 52);
  for (let x = 6; x <= 9; x++) for (let y = 17; y < 22; y++) A.put(x, y, y === 17 ? '#f6f9ff' : '#5a2a22');
  [[0, 2], [1, 4], [0, 6], [1, 8]].forEach(([sx, sy]) => A.put(7 + sx, 16 - sy, '#8a94c0', { tw: true }));
  b.sprite('Street', 0, 2.6, A.list());

  // House B: the shop
  const B = b.canvas(2);
  for (let y = 28; y < 60; y++) for (let x = 37; x <= 73; x++) B.put(x, y, y < 30 ? '#f6f9ff' : y === 30 ? '#2d3a5a' : x === 73 ? '#48587c' : '#5d6f96');
  [42, 53, 64].forEach(x => window4(B, x, 33, 5, 4, r() * 6));
  for (let y = 41; y <= 43; y++) for (let x = 39; x <= 61; x++) B.put(x, y, (Math.floor((x - 39) / 2)) % 2 ? '#f6f9ff' : '#d8343a');
  for (let x = 39; x <= 61; x += 2) B.put(x, 44, '#d8343a');
  for (let y = 46; y <= 56; y++) for (let x = 41; x <= 59; x++) B.put(x, y, x === 41 || x === 59 || y === 46 || y === 56 ? '#3a2a2a' : '#ffd88a', x === 41 || x === 59 || y === 46 || y === 56 ? null : { win: true, ph: 4 });
  for (let i = 0; i < 7; i++) for (let x = 47 - Math.floor(i / 2); x <= 47 + Math.floor(i / 2); x++) B.put(x, 48 + i, i === 0 ? '#ffd447' : x % 2 ? '#2f8f4e' : '#226f3c');
  B.put(47, 55, '#6b3d1f');
  present(B, 50, 4, 3, '#d8343a', '#a02129', '#ec5a5f', '#ffd447', 56);
  present(B, 55, 3, 3, '#3d7fe0', '#2a5aa8', '#6a9ff0', '#f6f9ff', 56);
  for (let y = 46; y < 60; y++) for (let x = 63; x <= 69; x++) B.put(x, y, x === 63 || x === 69 || y === 46 ? '#f6f9ff' : '#7a2e2a');
  wreath(B, 66, 49);
  B.put(68, 53, '#ffd447');
  b.sprite('Street', 1.6, 4.2, B.list());

  // House C: gabled
  const H = b.canvas(2);
  for (let y = 24; y < 60; y++) for (let x = 77; x <= 105; x++) H.put(x, y, x === 105 || y % 3 === 0 ? '#765a35' : '#8a6a3f');
  for (let i = 0; i < 12; i++) {
    const hw = Math.round(i * 1.35) + 1, y = 12 + i;
    for (let x = 91 - hw; x <= 91 + hw; x++) H.put(x, y, i < 1 || Math.abs(x - 91) >= hw - 1 ? '#f6f9ff' : (x + i) % 3 ? '#3a2a2a' : '#2d2226');
  }
  window4(H, 89, 17, 4, 4, 2.2);
  [81, 97].forEach(x => { window4(H, x, 28, 4, 5, r() * 6); window4(H, x, 38, 4, 5, r() * 6); });
  for (let y = 48; y < 60; y++) for (let x = 88; x <= 94; x++) H.put(x, y, x === 88 || x === 94 || y === 48 ? '#f6f9ff' : '#2a3a6a');
  wreath(H, 91, 51);
  b.sprite('Street', 3.2, 5.6, H.list());

  // Street lamp
  const lamp = b.canvas(2.4);
  const [lx, ly] = LAMP;
  for (let y = ly + 4; y < 60; y++) lamp.put(lx, y, '#1b1e30');
  for (let x = lx - 1; x <= lx + 1; x++) { lamp.put(x, 59, '#1b1e30'); lamp.put(x, 58, '#1b1e30'); }
  lamp.map(['.KKK.', 'KYYYK', 'KYYYK', 'KYYYK', '.KKK.'], { K: '#1b1e30', Y: '#ffd447' }, lx - 2, ly - 1, ch => ch === 'Y' ? { win: true, ph: 1 } : null);
  lamp.put(lx, ly - 2, '#f6f9ff'); lamp.put(lx - 1, ly - 2, '#f6f9ff'); lamp.put(lx + 1, ly - 2, '#f6f9ff');
  for (let y = 30; y <= 34; y++) lamp.put(lx + 1, y, y % 2 ? '#d8343a' : '#2f8f4e');
  pine(b, lamp, 124, 59, 9, { dark: '#1a5a34', lite: '#2f8f4e', lights: 0.2 });
  b.sprite('Street', 4.8, 6.6, lamp.list());

  // Carolers
  const SING = ['..HHH..', '.HHHHH.', '..SSS..', '..SMS..', '..SSS..', '.FFFFF.', 'CCCCCCC', 'CCBWBCC', 'CCBBBCC', '.CCCCC.', '.CCCCC.', '.CCCCC.', '..L.L..', '..L.L..', '.KK.KK.'];
  const TOP = ['..KKK..', '.KKKKK.'], BONNET = ['..HHH..', '.HHHHHH'];
  const leg = (h, f, c, l) => ({ H: h, S: '#f6c6a0', M: '#7a2a2a', F: f, C: c, B: '#d8343a', W: '#f6f9ff', L: l, K: '#1b1b22' });
  const looks = [
    [TOP, leg('#1b1b22', '#d8343a', '#2a3a6a', '#2b2f45')],
    [BONNET, leg('#d8343a', '#f6f9ff', '#2f8f4e', '#2f8f4e')],
    [null, leg('#ffd447', '#3d7fe0', '#7a3b2e', '#2b2f45')],
    [BONNET, leg('#9b5de5', '#ffd447', '#8a2c28', '#8a2c28')],
  ];
  SINGERS.forEach((x, k) => {
    const rows = looks[k][0] ? looks[k][0].concat(SING.slice(2)) : SING;
    b.sprite('Carolers', k * 1.2, k * 1.2 + 1.6, b.canvas([7.1, 7.2, 7.3, 7.4][k]).map(rows, looks[k][1], x, 45).list());
  });

  return b.finish();
}

const SCENE = buildScene();

function caroleNotes(T, CUES, env) {
  if (env < 0.01) return null;
  const out = [];
  for (let k = 0; k < 8; k++) {
    const life = 3.6, ph = ((T - CUES.Celebrate) + k * life / 8) % life;
    if (ph < 0) continue;
    const singer = SINGERS[k % 4], u = ph / life;
    const x = Math.round(singer + 3 + Math.sin(u * 6 + k) * 3 + (k % 2 ? 2 : -2));
    const y = Math.round(42 - u * 22);
    const op = Math.sin(Math.PI * u) * env;
    out.push(...pixelShape(k % 3 === 1 ? NOTE_B : NOTE_A, x, y, k % 2 ? '#ffd447' : '#f6f9ff', op, 'n' + k));
  }
  return out;
}

function CarolersPiece({ arrival, snow }) {
  return (
    <PixelPiece arrival={arrival} snow={snow} SCENE={SCENE} pushCue="Street" origin="68% 70%"
      layerTf={(n, T, env) => SWAY[n] !== undefined ? `translate(${(Math.sin(T * 2.2 + SWAY[n]) * 0.6 * env).toFixed(2)} ${(-Math.abs(Math.sin(T * 2.2 + SWAY[n])) * 0.5 * env).toFixed(2)})` : undefined}
      glows={(T, CUES, env, meltOut) => [
        { x: LAMP[0], y: LAMP[1] + 1, size: 420, rgb: '255,212,110', a: 0.5, op: animate({ from: 0, to: 1, start: CUES.Street + 5.6, end: CUES.Carolers, ease: MOTION.glide })(T) * meltOut * (0.88 + 0.12 * Math.sin(T * 2)) },
        { x: 50, y: 51, size: 300, rgb: '255,200,120', a: 0.35, op: animate({ from: 0, to: 1, start: CUES.Street + 2.5, end: CUES.Street + 4, ease: MOTION.glide })(T) * meltOut },
      ]}
      extras={(T, CUES, env) => caroleNotes(T, CUES, env)}
    />
  );
}

window.CarolersApp = makeApp(CarolersPiece);
