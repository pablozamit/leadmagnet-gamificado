import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Agata } from '../entities/Agata';
import { EventBus } from '../EventBus';
import type { Brand } from '../../data/brandData';

export class RoomScene extends Phaser.Scene {
  private player!: Player;
  private agata!: Agata;
  private brand!: Brand;
  private pillarId!: string;

  constructor() {
    super({ key: 'RoomScene' });
  }

  init(data: { brand: Brand, pillarId: string }): void {
    this.brand = data.brand;
    this.pillarId = data.pillarId;
  }

  create(): void {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createAgata(width, height);
    this.createPlayer(width, height);

    this.cameras.main.setBackgroundColor('#050510');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    EventBus.emit('current-scene-ready', this);

    // Start dialogue automatically
    this.time.delayedCall(800, () => {
      this.agata.show();
      EventBus.emit('start-brand-dialogue', this.brand.id);
    });

    // Listen for dialogue end to offer exit
    EventBus.on('dialogue-finished', this.handleDialogueEnd, this);
    EventBus.on('dialogue-exit-request', this.exitRoom, this);

    this.events.once('shutdown', () => {
      EventBus.off('dialogue-finished', this.handleDialogueEnd, this);
      EventBus.off('dialogue-exit-request', this.exitRoom, this);
    });
  }

  private createBackground(width: number, height: number): void {
    // Room title
    const title = this.add.text(width / 2, 50, `SALA DE ${this.brand.name.toUpperCase()}`, {
      fontSize: '28px',
      fontFamily: 'system-ui, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5);

    // Decorative "screens" or elements
    for(let i=0; i<3; i++) {
        const x = (width / 4) * (i + 1);
        const y = height * 0.4;
        const rect = this.add.rectangle(x, y, 120, 160, 0x1a1a3a, 0.5);
        rect.setStrokeStyle(2, 0x3a3a6a, 1);

        this.tweens.add({
            targets: rect,
            alpha: 0.8,
            duration: 2000 + (i * 500),
            yoyo: true,
            repeat: -1
        });
    }
  }

  private createAgata(width: number, height: number): void {
    this.agata = new Agata(this, width * 0.5, height * 0.35);
  }

  private createPlayer(width: number, height: number): void {
    this.player = new Player(this, width / 2, height * 0.8);
  }

  private handleDialogueEnd(): void {
    // Logic after a simple dialogue box closes
  }

  private exitRoom(): void {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('PillarScene', { pillarId: this.pillarId });
    });
  }

  update(_time: number, delta: number): void {
    const bounds = new Phaser.Geom.Rectangle(40, 100, this.scale.width - 80, this.scale.height - 150);
    this.player.update(delta, bounds);
  }
}
