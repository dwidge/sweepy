// See if ANN can identify room by random moves and bumping into walls
// 0 is space, 1 is wall
// An episode is a sequence of random allowed moves in a room from random start pos

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

function makeEpisode(room, steps = 10) {
  const moves = [];
  const [w, h] = getMapSize(room);
  var [px, py] = findTile(room, 0) || mapmid([w, h]);
  var dir = randi(4);
  for (var s = 0; s < steps; s++) {
    const dirs = [0, 0, 0, 0];

    for (var d = 0; d < 4; d++) {
      const [dx, dy] = deltaOfDiri(dir);
      const [nx, ny] = [px + dx, py + dy];
      const isObstacle = mapxy(room, [w, h], [nx, ny]);
      if (!isObstacle) {
        dirs[dir] = 1;
        [px, py] = [nx, ny];
        break;
      }
      dir = (dir + 1) % 4;
    }

    moves.push(dirs);
  }
  return moves;
}

function makeEpisodes(houses, { nExamplesPerHouse = 20, nMoves = 30 }) {
  const nAnswers = houses.length;

  const make = (house, i) => ({
    sequence: makeEpisode(house, nMoves),
    label: oneShot(nAnswers, i),
  });
  const episodes = shuffle(
    houses
      .map((house, i) => fillArray(nExamplesPerHouse, () => make(house, i)))
      .flat()
  );

  return episodes;
}

function makeBuffers(episodes, { nMoves, nAnswers }) {
  const nExamples = episodes.length;
  const nInputs = 4;

  const sequencesBuffer = tf.buffer([nExamples, nMoves, nInputs]);
  const labelsBuffer = tf.buffer([nExamples, nAnswers]);
  var original = [];
  for (let i = 0; i < nExamples; ++i) {
    const { sequence, label } = episodes[i];
    for (let j = 0; j < nMoves; ++j) {
      sequence[j].forEach((v, k) => sequencesBuffer.set(v, i, j, k));
    }
    label.forEach((v, k) => labelsBuffer.set(v, i, k));
  }

  return [sequencesBuffer.toTensor(), labelsBuffer.toTensor()];
}

function generateDataset(
  show,
  { nHouses = 5, nExamplesPerHouse = 20, w = 20, h = 20, nMoves = 50 },
  makeHouse
) {
  const houses = fillArray(nHouses, (i) => makeHouse(w, h));

  houses.map((r) => showRoom(show, w, h, r));

  const episodes = makeEpisodes(houses, { nExamplesPerHouse, nMoves });
  return makeBuffers(episodes, { nMoves, nAnswers: nHouses });
}

const fit = (show, model, inputs, outputs) =>
  model.fit(inputs, outputs, {
    epochs: 30,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        if (!model.stopTraining) show(logs.loss);
      },
    },
  });

export default function train(show, makeHouse) {
  const nMoves = 50,
    dirs = 4,
    hiddens = 10,
    nHouses = 5;
  var model = tf.sequential();

  show("1");

  model.add(
    tf.layers.gru({
      inputShape: [nMoves, dirs],
      units: hiddens,
      activation: "relu",
      returnSequences: false,
    })
  );

  model.add(tf.layers.dense({ units: 10, activation: "linear" }));
  model.add(tf.layers.dropout(0.5));

  model.add(tf.layers.dense({ units: nHouses, activation: "softmax" }));

  show("2");

  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: tf.train.rmsprop(0.1),
  });

  show("3");

  const [inputs, outputs] = generateDataset(
    show,
    { nMoves, nHouses },
    makeHouse
  );

  show("4");

  fit(show, model, inputs, outputs).then(() => {
    inputs.dispose();
    outputs.dispose();
  });

  show("5");
  return model;
}
