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
const { tf } = window;

export const fit = (show, model, inputs, outputs) =>
  model.fit(inputs, outputs, {
    epochs: 300,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if (!model.stopTraining) show(logs.val_loss + " / " + logs.loss);
      },
    },
  });
