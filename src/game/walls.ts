import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { Position } from './types';

export class Walls {
  private readonly gameState: GameState;

  private wallGraphics: Graphics[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    this.gameState.walls.forEach((position: Position) => {
      const wall = new Graphics();
      wall.rect(position.x, position.y, this.gameState.gridSize, this.gameState.gridSize);
      wall.fill(0x95a5a6);
      this.wallGraphics.push(wall);
    });

    this.wallGraphics.forEach((wallG) => {
      this.gameState.application.stage.addChild(wallG);
    });
  }
}
