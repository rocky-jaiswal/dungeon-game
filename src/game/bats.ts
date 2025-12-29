import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { Direction, PositionWithDirection } from './types';

export class BatGraphic extends Graphics {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export class Bats {
  private readonly gameState: GameState;

  private batGraphics: BatGraphic[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    this.gameState.batPositions.forEach((position: PositionWithDirection) => {
      const bat = new BatGraphic(position.id);
      bat.circle(this.gameState.batSize / 2, this.gameState.batSize / 2, this.gameState.batSize / 2);
      bat.fill(0x9370db); // Purple color for bats
      bat.position.x = position.x;
      bat.position.y = position.y;
      this.batGraphics.push(bat);
    });

    this.batGraphics.forEach((batGraphic) => {
      this.gameState.application.stage.addChild(batGraphic);
    });
  }

  private getRandomDirection(excludeDirection?: Direction): Direction {
    const directions = [Direction.N, Direction.S, Direction.E, Direction.W];

    // If we want to exclude a direction (e.g., the one that just hit a wall)
    const availableDirections = excludeDirection
      ? directions.filter(d => d !== excludeDirection)
      : directions;

    // Random choice from available directions
    return availableDirections[Math.floor(Math.random() * availableDirections.length)];
  }

  public update() {
    const speed = this.gameState.speed * 1.5; // Faster than player (3 vs player's 2)

    this.batGraphics.forEach((batGraphic) => {
      const batPosition = this.gameState.batPositions.find((b) => b.id === batGraphic.id);
      if (!batPosition) return;

      let newPos: { x: number; y: number };

      // Calculate new position based on current direction
      switch (batPosition.direction) {
        case Direction.N:
          newPos = { x: batGraphic.x, y: batGraphic.y - speed };
          break;
        case Direction.S:
          newPos = { x: batGraphic.x, y: batGraphic.y + speed };
          break;
        case Direction.E:
          newPos = { x: batGraphic.x + speed, y: batGraphic.y };
          break;
        case Direction.W:
          newPos = { x: batGraphic.x - speed, y: batGraphic.y };
          break;
        default:
          newPos = { x: batGraphic.x, y: batGraphic.y };
      }

      // Check for wall collision or out of bounds
      if (
        this.gameState.checkWallCollisionBat(newPos.x, newPos.y) ||
        this.gameState.isOutOfBounds(newPos)
      ) {
        // Pick a random direction (with small chance to reverse or choose any random direction)
        if (Math.random() < 0.3) {
          // 30% chance: reverse direction
          switch (batPosition.direction) {
            case Direction.N:
              batPosition.direction = Direction.S;
              break;
            case Direction.S:
              batPosition.direction = Direction.N;
              break;
            case Direction.E:
              batPosition.direction = Direction.W;
              break;
            case Direction.W:
              batPosition.direction = Direction.E;
              break;
          }
        } else {
          // 70% chance: pick a random different direction
          batPosition.direction = this.getRandomDirection(batPosition.direction);
        }

        // Don't move this frame, wait for next update with new direction
        return;
      }

      // No collision, move to new position
      batGraphic.x = newPos.x;
      batGraphic.y = newPos.y;

      // Update bat position in gameState
      batPosition.x = batGraphic.x;
      batPosition.y = batGraphic.y;
    });
  }
}
