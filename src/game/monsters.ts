import { Graphics } from 'pixi.js';

import { GameState } from './gameState';
import { PositionWithDirection } from './types';

export class MonsterGraphic extends Graphics {
  public readonly id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

export class Monsters {
  private readonly gameState: GameState;

  private monsterGraphics: MonsterGraphic[] = [];

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public init() {
    this.gameState.monsterPositions.forEach((position: PositionWithDirection) => {
      const monster = new MonsterGraphic(position.id);

      monster.rect(0, 0, this.gameState.monsterSize, this.gameState.monsterSize);
      monster.fill(0xffff00);

      monster.position.x = position.x;
      monster.position.y = position.y;

      this.monsterGraphics.push(monster);
    });

    this.monsterGraphics.forEach((graphic) => {
      this.gameState.application.stage.addChild(graphic);
    });
  }

  public update() {
    const speed = this.gameState.speed / 10; // Slower than other enemies

    this.monsterGraphics.forEach((monsterGraphic) => {
      const monsterPosition = this.gameState.monsterPositions.find((m) => m.id === monsterGraphic.id);
      if (!monsterPosition) return; // Should not happen, but just in case

      // Calculate direction towards the player
      const playerX = this.gameState.playerX;
      const playerY = this.gameState.playerY;

      const dx = playerX - monsterGraphic.x;
      const dy = playerY - monsterGraphic.y;

      const distance = Math.sqrt(dx * dx + dy * dy); // TODO: Change this find diection to take

      if (distance > 0) {
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        let newX = monsterGraphic.x + moveX;
        let newY = monsterGraphic.y + moveY;

        //----------------------------
        // TODO: Monsters should in general move towards the player,
        // if they hit a wall, they should try other directions
        //----------------------------

        // Check for wall collisions
        if (
          this.gameState.checkWallCollisionMonster(newX, newY, this.gameState.monsterSize) ||
          this.gameState.isOutOfBounds({ x: newX, y: newY })
        ) {
          newX = monsterGraphic.x - moveX;
          newY = monsterGraphic.y - moveY;
        } else {
          // No collision, move freely
          monsterGraphic.x = newX;
          monsterGraphic.y = newY;
        }

        // Update monster position in gameState
        monsterPosition.x = monsterGraphic.x;
        monsterPosition.y = monsterGraphic.y;
      }
    });
  }
}
