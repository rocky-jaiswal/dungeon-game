import { type EventEmitter } from 'pixi.js';

import { createApp } from './app';

export const main = async (elem: HTMLDivElement, eventEmitter: EventEmitter) => {
  const app = await createApp(elem, eventEmitter);
  elem.appendChild(app.canvas);
};
