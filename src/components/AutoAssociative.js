import React, { useState, useRef, useMemo } from "react";
import trainAuto from "../utils/auto";
import Button from "react-bootstrap/Button";
import ConfigForm from "./ConfigForm";
import Stack from "react-bootstrap/Stack";

export default function AutoAssociative() {
  const [logs, setlogs] = useState([]);
  const [maps, setmaps] = useState([]);
  const model = useRef();

  const config = {
    learningRate: { value: 0.2, min: 0, max: 1, step: 0.01 },
    nodes: { value: 20, min: 1, max: 200, step: 1 },
    patterns: { value: 10, min: 1, max: 500, step: 1 },
  };
  const [data, setdata] = useState({});

  const log = (s) => setlogs((logs) => logs.concat(s));

  const onClear = () => {
    setlogs([]);
    if (model.current) {
      model.current.stopTraining = true;
      model.current = undefined;
    }
  };

  const onTrain = () => {
    log("start");
    model.current = trainAuto(log, data);
  };

  return (
    <Stack>
      <ConfigForm config={config} data={[data, setdata]} />

      <Button onClick={onClear} disabled={!logs.length}>
        Clear
      </Button>
      <Button onClick={onTrain} disabled={model.current}>
        Train
      </Button>
      {logs.map((s, i) => (
        <pre key={i}>{s}</pre>
      ))}
    </Stack>
  );
}
