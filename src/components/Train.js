import React, { useState, useRef, useMemo } from "react";
import train, { makeTrial } from "../utils/train";
import makeHouse from "../utils/house";
import makeCave from "../utils/cave";
import {
  Canvas,
  makeTileCanvas,
  drawPathCanvas,
  fillArray,
} from "../utils/utils";
import Slide from "../components/Slide";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

function ConfigForm({ data: [data, setdata] }) {
  return (
    <Stack>
      {Object.entries(data).map(([key, { value, min, max, steps }]) => (
        <Range
          label={key}
          value={[
            value,
            (v) => setdata({ ...data, [key]: { value: v, min, max, steps } }),
          ]}
          min={min}
          max={max}
          steps={steps}
        />
      ))}
    </Stack>
  );
}

function Range({ label, value: [get, set], min = 0, max = 100 }) {
  return (
    <Stack>
      <Form.Label>
        {label} {get}
      </Form.Label>
      <Form.Range
        value={get}
        onChange={(e) => set(+e.target.value)}
        min={min}
        max={max}
      />
    </Stack>
  );
}

export default function Train() {
  const [logs, setlogs] = useState([]);
  const [maps, setmaps] = useState([]);
  const model = useRef();

  const [config, setconfig] = useState({
    learningRate: { value: 0.2, min: 0, max: 1, steps: 0.01 },
    hiddens: { value: 20, min: 1, max: 200, steps: 1 },
    trials: { value: 10, min: 1, max: 50, steps: 1 },
    steps: { value: 50, min: 1, max: 200, steps: 1 },
    size: { value: 20, min: 1, max: 100, steps: 1 },
  });

  const nTrials = config.trials.value;
  const nSteps = config.steps.value;
  const size = config.size.value;

  const log = (s) => setlogs((logs) => logs.concat(s));

  const onClear = () => {
    setlogs([]);
    setmaps([]);
    if (model.current) {
      model.current.stopTraining = true;
      model.current = undefined;
    }
  };

  const onMake = (m) => {
    const [w, h] = [size, size];
    const map = m(w, h);
    setmaps([...maps, map]);
  };

  const trials = useMemo(
    () => maps.map((map) => fillArray(nTrials, () => makeTrial(map, nSteps))),
    [maps, nTrials, nSteps]
  );

  const colors = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
    [255, 0, 255],
  ];

  const drawMap = (map) =>
    makeTileCanvas(map, [
      [200, 200, 200, 255],
      [0, 0, 0, 255],
    ]);

  const drawTrial = (map) => (canvas, trial, j) =>
    drawPathCanvas(
      map,
      trial.map(({ p }) => p),
      canvas,
      colors[j % colors.length]
    );

  const mapsets = maps.map((map, i) => ({ map, trials: trials[i] }));

  const imgs = useMemo(
    () =>
      mapsets.map(({ map, trials }) =>
        trials.reduce(drawTrial(map), drawMap(map))
      ),
    [maps, trials]
  );

  const onTrain = () => {
    log("start");
    model.current = train(log, mapsets, {
      hiddens: config.hiddens.value,
      learningRate: config.learningRate.value,
    });
  };

  return (
    <Stack>
      <ConfigForm data={[config, setconfig]} />

      <Button onClick={onClear} disabled={!logs.length && !imgs.length}>
        Clear
      </Button>
      <Button onClick={() => onMake(makeCave)} disabled={model.current}>
        Cave
      </Button>
      <Button onClick={() => onMake(makeHouse)} disabled={model.current}>
        House
      </Button>
      <Button onClick={onTrain} disabled={!maps.length || model.current}>
        Train
      </Button>
      <Slide slides={imgs.map((img, i) => [<Canvas canvas={img} />, i + 1])} />
      {logs.map((s, i) => (
        <pre key={i}>{s}</pre>
      ))}
    </Stack>
  );
}
