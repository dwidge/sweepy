import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { Storage } from "@dwidge/lib-react";

import View from "./components/View";
import Train from "./components/Train";

const { useStorage } = Storage(useState, useEffect);

const App = () => {
  const settings = useStorage("sweepy", {});

  return (
    <>
      <nav>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/"
        >
          Train
        </NavLink>
        <NavLink
          className={({ isActive }) => (isActive ? "link-active" : "link")}
          to="/view"
        >
          View
        </NavLink>
      </nav>
      <div>
        <Routes>
          <Route exact path="/" element={<Train settings={settings} />} />
          <Route path="/view" element={<View settings={settings} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
