import React, { useState } from "react";

export const useLog = () => {
  const [logs, setlogs] = useState([]);
};

export default function () {
  const [logs, setlogs] = useState([]);
  const log = (s) => setlogs((logs) => logs.concat(s));

  return (
    <div>
      {logs.map((s) => (
        <p>{s}</p>
      ))}
    </div>
  );
}
