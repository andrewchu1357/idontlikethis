// Pixel Rooftop: Santa pops out of a chimney while the sleigh waits on the ridge.
const MOON = { x: 26, y: 14, r: 9 };
const HOP = { 6.1: 0, 6.2: 1.5 };
const SANTA_L = 2.3;

function buildScene() {
  const b = makeBuilder(1224), r = b.r;

  const sky = b.canvas(0);
  fullMoon(sky, MOON.x, MOON.y, MOON.r);
  b.sprite('Ground', 0.6, 2.4, sky.list(), p => (p.x - MOON.x) ** 2 + (p.y - MOON.y) ** 2 + r() * 8);
  starField(b, 'Ground', 1.0, 3.2, 60, 32, (x, y) => (x - MOON.x) ** 2 + (y - MOON.y) ** 2 < 140);

  // Distant town
  const town = b.canvas(0.4);
  let x0 = -3;
  while (x0 < GW) {
    const w = 9 + Math.floor(r() * 7), top = 36 + Math.floor(r() * 9), peak = Math.floor(w / 2) + 1, mid = x0 + w / 2;
    for (let x = x0; x < x0 + w; x++) {
      const roofTop = top - peak + Math.round(Math.abs(x - mid + 0.5));
      for (let y = roofTop; y < 60; y++) {
        let c = y < top ? '#2a3570' : (x + y) % 9 === 0 ? '#1a2154' : '#1f285e';
        if (y === roofTop) c = '#8a99c9';
        town.put(x, y, c);
      }
    }
    for (let k = 0; k < 3; k++) {
      const wx = x0 + 2 + Math.floor(r() * (w - 4)), wy = top + 2 + Math.floor(r() * 10);
      if (r() < 0.75) { town.put(wx, wy, '#ffd447', { win: true, ph: r() * 6.28 }); town.put(wx, wy + 1, '#ffd447', { win: true, ph: r() * 6.28 }); }
    }
    x0 += w + (r() < 0.3 ? 1 : 0);
  }
  b.sprite('Ground', 1.2, 3.4, town.list(), p => p.x * 0.08 - p.y * 0.3 + r());

  // Foreground roof
  const roof = b.canvas(2);
  for (let y = 44; y < GH; y++) {
    const xl = y < 47 ? 15 : Math.ceil(15 - (y - 46) * 0.62);
    for (let x = Math.max(0, xl); x < GW; x++) {
      const snowTop = 44 + ((x * 13) % 7 < 3 ? 0 : 1);
      if (y < snowTop) continue;
      let c;
      if (y <= 46) c = y === 46 ? '#dfe7f5' : '#f2f6fc';
      else if (x === xl) c = '#f2f6fc';
      else {
        const row = Math.floor((y - 47) / 3), off = row % 2 ? 2 : 0;
        c = (y - 47) % 3 === 2 || (x + off) % 5 === 0 ? '#5a201e' : (x * 3 + row * 7) % 11 === 0 ? '#8f3a32' : '#7a2e2a';
        if (r() < 0.025) c = '#dfe7f5';
      }
      roof.put(x, y, c);
    }
  }
  b.sprite('Roof', 0, 3.2, roof.list());

  const chim = b.canvas(2.5);
  for (let y = 26; y <= 46; y++) for (let x = 84; x <= 94; x++) {
    const row = Math.floor((y - 26) / 2);
    chim.put(x, y, (y - 26) % 2 === 1 || (x + (row % 2) * 3) % 6 === 0 ? '#6f3328' : x === 94 ? '#7f3a2d' : '#9a4a3a');
  }
  for (let x = 83; x <= 95; x++) { chim.put(x, 24, '#4a2a24'); chim.put(x, 25, '#3a2020'); chim.put(x, 23, '#f2f6fc'); }
  chim.put(84, 22, '#f2f6fc'); chim.put(85, 22, '#f2f6fc'); chim.put(93, 22, '#f2f6fc');
  b.sprite('Roof', 2.6, 5.2, chim.list());

  // Santa
  const SANTA = ['.....RRRR..', '....RRRRRRW', '...RRRRRRWW', '..WWWWWWW..', '..SSSSSSS..', '..SKSSSKS..', '..SSSPSSS..', '.WWWSSSWWW.', '.WWWWWWWWW.', 'RRWWWWWWWRR', 'RRRWWWWWRRR', 'SRRRWWWRRRS', '.RRRRRRRRR.', '.KKKKYKKKK.', '.RRRRRRRRR.', '.RRRRRRRRR.', '.RRRRRRRRR.', '.RRRRRRRRR.'];
  const SL = { R: '#d62f2f', W: '#f4f4f4', S: '#f6c6a0', K: '#1b1b22', P: '#e98a7a', Y: '#ffd447' };
  b.sprite('Santa', 0, 2.4, b.canvas(SANTA_L).map(SANTA, SL, 84, 9, (ch, x, y) => y >= 23 ? { hide: true } : null).list());

  const sack = b.canvas(2.6);
  for (let y = 34; y <= 45; y++) for (let x = 96; x <= 106; x++) {
    const e = ((x - 101) / 5) ** 2 + ((y - 40.5) / 5) ** 2;
    if (y >= 37 && e <= 1) sack.put(x, y, x > 104 || y === 45 ? '#6b4220' : x < 99 && y < 41 ? '#a8743c' : '#8b5a2b');
  }
  for (let x = 99; x <= 103; x++) sack.put(x, 36, '#ffd447');
  [[99, 34, '#d8343a'], [100, 34, '#d8343a'], [100, 35, '#d8343a'], [102, 33, '#3d7fe0'], [103, 33, '#3d7fe0'], [102, 34, '#ffd447'], [103, 34, '#3d7fe0'], [101, 35, '#2f8f4e']].forEach(([x, y, c]) => sack.put(x, y, c));
  b.sprite('Santa', 1.8, 3.6, sack.list());

  // Sleigh and reindeer on the ridge
  const SLEIGH = ['.........PPP.....', '...GGGG..PQP.....', '..GGGGGG.PPP.....', '..GGGGGG.BBBB....', '..GGGGGG.BQBB....', 'R.GGGGGRRBBBB...R', 'RR.GGGGRRRRRR..RR', 'RRRRRRRRRRRRRRRRR', 'rRRRRRRRRRRRRRRr.', '.rrrrrrrrrrrrrr..', '..Y....Y....Y...Y', 'YYYYYYYYYYYYYYYY.'];
  const SLL = { R: '#d62f2f', r: '#9e1f24', G: '#8b5a2b', P: '#9b5de5', Q: '#ffd447', B: '#3d7fe0', Y: '#ffd447' };
  b.sprite('Reindeer', 0, 1.8, b.canvas(3).map(SLEIGH, SLL, 28, 32).list());
  const DEER = ['........A.A', '.........A.', '........BBB', 'T.......BBN', 'dBBBBBBBB..', '.BBBBBBBB..', '.BWWWWWBB..', '.B.B..B.B..', 'B..B..B..B.'];
  const DL = n => ({ A: '#d9c9a0', B: '#8b5a2b', d: '#6b4220', W: '#b98a56', T: '#f4f4f4', N: n });
  const reins = b.canvas(3.1);
  [[45, 37, 50, 39], [59, 38, 63, 39]].forEach(([xa, ya, xb, yb]) => {
    const n = Math.max(Math.abs(xb - xa), Math.abs(yb - ya));
    for (let i = 0; i <= n; i++) reins.put(xa + (xb - xa) * i / n, ya + (yb - ya) * i / n, '#c9a23a');
  });
  b.sprite('Reindeer', 1.6, 2.2, reins.list(), p => p.x + r());
  b.sprite('Reindeer', 2.0, 3.4, b.canvas(6.1).map(DEER, DL('#1b1b22'), 50, 35).list());
  b.sprite('Reindeer', 3.3, 4.8, b.canvas(6.2).map(DEER, DL('#ff4040'), 63, 35).list());

  return b.finish();
}

const SCENE = buildScene();

function shootingStars(T, CUES, env) {
  if (env < 0.01) return null;
  const out = [];
  [[0, 40, 6], [2.6, 70, 10], [5.1, 52, 4]].forEach(([t0, sx, sy], k) => {
    const u = (T - CUES.Celebrate - t0) / 1.1;
    if (u < 0 || u > 1) return;
    const hx = sx + u * 30, hy = sy + u * 9;
    for (let i = 0; i < 7; i++) out.push(<rect key={'s' + k + i} x={Math.round(hx - i * 1.6)} y={Math.round(hy - i * 0.5)} width="1" height="1" fill={i === 0 ? '#ffffff' : '#fff4c4'} opacity={env * (1 - i / 7) * Math.sin(Math.PI * u)} />);
  });
  return out;
}

function RooftopPiece({ arrival, snow }) {
  return (
    <PixelPiece arrival={arrival} snow={snow} SCENE={SCENE} pushCue="Roof" origin="55% 55%"
      layerTf={(n, T, env) => {
        if (HOP[n] !== undefined) return `translate(0 ${(-Math.abs(Math.sin(T * 3 + HOP[n])) * 1.4 * env).toFixed(2)})`;
        if (n === SANTA_L) return `translate(0 ${(-(0.5 + 0.5 * Math.sin(T * 1.7 - 1.5)) * 3 * env).toFixed(2)})`;
        return undefined;
      }}
      glows={(T, CUES, env, meltOut) => [
        { x: MOON.x, y: MOON.y, size: 560, rgb: '243,236,200', a: 0.4, op: animate({ from: 0, to: 0.6, start: CUES.Ground + 1.5, end: CUES.Roof, ease: MOTION.glide })(T) * meltOut },
      ]}
      extras={(T, CUES, env) => shootingStars(T, CUES, env)}
    />
  );
}

window.RooftopApp = makeApp(RooftopPiece);
