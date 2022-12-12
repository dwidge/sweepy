import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

export default function ConfigForm({ config, data: [data, setdata] }) {
  return (
    <Form>
      {Object.entries(config).map(([key, { value, min, max, step }]) => (
        <Range
          label={key}
          value={[
            data[key] == null ? value : data[key],
            (v) => setdata({ ...data, [key]: v }),
          ]}
          min={min}
          max={max}
          step={step}
        />
      ))}
    </Form>
  );
}

export function Range({
  label,
  value: [get, set],
  min = 0,
  max = 100,
  step = 1,
}) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {get}
      </Form.Label>
      <Form.Range
        value={get}
        onChange={(e) => set(+e.target.value)}
        min={min}
        max={max}
        step={step}
      />
    </Form.Group>
  );
}
