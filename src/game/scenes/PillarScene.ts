import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Agata } from '../entities/Agata';
import { EventBus } from '../EventBus';
import { pillars, type PillarData, type Brand } from '../../data/brandData';

export class PillarScene extends Phaser.Scene {
  private player!: Player;
  private agata!: Agata;
  private pillarData!: PillarData;
  private stations: Phaser.GameObjects.Container[] = [];
  private hintText: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: 'PillarScene' });
  }

  init(data: { pillarId: string }): void {
    const found = pillars.find(p => p.id === data.pillarId);
    if (!found) {
      this.scene.start('HubScene');
      return;
    }
    this.pillarData = found;
  }

  create(): void {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createStations(width, height);
    this.createAgata(width, height);
    this.createPlayer(width, height);
    this.createHint();

    this.cameras.main.setBackgroundColor('#0a1428');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.player.onInteract(() => this.handleInteract());

    // Back button (procedural)
    const backBtn = this.add.text(20, 20, '← Volver al Museo', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00000066',
      padding: { x: 10, y: 5 }
    }).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('HubScene');
      });
    });

    EventBus.emit('current-scene-ready', this);

    // Agata welcomes the player to the pillar
    this.time.delayedCall(500, () => {
      this.agata.show();
      EventBus.emit('start-pillar-intro', this.pillarData.name);
    });

    this.events.once('shutdown', () => {
        // Cleanup if needed
    });
  }

  private createBackground(width: number, height: number): void {
    const title = this.add.text(width / 2, 50, `PILAR: ${this.pillarData.name}`, {
      fontSize: '24px',
      fontFamily: 'system-ui, sans-serif',
      color: Phaser.Display.Color.IntegerToColor(this.pillarData.glowColor).rgba,
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    });
    title.setOrigin(0.5, 0.5);
  }

  private createStations(width: number, height: number): void {
    const spacing = width / (this.pillarData.brands.length + 1);

    this.pillarData.brands.forEach((brand, i) => {
      const x = spacing * (i + 1);
      const y = height * 0.5;

      const station = this.add.container(x, y);

      const glow = this.add.circle(0, 0, 45, this.pillarData.color, 0.2);
      station.add(glow);

      const body = this.add.rectangle(0, 0, 70, 70, 0x1a4ba0, 0.8);
      body.setStrokeStyle(3, this.pillarData.glowColor, 1);
      station.add(body);

      const name = this.add.text(0, 55, brand.name, {
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5, 0);
      station.add(name);

      station.setData('brand', brand);
      this.stations.push(station);

      this.tweens.add({
        targets: glow,
        scale: 1.2,
        alpha: 0.1,
        duration: 1500 + (i * 200),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });
  }

  private createAgata(width: number, height: number): void {
    this.agata = new Agata(this, width * 0.15, height * 0.3);
  }

  private createPlayer(width: number, height: number): void {
    this.player = new Player(this, width / 2, height * 0.85);
  }

  private createHint(): void {
    this.hintText = this.add.text(0, 0, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 12, y: 6 },
    }).setOrigin(0.5, 1).setVisible(false);
  }

  private handleInteract(): void {
    const pos = this.player.getPosition();
    for (const station of this.stations) {
      const distance = Phaser.Math.Distance.Between(pos.x, pos.y, station.x, station.y);
      if (distance < 80) {
        const brand = station.getData('brand') as Brand;
        this.enterRoom(brand);
        return;
      }
    }
  }

  private enterRoom(brand: Brand): void {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('RoomScene', { brand, pillarId: this.pillarData.id });
    });
  }

  update(_time: number, delta: number): void {
    const bounds = new Phaser.Geom.Rectangle(40, 100, this.scale.width - 80, this.scale.height - 150);
    this.player.update(delta, bounds);

    let nearAny = false;
    const pos = this.player.getPosition();
    for (const station of this.stations) {
      const dist = Phaser.Math.Distance.Between(pos.x, pos.y, station.x, station.y);
      if (dist < 80) {
        this.hintText?.setText(`Explorar ${station.getData('brand').name} (E)`);
        this.hintText?.setPosition(station.x, station.y - 60);
        this.hintText?.setVisible(true);
        nearAny = true;
        break;
      }
    }
    if (!nearAny) this.hintText?.setVisible(false);
  }
}
