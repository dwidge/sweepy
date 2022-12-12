import {
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
} from "./utils";
import { fit } from "./train";
const { tf } = window;

export default function (
  show,
  { nodes = 10, patterns = 10, learningRate = 0.05 }
) {
  var model = tf.sequential();

  show("1");

  model.add(
    tf.layers.dense({
      inputShape: [nodes],
      units: nodes,
      activation: "linear",
    })
  );

  show("2");

  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

  show("3");

  const xsRaw = fillArray(patterns, () =>
    fillArray(nodes, () => (Math.random() > 0.5 ? 1 : 0))
  ).flat();

  const xs = tf.tensor2d(xsRaw, [patterns, nodes]);

  show("4");

  fit(show, model, xs, xs).then(() => {
    xs.dispose();
  });

  show("5");
  return model;
}
