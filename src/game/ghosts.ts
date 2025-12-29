import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { Direction, PositionWithDirection } from './types';

export class GhostGraphic extends Graphics {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export class Ghosts {
  private readonly gameState: GameState;

  private ghostGraphics: GhostGraphic[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    this.gameState.ghostPositions.forEach((position: PositionWithDirection) => {
      const spider = new GhostGraphic(position.id);
      spider.rect(0, 0, this.gameState.ghostSizeW, this.gameState.ghostSizeL);
      spider.fill('#2effff');
      spider.position.x = position.x;
      spider.position.y = position.y;
      this.ghostGraphics.push(spider);
    });

    this.ghostGraphics.forEach((graphic) => {
      this.gameState.application.stage.addChild(graphic);
    });
  }

  public update() {
    const speed = this.gameState.speed / 3;

    this.ghostGraphics.forEach((ghostGraphic) => {
      const ghostPositions = this.gameState.ghostPositions.find((s) => s.id === ghostGraphic.id);

      if (ghostPositions!.direction === 'N') {
        const newPos = { x: ghostGraphic.x, y: ghostGraphic.y - speed };

        if (this.gameState.isOutOfBounds(newPos)) {
          ghostPositions!.direction = Direction.S;

          ghostGraphic.x = newPos.x;
          ghostGraphic.y = ghostGraphic.y + speed;
        } else {
          ghostGraphic.x = newPos.x;
          ghostGraphic.y = newPos.y;
        }

        ghostPositions!.x = ghostGraphic.x;
        ghostPositions!.y = ghostGraphic.y;

        return;
      }

      if (ghostPositions!.direction === 'S') {
        const newPos = { x: ghostGraphic.x, y: ghostGraphic.y + speed };

        if (this.gameState.isOutOfBounds(newPos)) {
          ghostPositions!.direction = Direction.N;

          ghostGraphic.x = newPos.x;
          ghostGraphic.y = ghostGraphic.y - speed;
        } else {
          ghostGraphic.x = newPos.x;
          ghostGraphic.y = newPos.y;
        }

        ghostPositions!.x = ghostGraphic.x;
        ghostPositions!.y = ghostGraphic.y;

        return;
      }

      if (ghostPositions!.direction === 'E') {
        const newPos = { x: ghostGraphic.x + speed, y: ghostGraphic.y };

        if (this.gameState.isOutOfBounds(newPos)) {
          ghostPositions!.direction = Direction.W;

          ghostGraphic.x = newPos.x - speed;
          ghostGraphic.y = newPos.y;
        } else {
          ghostGraphic.x = newPos.x;
          ghostGraphic.y = newPos.y;
        }

        ghostPositions!.x = ghostGraphic.x;
        ghostPositions!.y = ghostGraphic.y;

        return;
      }

      if (ghostPositions!.direction === 'W') {
        const newPos = { x: ghostGraphic.x - speed, y: ghostGraphic.y };

        if (this.gameState.isOutOfBounds(newPos)) {
          ghostPositions!.direction = Direction.E;

          ghostGraphic.x = newPos.x + speed;
          ghostGraphic.y = newPos.y;
        } else {
          ghostGraphic.x = newPos.x;
          ghostGraphic.y = newPos.y;
        }

        ghostPositions!.x = ghostGraphic.x;
        ghostPositions!.y = ghostGraphic.y;

        return;
      }
    });
  }
}
