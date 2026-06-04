import Phaser from 'phaser';

export class Agata {
  public readonly container: Phaser.GameObjects.Container;
  private readonly scene: Phaser.Scene;
  private sprite: Phaser.GameObjects.Image;
  private glow: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    // Glow effect
    this.glow = scene.add.circle(0, 0, 45, 0xffffff, 0.2);
    this.container.add(this.glow);

    // Agata Sprite
    this.sprite = scene.add.image(0, 0, 'agata');
    this.sprite.setDisplaySize(80, 80);
    this.container.add(this.sprite);

    // Simple floating animation
    this.scene.tweens.add({
      targets: this.container,
      y: y - 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.scene.tweens.add({
      targets: this.glow,
      scale: 1.2,
      alpha: 0.1,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.container.setAlpha(0);
  }

  public show(x?: number, y?: number): void {
    if (x !== undefined) this.container.x = x;
    if (y !== undefined) this.container.y = y;

    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });
  }

  public hide(): void {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 500,
      ease: 'Power2'
    });
  }

  public setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }

  public destroy(): void {
    this.container.destroy();
  }
}
