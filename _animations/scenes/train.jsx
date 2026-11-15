// Pixel Holiday Train: a steam train hauling presents and a lit tree across the snow.
const ROD_L = 3.5;
const STACK = { x: 110, y: 31 };
const LAMP = { x: 116, y: 38 };

function buildScene() {
  const b = makeBuilder(1031), r = b.r;

  snowGround(b, 'Ground', 0, 2.2);
  const sky = b.canvas(0);
  crescentMoon(sky, 14, 8);
  b.sprite('Ground', 1.0, 2.6, sky.list());
  starField(b, 'Ground', 1.0, 3.0, 60, 30, (x, y) => x < 24 && y < 16);

  const far = b.canvas(0.4), near = b.canvas(0.6);
  const h1 = x => Math.round(41 + 4 * Math.sin(x / 16 + 0.5) + 2 * Math.sin(x / 7));
  const h2 = x => Math.round(49 + 2.5 * Math.sin(x / 10 + 2) + Math.sin(x / 4));
  for (let x = 0; x < GW; x++) {
    for (let y = h1(x); y < 55; y++) far.put(x, y, y === h1(x) ? '#4a5899' : (x * 3 + y * 5) % 7 === 0 ? '#1f2960' : '#252f66');
    for (let y = h2(x); y < 55; y++) near.put(x, y, y === h2(x) ? '#96a5d8' : (x + y) % 5 === 0 ? '#3e4b87' : '#46548f');
  }
  b.sprite('Ground', 0.4, 2.4, far.list());
  b.sprite('Ground', 0.9, 2.7, near.list());
  const pines = b.canvas(0.7);
  [[8, 9], [19, 7], [57, 8], [64, 11], [96, 7], [124, 10]].forEach(([x, h]) => pine(b, pines, x, h2(x), h));
  b.sprite('Ground', 1.8, 3.0, pines.list());

  // Tracks
  const track = b.canvas(1.2);
  for (let x = 0; x < GW; x++) {
    track.put(x, 55, x % 2 ? '#8a94c0' : '#c9d6ea');
    track.put(x, 56, x % 4 < 2 ? '#5a3a22' : '#3a3f5a');
    for (let y = 57; y < 60; y++) track.put(x, y, (x * 7 + y * 3) % 5 === 0 ? '#5a5f7a' : r() < 0.5 ? '#3a3f5a' : '#4a4f6a');
  }
  b.sprite('Tracks', 0, 2.6, track.list(), p => p.x * 0.1 + r());
  const signal = b.canvas(1.3);
  for (let y = 41; y < 55; y++) signal.put(124, y, '#2b2f45');
  signal.map(['KKK', 'KRK', 'KKK', 'KGK', 'KKK'], { K: '#1b1e30', R: '#ff5a5a', G: '#7dff9a' }, 123, 36, ch => ch === 'R' || ch === 'G' ? { win: true, ph: ch === 'R' ? 0 : 3 } : null);
  b.sprite('Tracks', 2.2, 3.4, signal.list());

  const wheel = (cv, cx, cy, rr, rim, hub) => {
    for (let y = Math.floor(cy - rr); y <= Math.ceil(cy + rr); y++) for (let x = Math.floor(cx - rr); x <= Math.ceil(cx + rr); x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rr) cv.put(x, y, d > rr - 1 ? rim : (x === Math.round(cx) || y === Math.round(cy)) ? hub : '#1b1b22');
    }
  };

  // Engine
  const eng = b.canvas(3);
  for (let x = 86; x <= 116; x++) eng.put(x, 51, '#1b1b22');
  for (let y = 37; y <= 50; y++) for (let x = 86; x <= 96; x++) {
    const win = x >= 89 && x <= 93 && y >= 39 && y <= 43;
    const frame = win && (x === 89 || x === 93 || y === 39 || y === 43);
    eng.put(x, y, frame ? '#1b1b22' : win ? '#ffd447' : x === 96 ? '#a02129' : y === 46 ? '#ffd447' : '#d8343a', win && !frame ? { win: true, ph: 1.2 } : null);
  }
  for (let x = 85; x <= 97; x++) { eng.put(x, 36, '#1b1b22'); eng.put(x, 35, '#3a3f5a'); eng.put(x, 34, '#f6f9ff'); }
  for (let y = 41; y <= 50; y++) for (let x = 97; x <= 112; x++) eng.put(x, y, x === 101 || x === 107 ? '#ffd447' : y === 41 ? '#3a8a55' : y >= 49 ? '#14492a' : '#1f6a3c');
  for (let y = 40; y <= 50; y++) for (let x = 113; x <= 115; x++) eng.put(x, y, y === 40 ? '#3a3f5a' : '#2b2f45');
  for (let y = 34; y <= 40; y++) for (let x = 109; x <= 111; x++) eng.put(x, y, x === 111 ? '#2b2f45' : '#1b1b22');
  for (let x = 108; x <= 112; x++) { eng.put(x, 32, '#1b1b22'); eng.put(x, 33, '#2b2f45'); }
  for (let y = 38; y <= 40; y++) for (let x = 103; x <= 105; x++) eng.put(x, y, x === 105 ? '#c48a1d' : '#ffd447');
  eng.put(104, 37, '#ffd447');
  for (let y = 36; y <= 39; y++) for (let x = 114; x <= 117; x++) {
    const glass = (x === 115 || x === 116) && (y === 37 || y === 38);
    eng.put(x, y, glass ? '#fff4c4' : '#1b1b22', glass ? { win: true, ph: 0.4 } : null);
  }
  for (let y = 49; y <= 54; y++) for (let x = 116; x <= 116 + (y - 48); x++) eng.put(x, y, (x + y) % 2 ? '#d8343a' : '#a02129');
  wheel(eng, 100, 52, 2.6, '#d8343a', '#ffd447');
  wheel(eng, 107, 52, 2.6, '#d8343a', '#ffd447');
  wheel(eng, 113, 53, 1.6, '#a02129', '#ffd447');
  wheel(eng, 90, 53, 1.6, '#a02129', '#ffd447');
  wheel(eng, 94, 53, 1.6, '#a02129', '#ffd447');
  b.sprite('Train', 0, 3.4, eng.list());

  const rod = b.canvas(ROD_L);
  for (let x = 99; x <= 108; x++) rod.put(x, 52, '#c9d6ea');
  b.sprite('Train', 3.2, 3.6, rod.list(), p => p.x);

  // Tender, cars and caboose
  const cars = b.canvas(3);
  for (let y = 42; y <= 50; y++) for (let x = 72; x <= 83; x++) cars.put(x, y, y === 42 ? '#3a3f5a' : y === 46 ? '#ffd447' : '#2b2f45');
  for (let x = 73; x <= 82; x++) { cars.put(x, 41, x % 3 ? '#1b1b22' : '#3a3a44'); if (x % 2) cars.put(x, 40, '#1b1b22'); }
  for (let x = 72; x <= 83; x++) cars.put(x, 51, '#1b1b22');
  wheel(cars, 75, 53, 1.6, '#a02129', '#ffd447'); wheel(cars, 80, 53, 1.6, '#a02129', '#ffd447');
  [84, 85, 70, 71, 46, 47, 20, 21].forEach(x => cars.put(x, 49, '#5a5f7a'));
  b.sprite('Train', 2.8, 4.4, cars.list());

  const flat = b.canvas(3);
  for (let x = 48; x <= 69; x++) { flat.put(x, 48, '#8b5a2b'); flat.put(x, 49, '#6b4220'); flat.put(x, 50, '#6b4220'); flat.put(x, 51, '#1b1b22'); }
  wheel(flat, 52, 53, 1.6, '#a02129', '#ffd447'); wheel(flat, 65, 53, 1.6, '#a02129', '#ffd447');
  for (let x = 22; x <= 45; x++) for (let y = 47; y <= 51; y++) flat.put(x, y, y === 51 ? '#1b1b22' : y === 47 ? '#ffd447' : '#9e1f24');
  wheel(flat, 27, 53, 1.6, '#a02129', '#ffd447'); wheel(flat, 40, 53, 1.6, '#a02129', '#ffd447');
  b.sprite('Train', 3.8, 5.6, flat.list(), p => -p.x + r() * 4);

  const cab = b.canvas(3);
  for (let y = 38; y <= 50; y++) for (let x = 2; x <= 19; x++) {
    const win = (x >= 5 && x <= 7 || x >= 14 && x <= 16) && y >= 41 && y <= 44;
    cab.put(x, y, win ? '#ffd447' : y === 38 ? '#1b1b22' : y === 47 ? '#ffd447' : x === 19 ? '#a02129' : '#d8343a', win ? { win: true, ph: x } : null);
  }
  for (let y = 32; y <= 37; y++) for (let x = 8; x <= 13; x++) {
    const win = x >= 10 && x <= 11 && y >= 34 && y <= 35;
    cab.put(x, y, y === 32 ? '#1b1b22' : win ? '#ffd447' : '#d8343a', win ? { win: true, ph: 5 } : null);
  }
  for (let x = 1; x <= 20; x++) { cab.put(x, 37, '#1b1b22'); cab.put(x, 51, '#1b1b22'); }
  for (let x = 7; x <= 14; x++) cab.put(x, 31, '#f6f9ff');
  for (let x = 1; x <= 7; x++) cab.put(x, 36, '#f6f9ff');
  for (let x = 14; x <= 20; x++) cab.put(x, 36, '#f6f9ff');
  wheel(cab, 6, 53, 1.6, '#a02129', '#ffd447'); wheel(cab, 15, 53, 1.6, '#a02129', '#ffd447');
  b.sprite('Train', 5.0, 6.9, cab.list());

  // Cargo
  const gifts = b.canvas(4);
  present(gifts, 50, 7, 7, '#d8343a', '#a02129', '#ec5a5f', '#4fd27a', 48);
  present(gifts, 58, 5, 5, '#3d7fe0', '#2a5aa8', '#6a9ff0', '#ffd447', 48);
  present(gifts, 63, 6, 9, '#f2b632', '#c48a1d', '#ffd25e', '#d8343a', 48);
  present(gifts, 53, 5, 4, '#9b5de5', '#6f3fb0', '#b88af0', '#f6f9ff', 41);
  b.sprite('Cargo', 0, 2.4, gifts.list());

  const tree = b.canvas(4);
  pine(b, tree, 33, 46, 15, { dark: '#226f3c', lite: '#2f8f4e', lights: 0.28 });
  tree.map(['.Y.', 'YWY', '.Y.'], { Y: '#ffd447', W: '#fff7c2' }, 32, 30);
  b.sprite('Cargo', 1.6, 4.3, tree.list());

  return b.finish();
}

const SCENE = buildScene();

function smoke(T, CUES, env) {
  if (env < 0.01) return null;
  const out = [];
  for (let k = 0; k < 9; k++) {
    const life = 2.7, u = (((T - CUES.Celebrate) + k * life / 9) % life) / life;
    if (u < 0) continue;
    const cx = STACK.x - u * 46, cy = STACK.y - 1 - u * 16 + Math.sin(u * 7 + k) * 1.2, rr = 1 + u * 2.6;
    const op = env * 0.95 * (1 - u * 0.9) * Math.min(1, u * 8);
    for (let y = Math.floor(cy - rr); y <= Math.ceil(cy + rr); y++) for (let x = Math.floor(cx - rr); x <= Math.ceil(cx + rr); x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rr) out.push(<rect key={'p' + k + '_' + x + '_' + y} x={x} y={y} width="1" height="1" fill={d > rr - 1 ? '#c9d6ea' : (x + y) % 3 ? '#f2f6fc' : '#dfe7f5'} opacity={op * (d > rr - 1 ? 0.7 : 1)} />);
    }
  }
  return out;
}

function TrainPiece({ arrival, snow }) {
  return (
    <PixelPiece arrival={arrival} snow={snow} SCENE={SCENE} pushCue="Tracks" origin="55% 65%"
      layerTf={(n, T, env) => n === ROD_L ? `translate(${(Math.sin(T * 7) * 1.2 * env).toFixed(2)} ${(Math.cos(T * 7) * 0.8 * env).toFixed(2)})` : undefined}
      glows={(T, CUES, env, meltOut) => [
        { x: LAMP.x + 2, y: LAMP.y, size: 360, rgb: '255,236,170', a: 0.55, op: animate({ from: 0, to: 1, start: CUES.Train + 1.5, end: CUES.Train + 3, ease: MOTION.glide })(T) * meltOut },
        { x: 33, y: 40, size: 260, rgb: '255,214,90', a: 0.3, op: env },
      ]}
      extras={(T, CUES, env) => smoke(T, CUES, env)}
    />
  );
}

window.TrainApp = makeApp(TrainPiece);
