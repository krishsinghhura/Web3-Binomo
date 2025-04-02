import React from "react";
import Chart from "./pages/chart";
import Mint from "./pages/mint";
import Stake from "./pages/stake";
import Result from "./pages/result"
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/chart" element={<Chart />} />
      <Route path="/mint" element={<Mint />} />
      <Route path="/stake" element={<Stake />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}