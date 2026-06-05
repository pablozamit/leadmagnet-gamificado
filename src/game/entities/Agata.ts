import Phaser from 'phaser';
import { AgataGuide } from './AgataGuide';

export class Agata {
  private readonly guide: AgataGuide;

  constructor(scene: Phaser.Scene, _x: number, _y: number) {
    this.guide = new AgataGuide(scene);
    this.guide.sprite.setAlpha(0);
  }

  public show(x?: number, y?: number): void {
    if (x !== undefined && y !== undefined) this.guide.sprite.setPosition(x, y);
    this.guide.sprite.scene.tweens.add({ targets: this.guide.sprite, alpha: 1, duration: 500, ease: 'Power2' });
    this.guide.playState('talk');
    this.guide.emitAnchorUpdate();
  }

  public hide(): void {
    this.guide.sprite.scene.tweens.add({ targets: this.guide.sprite, alpha: 0, duration: 500, ease: 'Power2' });
    this.guide.playState('idle');
  }

  public setPosition(x: number, y: number): void {
    this.guide.sprite.setPosition(x, y);
    this.guide.emitAnchorUpdate();
  }

  public destroy(): void {
    this.guide.destroy();
  }
}