import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Storage } from "@dwidge/lib-react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "./components/Navbar";

import About from "./components/About";
import SelfLocalize from "./components/SelfLocalize";
import AutoAssociative from "./components/AutoAssociative";
import View3D from "./components/View3D";

const { useStorage } = Storage(useState, useEffect);

const App = () => {
  const settings = useStorage("sweepy", {});

  return (
    <Navbar
      brand="Sweepy"
      pages={{
        "/": { exact: true, name: "About", element: <About /> },
        "/self": { name: "Self Localize", element: <SelfLocalize /> },
        "/auto": { name: "Auto Associative", element: <AutoAssociative /> },
        "/view": { name: "View 3D", element: <View3D /> },
      }}
    />
  );
};

export default App;
