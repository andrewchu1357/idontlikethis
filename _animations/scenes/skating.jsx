// Pixel Skating Pond: a frozen pond in a park, lamp posts, a string of lights and skaters.
const GLIDE = { 7.1: [0.8, 0, 11], 7.2: [0.8, 3.1, 10], 7.3: [1.15, 1.7, 6] };
const LAMPS = [[30, 30], [98, 30]];

function buildScene() {
  const b = makeBuilder(1708), r = b.r;

  snowGround(b, 'Ground', 0, 2.2, 54);
  const sky = b.canvas(0);
  crescentMoon(sky, 110, 9);
  b.sprite('Ground', 1.0, 2.6, sky.list());
  starField(b, 'Ground', 1.0, 3.0, 55, 30, (x, y) => x > 100 && y < 17);

  const hills = b.canvas(0.4);
  const h1 = x => Math.round(44 + 3 * Math.sin(x / 13 + 1) + 1.5 * Math.sin(x / 5));
  for (let x = 0; x < GW; x++) for (let y = h1(x); y < 54; y++) hills.put(x, y, y === h1(x) ? '#4a5899' : (x * 3 + y * 5) % 7 === 0 ? '#1f2960' : '#252f66');
  b.sprite('Ground', 0.4, 2.4, hills.list());

  // Pond
  const pond = b.canvas(1.5);
  for (let y = 56; y < GH; y++) for (let x = 18; x <= 110; x++) {
    const e = ((x - 64) / 44) ** 2 + ((y - 63.5) / 7) ** 2;
    if (e > 1) continue;
    let c = '#9fc3e6';
    if (e > 0.8) c = '#7aa3d4';
    else if (((x - 2 * y) % 19 + 19) % 19 < 2) c = '#d6e8fa';
    else if ((x * 7 + y * 3) % 13 === 0) c = '#b4d2ee';
    pond.put(x, y, c);
  }
  b.sprite('Pond', 0, 3.2, pond.list(), p => Math.abs(p.x - 64) / 10 + Math.abs(p.y - 63) / 3 + r());

  // Park: lamp posts, light string, bench, pines
  const lamps = b.canvas(2);
  LAMPS.forEach(([x, top], k) => {
    for (let y = top + 4; y < 56; y++) lamps.put(x, y, y > 53 ? '#1b1e30' : x % 2 ? '#2b2f45' : '#2b2f45');
    for (let dx = -1; dx <= 1; dx++) lamps.put(x + dx, 55, '#1b1e30');
    lamps.map(['.KKK.', 'KYYYK', 'KYYYK', '.KKK.'], { K: '#1b1e30', Y: '#ffd447' }, x - 2, top, (ch) => ch === 'Y' ? { win: true, ph: k * 2 } : null);
    lamps.put(x, top - 1, '#f6f9ff'); lamps.put(x - 1, top - 1, '#f6f9ff'); lamps.put(x + 1, top - 1, '#f6f9ff');
  });
  b.sprite('Park', 0, 1.8, lamps.list());

  const string = b.canvas(2.2);
  const [ax, ay] = [LAMPS[0][0] + 2, LAMPS[0][1] + 2], bx = LAMPS[1][0] - 2;
  for (let x = ax; x <= bx; x++) {
    const u = (x - ax) / (bx - ax), y = Math.round(ay + 9 * (1 - (2 * u - 1) ** 2));
    if ((x - ax) % 4 === 2) string.put(x, y + 1, LIGHTS[((x - ax) >> 2) % 5], b.light());
    string.put(x, y, '#3a3f5a');
  }
  b.sprite('Park', 1.4, 3.2, string.list(), p => p.x + r());

  const bench = b.canvas(2.1);
  bench.map(['BBBBBBBBBBB', 'bbbbbbbbbbb', '...........', 'BBBBBBBBBBB', '.K.......K.', '.K.......K.'], { B: '#8b5a2b', b: '#6b4220', K: '#1b1e30' }, 4, 49);
  for (let x = 4; x <= 14; x++) bench.put(x, 48, '#f6f9ff');
  b.sprite('Park', 2.4, 3.8, bench.list());

  const pines = b.canvas(1.8);
  [[18, 53, 13], [110, 53, 15], [121, 53, 11], [9, 47, 7]].forEach(([x, base, h]) => pine(b, pines, x, base, h, { dark: '#1a5a34', lite: '#2f8f4e', lights: 0.14 }));
  b.sprite('Park', 3.4, 5.6, pines.list());

  // Skaters
  const SK = ['...W...', '..HHH..', '.HHHHH.', '..SSS..', '..SSS..', '.FFFFFF', 'CCCCCCC', 'S.CCC.S', '..CCC..', '..PPP..', '..P.P..', '..P.P..', '.KK.KK.', 'BBB.BBB'];
  const KID = ['.HHH.', 'HHHHH', '.SSS.', '.SSS.', 'FFFFF', 'CCCCC', '.CCC.', '.P.P.', 'KK.KK', 'BB.BB'];
  const leg = (h, f, c, p) => ({ W: '#f6f9ff', H: h, S: '#f6c6a0', F: f, C: c, P: p, K: '#1b1b22', B: '#dfe7f5' });
  b.sprite('Skaters', 0, 1.7, b.canvas(7.1).map(SK, leg('#2f8f4e', '#d8343a', '#3d7fe0', '#2b2f45'), 44, 49).list());
  b.sprite('Skaters', 1.3, 3.0, b.canvas(7.2).map(SK, leg('#d8343a', '#f6f9ff', '#9b5de5', '#3a2a3a'), 72, 50).list());
  b.sprite('Skaters', 2.7, 4.3, b.canvas(7.3).map(KID, leg('#ffd447', '#2f8f4e', '#d8343a', '#2b2f45'), 60, 56).list());

  return b.finish();
}

const SCENE = buildScene();

function SkatingPiece({ arrival, snow }) {
  return (
    <PixelPiece arrival={arrival} snow={snow} SCENE={SCENE} pushCue="Pond" origin="50% 75%"
      layerTf={(n, T, env) => {
        const g = GLIDE[n];
        if (!g) return undefined;
        const s = Math.sin(T * g[0] + g[1]);
        return `translate(${(s * g[2] * env).toFixed(2)} ${(-Math.abs(Math.cos(T * g[0] * 2 + g[1])) * 0.4 * env).toFixed(2)})`;
      }}
      glows={(T, CUES, env, meltOut) => LAMPS.map(([x, y], k) => ({
        x, y: y + 1.5, size: 260, rgb: '255,212,110', a: 0.5,
        op: animate({ from: 0, to: 1, start: CUES.Park + 0.8, end: CUES.Park + 2.2, ease: MOTION.glide })(T) * meltOut * (0.85 + 0.15 * Math.sin(T * 2.2 + k)),
      }))}
    />
  );
}

window.SkatingApp = makeApp(SkatingPiece);
