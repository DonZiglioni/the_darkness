import React from "react";
import Board from "./Board";
import "./App.css";

/** Simple app that shows the LightsOut game. */

function App() {
  return (
    <div className="App">
      <h1>The Darkness</h1>
      <Board nrows={3} ncols={3} />
    </div>
  );
}

export default App;
