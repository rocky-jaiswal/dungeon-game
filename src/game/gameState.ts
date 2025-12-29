import { Application, EventEmitter, Rectangle } from 'pixi.js';
import { Direction, Position, PositionWithDirection } from './types';
import { getRandomInt } from './util';

interface Props {
  width: number;
  height: number;
  application: Application;
  eventEmitter: EventEmitter;
}

export class GameState {
  public readonly application: Application;
  public readonly eventEmitter: EventEmitter;

  public readonly width: number;
  public readonly height: number;

  public readonly gridSize = 50.0;

  public readonly noOfCols: number;
  public readonly noOfRows: number;

  public playerX: number;
  public playerY: number;

  public readonly playerSize: number = 12;
  public readonly spiderSize: number = 16;
  public readonly ghostSizeW: number = 20;
  public readonly ghostSizeL: number = 30;
  public readonly batSize: number = 14;
  public readonly maxSpiders: number = 20;
  public readonly maxGhosts: number = 10;
  public readonly maxBats: number = 15;
  public readonly monsterSize: number = 25; // Define monster size
  public readonly maxMonsters: number = 5;

  public readonly walls: Position[] = [];

  public spiderPositions: PositionWithDirection[] = [];
  public ghostPositions: PositionWithDirection[] = [];
  public batPositions: PositionWithDirection[] = [];
  public monsterPositions: PositionWithDirection[] = []; // Add monsterPositions

  public keys: { [key: string]: boolean } = {};
  public speed: number = 2;

  public gameEnded: boolean = false;
  public worldStopped: boolean = false;

  constructor(props: Props) {
    this.application = props.application;
    this.eventEmitter = props.eventEmitter;

    this.width = props.width;
    this.height = props.height;
    console.log({ w: this.width, h: this.height });

    this.noOfCols = Math.floor(this.width / this.gridSize);
    this.noOfRows = Math.floor(this.height / this.gridSize);

    this.playerX = this.gridSize * 1.5;
    this.playerY = this.gridSize * 1.5;

    this.assignWallPositions();
    this.assignSpiderPositions();
    this.assignGhostPositions();
    this.assignBatPositions();
    this.assignMonsterPositions();

    this.eventEmitter.addListener('gameEnded', () => this.endGame());
  }

  private assignWallPositions() {
    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        // Create walls with some randomness and leave initial area clean
        if (Math.random() < 0.25 && x > 1 && y > 1) {
          const wall = { x: x * this.gridSize, y: y * this.gridSize };
          this.walls.push(wall);
        }
      }
    }
  }

  private assignSpiderPositions() {
    let count = 0;

    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        if (Math.random() < 0.08 && x > 2 && y > 2 && !this.hasWall({ x, y })) {
          if (count < this.maxSpiders) {
            const spider = {
              id: self.crypto.randomUUID(),
              x: x * this.gridSize,
              y: y * this.gridSize,
              direction: [Direction.E, Direction.N, Direction.S, Direction.W][getRandomInt(4)],
            };
            this.spiderPositions.push(spider);
            count += 1;
          }
        }
      }
    }
  }

  private assignGhostPositions() {
    let count = 0;

    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        if (Math.random() < 0.07 && x > 2 && y > 2 && !this.hasWall({ x, y })) {
          if (count < this.maxGhosts) {
            const spider = {
              id: self.crypto.randomUUID(),
              x: x * this.gridSize,
              y: y * this.gridSize,
              direction: [Direction.E, Direction.N, Direction.S, Direction.W][getRandomInt(4)],
            };
            this.ghostPositions.push(spider);
            count += 1;
          }
        }
      }
    }
  }

  private assignBatPositions() {
    let count = 0;

    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        if (Math.random() < 0.06 && x > 2 && y > 2 && !this.hasWall({ x, y })) {
          if (count < this.maxBats) {
            const bat = {
              id: self.crypto.randomUUID(),
              x: x * this.gridSize,
              y: y * this.gridSize,
              direction: [Direction.E, Direction.N, Direction.S, Direction.W][getRandomInt(4)],
            };
            this.batPositions.push(bat);
            count += 1;
          }
        }
      }
    }
  }

  private assignMonsterPositions() {
    let count = 0;

    for (let x = 0; x < this.noOfCols; x++) {
      for (let y = 0; y < this.noOfRows; y++) {
        if (Math.random() < 0.025 && x > 2 && y > 2 && !this.hasWall({ x, y })) {
          if (count < this.maxMonsters) {
            const monster = {
              id: self.crypto.randomUUID(),
              x: x * this.gridSize,
              y: y * this.gridSize,
              direction: [Direction.E, Direction.N, Direction.S, Direction.W][getRandomInt(4)],
            };
            this.monsterPositions.push(monster);
            count += 1;
          }
        }
      }
    }
  }

  public checkWallCollisionMonster(x: number, y: number, size: number): boolean {
    const monsterBounds = new Rectangle(x, y, size, size).getBounds();

    return this.walls.some((wall) => {
      const wallBounds = new Rectangle(wall.x, wall.y, this.gridSize, this.gridSize).getBounds();
      return monsterBounds.intersects(wallBounds);
    });
  }

  public checkWallCollision(x: number, y: number, size: number): boolean {
    const playerBounds = new Rectangle(x - size, y - size, size * 2, size * 2).getBounds();

    return this.walls.some((wall) => {
      const wallBounds = new Rectangle(wall.x, wall.y, this.gridSize, this.gridSize).getBounds();
      return playerBounds.intersects(wallBounds);
    });
  }

  public checkWallCollisionSpider(x: number, y: number): boolean {
    const playerBounds = new Rectangle(x, y, this.spiderSize, this.spiderSize).getBounds();

    return this.walls.some((wall) => {
      const wallBounds = new Rectangle(wall.x, wall.y, this.gridSize, this.gridSize).getBounds();
      return playerBounds.intersects(wallBounds);
    });
  }

  public checkWallCollisionBat(x: number, y: number): boolean {
    const batBounds = new Rectangle(x, y, this.batSize, this.batSize).getBounds();

    return this.walls.some((wall) => {
      const wallBounds = new Rectangle(wall.x, wall.y, this.gridSize, this.gridSize).getBounds();
      return batBounds.intersects(wallBounds);
    });
  }

  public isOutOfBounds(pos: Position): boolean {
    return pos.x < 0 || pos.y < 0 || pos.x > this.width || pos.y > this.height;
  }

  private hasWall(pos: Position) {
    return this.walls.some((wall) => wall.x / this.gridSize === pos.x && wall.y / this.gridSize === pos.y);
  }

  private endGame() {
    this.gameEnded = true;
  }
}
