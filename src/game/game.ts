import { Ticker } from 'pixi.js';

import { GameState } from './gameState';
import { SceneManager } from './sceneManager';
import { ResultScene } from './resultScene';
import { GameScene } from './types';
import { MainGameScene } from './mainGameScene';

export class Game {
  private gameState: GameState;

  public readonly sceneManager: SceneManager;
  private readonly mainScene: MainGameScene;
  private currentScene: GameScene | null = null;

  constructor(gameState: GameState) {
    this.gameState = gameState;

    this.sceneManager = new SceneManager(gameState);
    this.mainScene = new MainGameScene(this.gameState);
  }

  public async init() {
    this.setupKeyboardControls();
    this.startGame();

    // Set up game loop
    this.gameState.application.ticker.add(this.update.bind(this));
  }

  private startGame() {
    // Set up initial scenes
    this.sceneManager.addScene('game', this.mainScene);
    this.sceneManager.addScene('result', new ResultScene(this.gameState));

    this.currentScene = this.sceneManager.switchTo('game');
    this.currentScene!.init();
  }

  private setupKeyboardControls() {
    window.addEventListener('keydown', (e) => {
      this.gameState.keys[e.key] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.gameState.keys[e.key] = false;
    });
  }

  private update(delta: Ticker) {
    if (this.sceneManager.allScenes.size === 0) {
      return;
    }

    if (this.gameState.gameEnded && !this.gameState.worldStopped) {
      this.currentScene = this.sceneManager.switchTo('result');
      this.currentScene.init();
      this.gameState.worldStopped = true;
    }

    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }

  public destroy() {
    this.gameState.application.destroy(true);
    window.removeEventListener('keydown', () => {});
    window.removeEventListener('keyup', () => {});
  }
}
