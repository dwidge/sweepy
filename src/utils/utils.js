import React, { useEffect, useRef } from "react";
export function Canvas({ canvas }) {
  const container = useRef(null);

  useEffect(() => {
    container.current.innerHTML = "";
    container.current.append(canvas);
  }, [container, canvas]);

  return <div ref={container} />;
}

const makeTileCanvas = (map, tiles) => {
  const [w, h] = getMapSize(map);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.style.width = "100%";
  canvas.style.imageRendering = "pixelated";
  const ctx = canvas.getContext("2d");
  const id = ctx.createImageData(w, h);
  const d = id.data;

  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (x + y * w) * 4;
      const [r, g, b, a] = tiles[map[y][x]] || [0, 0, 0, 0];
      d[i + 0] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = a;
    }

  ctx.putImageData(id, 0, 0);
  return canvas;
};

const lerp = (a, b, t) => a * t + b * (1 - t);

const blend = ([r, g, b], [r2, g2, b2], t) => [
  lerp(r, r2, t),
  lerp(g, g2, t),
  lerp(b, b2, t),
];

export const drawPathCanvas = (map, steps, canvas, color = [255, 0, 0]) => {
  const [w, h] = getMapSize(map);
  const ctx = canvas.getContext("2d");
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;

  for (let s = 0; s < steps.length; s++) {
    const a = (s + 1) / steps.length;
    const [x, y] = steps[s];
    const i = (x + y * w) * 4;
    const [r, g, b] = blend(d.slice(i, i + 3), color, a);
    d[i + 0] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    //d[i + 3] = a;
  }

  ctx.putImageData(id, 0, 0);
  return canvas;
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

export {
  makeTileCanvas,
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
