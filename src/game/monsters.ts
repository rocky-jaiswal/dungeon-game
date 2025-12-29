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

  private isValidPosition(x: number, y: number): boolean {
    // Check bounds with monster size in mind
    const size = this.gameState.monsterSize;
    if (x < 0 || y < 0 || x + size > this.gameState.width || y + size > this.gameState.height) {
      return false;
    }

    // Check wall collision
    if (this.gameState.checkWallCollisionMonster(x, y, size)) {
      return false;
    }

    return true;
  }

  private findBestMove(
    monsterX: number,
    monsterY: number,
    playerX: number,
    playerY: number,
    speed: number
  ): { x: number; y: number } {
    // Calculate direct path to player
    const dx = playerX - monsterX;
    const dy = playerY - monsterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return { x: monsterX, y: monsterY };

    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;

    // Try direct path first
    const newX = monsterX + moveX;
    const newY = monsterY + moveY;

    if (this.isValidPosition(newX, newY)) {
      return { x: newX, y: newY };
    }

    // If blocked, try alternative directions
    // Generate candidate moves: cardinal and diagonal directions
    const candidates = [
      { moveX: speed, moveY: 0 }, // Right
      { moveX: -speed, moveY: 0 }, // Left
      { moveX: 0, moveY: speed }, // Down
      { moveX: 0, moveY: -speed }, // Up
      { moveX: speed * 0.7, moveY: speed * 0.7 }, // Down-Right
      { moveX: speed * 0.7, moveY: -speed * 0.7 }, // Up-Right
      { moveX: -speed * 0.7, moveY: speed * 0.7 }, // Down-Left
      { moveX: -speed * 0.7, moveY: -speed * 0.7 }, // Up-Left
    ];

    let bestMove: { x: number; y: number } | null = null;
    let bestDistance = Infinity;

    for (const candidate of candidates) {
      const candidateX = monsterX + candidate.moveX;
      const candidateY = monsterY + candidate.moveY;

      if (this.isValidPosition(candidateX, candidateY)) {
        // Calculate distance to player from this position
        const newDx = playerX - candidateX;
        const newDy = playerY - candidateY;
        const newDistance = Math.sqrt(newDx * newDx + newDy * newDy);

        // Take the move that gets us closest to the player
        if (newDistance < bestDistance) {
          bestDistance = newDistance;
          bestMove = { x: candidateX, y: candidateY };
        }
      }
    }

    // If we found any valid move, use it; otherwise stay put
    return bestMove || { x: monsterX, y: monsterY };
  }

  public update() {
    const speed = this.gameState.speed / 10; // Slower than other enemies

    this.monsterGraphics.forEach((monsterGraphic) => {
      const monsterPosition = this.gameState.monsterPositions.find((m) => m.id === monsterGraphic.id);
      if (!monsterPosition) return; // Should not happen, but just in case

      const playerX = this.gameState.playerX;
      const playerY = this.gameState.playerY;

      // Find the best move towards the player, navigating around obstacles
      const newPosition = this.findBestMove(monsterGraphic.x, monsterGraphic.y, playerX, playerY, speed);

      // Update monster position
      monsterGraphic.x = newPosition.x;
      monsterGraphic.y = newPosition.y;

      // Update monster position in gameState
      monsterPosition.x = monsterGraphic.x;
      monsterPosition.y = monsterGraphic.y;
    });
  }
}
