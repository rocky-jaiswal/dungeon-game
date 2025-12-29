import { Container, Graphics } from 'pixi.js';
import { GameState } from './gameState';

export class Player {
  private readonly gameState: GameState;
  private container = new Container();

  private playerGraphics: Graphics;

  constructor(gameState: GameState) {
    this.gameState = gameState;

    // Create player
    this.playerGraphics = new Graphics();
    this.playerGraphics.circle(0, 0, this.gameState.playerSize);
    this.playerGraphics.fill(0xe74c3c);
  }

  public init() {
    this.container.addChild(this.playerGraphics);

    this.gameState.application.stage.addChild(this.container);
  }

  public update() {
    const speed = this.gameState.speed;

    let nextX = this.playerGraphics.x;
    let nextY = this.playerGraphics.y;

    if (this.gameState.keys['ArrowLeft'] || this.gameState.keys['a']) nextX -= speed;
    if (this.gameState.keys['ArrowRight'] || this.gameState.keys['d']) nextX += speed;
    if (this.gameState.keys['ArrowUp'] || this.gameState.keys['w']) nextY -= speed;
    if (this.gameState.keys['ArrowDown'] || this.gameState.keys['s']) nextY += speed;

    // Check collision with walls and canvas boundaries
    if (
      nextX >= 0 &&
      nextX <= this.gameState.width &&
      nextY >= 0 &&
      nextY <= this.gameState.height &&
      !this.gameState.checkWallCollision(nextX, nextY, this.gameState.playerSize)
    ) {
      this.playerGraphics.x = nextX;
      this.playerGraphics.y = nextY;

      // Update gameState with current player position so enemies can track it
      this.gameState.playerX = nextX;
      this.gameState.playerY = nextY;
    }
  }
}
