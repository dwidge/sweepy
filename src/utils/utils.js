export {
  getMapSize,
  findTile,
  showRoom,
  randi,
  deltaOfDiri,
  mapxy,
  mapmid,
  fillArray,
  oneShot,
  shuffle,
};

const getMapSize = (a) => [a[0]?.length, a.length];

const findTile = (house, tile = 0) => {
  const [w, h] = getMapSize(house);
  for (var i = 0; i < 32; i++) {
    const [px, py] = [randi(w), randi(h)];
    if (house[py][px] === tile) return [px, py];
  }
};

function showRoom(show, w, h, r) {
  show(r[0].map((_) => ".").join(""));
  for (var y = 0; y < h; y++) show(r[y].map((v) => (v ? "X" : "-")).join(""));
  show(r[0].map((_) => ".").join(""));
}

const randi = (x) => (Math.random() * x) | 0;

const deltaOfDiri = (i) =>
  [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ][i];

const mapxy = (map, [w, h], [x, y]) => map[(y + h) % h][(x + w) % w];

const mapmid = ([w, h]) => [(w / 2) | 0, (h / 2) | 0];

const fillArray = (n, f) =>
  Array(n)
    .fill()
    .map((_, i) => f(i));
const oneShot = (n, i) =>
  Array(n)
    .fill()
    .map((v, ii) => (ii === i ? 1 : 0));
const shuffle = (a) => a.sort(() => Math.random() - 0.5);
