import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { Direction, PositionWithDirection } from './types';

export class SpiderGraphic extends Graphics {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export class Spiders {
  private readonly gameState: GameState;

  private spiderGraphics: SpiderGraphic[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    this.gameState.spiderPositions.forEach((position: PositionWithDirection) => {
      const spider = new SpiderGraphic(position.id);
      spider.rect(0, 0, this.gameState.spiderSize, this.gameState.spiderSize);
      spider.fill('#684b4b');
      spider.position.x = position.x;
      spider.position.y = position.y;
      this.spiderGraphics.push(spider);
    });

    this.spiderGraphics.forEach((spiderGraphic) => {
      this.gameState.application.stage.addChild(spiderGraphic);
    });
  }

  public update() {
    const speed = this.gameState.speed / 5;

    this.spiderGraphics.forEach((spiderGraphic) => {
      const spiderPosition = this.gameState.spiderPositions.find((s) => s.id === spiderGraphic.id);

      if (spiderPosition!.direction === 'N') {
        const newPos = { x: spiderGraphic.x, y: spiderGraphic.y - speed };

        if (this.gameState.checkWallCollisionSpider(newPos.x, newPos.y) || this.gameState.isOutOfBounds(newPos)) {
          spiderPosition!.direction = Direction.S;

          spiderGraphic.x = newPos.x;
          spiderGraphic.y = spiderGraphic.y + speed;
        } else {
          spiderGraphic.x = newPos.x;
          spiderGraphic.y = newPos.y;
        }

        spiderPosition!.x = spiderGraphic.x;
        spiderPosition!.y = spiderGraphic.y;

        return;
      }

      if (spiderPosition!.direction === 'S') {
        const newPos = { x: spiderGraphic.x, y: spiderGraphic.y + speed };

        if (this.gameState.checkWallCollisionSpider(newPos.x, newPos.y) || this.gameState.isOutOfBounds(newPos)) {
          spiderPosition!.direction = Direction.N;

          spiderGraphic.x = newPos.x;
          spiderGraphic.y = spiderGraphic.y - speed;
        } else {
          spiderGraphic.x = newPos.x;
          spiderGraphic.y = newPos.y;
        }

        spiderPosition!.x = spiderGraphic.x;
        spiderPosition!.y = spiderGraphic.y;

        return;
      }

      if (spiderPosition!.direction === 'E') {
        const newPos = { x: spiderGraphic.x + speed, y: spiderGraphic.y };

        if (this.gameState.checkWallCollisionSpider(newPos.x, newPos.y) || this.gameState.isOutOfBounds(newPos)) {
          spiderPosition!.direction = Direction.W;

          spiderGraphic.x = newPos.x - speed;
          spiderGraphic.y = newPos.y;
        } else {
          spiderGraphic.x = newPos.x;
          spiderGraphic.y = newPos.y;
        }

        spiderPosition!.x = spiderGraphic.x;
        spiderPosition!.y = spiderGraphic.y;

        return;
      }

      if (spiderPosition!.direction === 'W') {
        const newPos = { x: spiderGraphic.x - speed, y: spiderGraphic.y };

        if (this.gameState.checkWallCollisionSpider(newPos.x, newPos.y) || this.gameState.isOutOfBounds(newPos)) {
          spiderPosition!.direction = Direction.E;

          spiderGraphic.x = newPos.x + speed;
          spiderGraphic.y = newPos.y;
        } else {
          spiderGraphic.x = newPos.x;
          spiderGraphic.y = newPos.y;
        }

        spiderPosition!.x = spiderGraphic.x;
        spiderPosition!.y = spiderGraphic.y;

        return;
      }
    });
  }
}
