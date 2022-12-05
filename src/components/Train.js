import React, { useState, useRef } from "react";
import train from "../utils/train";
import makeHouse from "../utils/house";
import makeCave from "../utils/cave";
import { showRoom } from "../utils/utils";

export default function Train() {
  const [logs, setlogs] = useState([]);
  const make = useRef();
  const model = useRef();

  const log = (s) => setlogs((logs) => logs.concat(s));

  const onClear = () => {
    make.current = undefined;
    setlogs([]);
    if (model.current) {
      model.current.stopTraining = true;
      model.current = undefined;
    }
  };

  const onMake = (m) => {
    const [w, h] = [20, 20];
    onClear();
    make.current = m;
    const r = m(w, h);
    showRoom(log, w, h, r);
  };

  const onTrain = () => {
    log("start");
    model.current = train(log, make.current);
  };

  return (
    <div>
      <button onClick={onClear} disabled={!logs.length}>
        Clear
      </button>
      <button onClick={() => onMake(makeCave)} disabled={model.current}>
        Cave
      </button>
      <button onClick={() => onMake(makeHouse)} disabled={model.current}>
        House
      </button>
      <button onClick={onTrain} disabled={!make.current || model.current}>
        Train
      </button>
      {logs.map((s, i) => (
        <pre key={i}>{s}</pre>
      ))}
    </div>
  );
}
