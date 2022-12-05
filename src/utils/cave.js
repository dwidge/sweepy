import { randi, deltaOfDiri } from "./utils";

export default function (w, h, steps = 50) {
  console.log(w, h);
  const d = [];
  for (var y = 0; y < h; y++) {
    const row = [];
    for (var x = 0; x < w; x++) {
      row.push(1);
    }
    d.push(row);
  }

  var [px, py] = [(w / 2) | 0, (h / 2) | 0];
  for (var s = 0; s < steps; s++) {
    var dir = randi(4);
    const [dx, dy] = deltaOfDiri(dir);
    d[py][px] = 0;
    py = (py + dy + h) % h;
    px = (px + dx + w) % w;
  }

  return d;
}
