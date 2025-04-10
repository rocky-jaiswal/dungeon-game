import React, { useEffect, useRef, useState } from 'react';
import { EventEmitter } from 'pixi.js';

import { main } from './game/main';
import './css/style.css';

const eventEmitter = new EventEmitter();

function App() {
  const elemRef = useRef(null);
  const calledOnce = useRef(false);
  const [semaphore, setSemaphore] = useState<boolean>(false);

  useEffect(() => {
    if (elemRef.current && !semaphore && !calledOnce.current) {
      main(elemRef.current, eventEmitter)
        .then(() => {
          console.log('started game ...');
        })
        .catch((err) => console.error(err));

      calledOnce.current = true;
      setSemaphore(true);
    }
  }, [semaphore]);

  return (
    <main>
      <div id="header">
        <h1>Dungeon Runner</h1>
      </div>
      <div id="app" ref={elemRef}></div>
      <div id="scorecard">
        <div className="actions-game">
          <button className="help-button" id="help-button">
            <span>Help 🤔</span>
          </button>
          <button id="reset-game-btn" onClick={() => document.location.reload()}>
            <span>Restart 🔁</span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
