import { Ticker } from 'pixi.js';

export interface GameScene {
  init: () => void;
  update: (d: Ticker) => void;
}

export type Position = {
  x: number;
  y: number;
};

export type PositionWithDirection = {
  id: string;
  x: number;
  y: number;
  direction: 'N' | 'E' | 'W' | 'S'; // | 'R';
};
