import { Ticker } from 'pixi.js';

export enum Direction {
  N = 'N',
  E = 'E',
  W = 'W',
  S = 'S',
}

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
  direction: Direction; // | 'R';
};
