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
//import tf from '@tensorflow/tfjs'
const { tf } = window;

const pDir = ([px, py], dir) => {
  const [dx, dy] = deltaOfDiri(dir);
  return [px + dx, py + dy];
};

function getMoveExplore(map, [w, h], [px, py], dir) {
  var move = [0, 0, 0, 0];
  var p = [px, py];

  for (var d = 0; d < 4; d++) {
    dir = (dir + 400) % 4;
    const np = pDir([px, py], dir);
    const isObstacle = mapxy(map, [w, h], np);
    if (!isObstacle) {
      move[dir] = 1;
      p = np;
      break;
    }
    dir++;
  }
  return { p, dir, move };
}

export function makeTrial(map, steps = 100) {
  const moves = [];
  const [w, h] = getMapSize(map);
  var p = findTile(map, 0) || mapmid([w, h]);
  var startdir = randi(4);
  var dir = startdir;

  for (var s = 0; s < steps; s++) {
    //dir = randi(4);
    const m = getMoveExplore(map, [w, h], p, dir);
    moves.push(m);
    ({ p, dir } = m);
    if (dir != startdir) {
      startdir = -4;
      dir--;
    }
  }

  return moves;
}

function makeEpisodes(houses, { nExamplesPerHouse = 20, nMoves = 30 }) {
  const nAnswers = houses.length;

  const make = (i) => (trial) => ({
    sequence: trial.map(({ move }) => move),
    label: oneShot(nAnswers, i),
  });
  const episodes = shuffle(
    houses.map(({ map, trials }, i) => trials.map(make(i))).flat()
  );

  return episodes;
}

function makeBuffers(episodes, { nMoves, nAnswers }) {
  const nExamples = episodes.length;
  const nInputs = 4;

  const sequencesBuffer = tf.buffer([nExamples, nMoves, nInputs]);
  const labelsBuffer = tf.buffer([nExamples, nAnswers]);

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
  { nHouses = 5, w = 20, h = 20, nMoves = 50 },
  houses
) {
  const nExamplesPerHouse = houses[0].trials.length;
  //const houses = fillArray(nHouses, (i) => makeHouse(w, h));

  //houses.map((r) => showRoom(show, w, h, r));

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

export default function train(show, maps) {
  const nMoves = maps[0].trials[0].length;
  const dirs = 4,
    hiddens = 10,
    nHouses = maps.length;
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
  console.log(maps);
  const [inputs, outputs] = generateDataset(show, { nMoves, nHouses }, maps);

  show("4");

  fit(show, model, inputs, outputs).then(() => {
    inputs.dispose();
    outputs.dispose();
  });

  show("5");
  return model;
}
