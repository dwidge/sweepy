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

  const [nTrials, setnTrials] = useState(5);

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
    const [w, h] = [20, 20];
    const map = m(w, h);
    setmaps([...maps, map]);
  };

  const trials = useMemo(
    () => maps.map((map) => fillArray(nTrials, () => makeTrial(map))),
    [maps, nTrials]
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
    model.current = train(log, mapsets);
  };

  return (
    <Stack>
      <Range label="Trials" value={[nTrials, setnTrials]} min={0} max={30} />
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
