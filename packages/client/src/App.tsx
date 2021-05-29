import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { sharedValue } from "@monorepo-template/shared/dist/sharedExample";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <div className="bg-black">
          <span className="bg-blue-900 text-white">
            hello, I am using tailwind - {sharedValue}
          </span>
        </div>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
