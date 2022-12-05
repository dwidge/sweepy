import React, { useState, useRef } from "react";
import train from "../utils/train";
import makeHouse from "../utils/house";
import makeCave from "../utils/cave";
import { Canvas, makeTileCanvas } from "../utils/utils";
import Slide from "../components/Slide";
import Button from "react-bootstrap/Button";

export default function Train() {
  const [logs, setlogs] = useState([]);
  const [maps, setmaps] = useState([]);
  const [imgs, setimgs] = useState([]);
  const model = useRef();

  const log = (s) => setlogs((logs) => logs.concat(s));

  const onClear = () => {
    setlogs([]);
    setimgs([]);
    setmaps([]);
    if (model.current) {
      model.current.stopTraining = true;
      model.current = undefined;
    }
  };

  const onMake = (m) => {
    const [w, h] = [20, 20];
    const r = m(w, h);
    setmaps([...maps, r]);
    setimgs(
      imgs.concat(
        makeTileCanvas(r, [
          [200, 200, 200, 255],
          [0, 0, 0, 255],
        ])
      )
    );
  };

  const onTrain = () => {
    log("start");
    model.current = train(log, maps);
  };

  return (
    <div>
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
    </div>
  );
}
