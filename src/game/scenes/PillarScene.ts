import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { AgataGuide } from '../entities/AgataGuide';
import { EventBus } from '../EventBus';
import { pillars, type PillarData, type Brand } from '../../data/brandData';
import { getSafeZones, getPillarStationPositions } from '../utils/layout';

export class PillarScene extends Phaser.Scene {
  private player!: Player;
  private agata: AgataGuide | null = null;
  private pillarData!: PillarData;
  private stations: Phaser.GameObjects.Container[] = [];
  private hintText: Phaser.GameObjects.Text | null = null;
  private playBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
  private decor: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'PillarScene' });
  }

  init(data: { pillarId: string }): void {
    const found = pillars.find((p) => p.id === data.pillarId);
    if (!found) {
      this.scene.start('HubScene');
      return;
    }
    this.pillarData = found;
  }

  create(): void {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;

    this.createDecor(zones);
    this.createStations();
    this.createPlayer(zones.isCoarsePointer);
    this.createHint(zones.isCoarsePointer);
    this.createBackButton(zones);

    this.agata = new AgataGuide(this);
    this.time.delayedCall(500, () => {
      this.agata?.showCharacter();
      EventBus.emit('start-pillar-intro', this.pillarData.name);
    });

    this.cameras.main.setBackgroundColor('#0a1428');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.player.onInteract(() => this.handleInteract());
    this.scale.on('resize', this.onResize, this);

    EventBus.emit('current-scene-ready', this);
    EventBus.emit('pillar-progress-updated', {
      pillar: this.pillarData.id,
      completed: 0,
      total: this.pillarData.brands.length,
    });
  }

  private createDecor(zones: ReturnType<typeof getSafeZones>): void {
    if (!zones.isMobile) {
      const title = this.add.text(
        this.scale.width / 2,
        zones.hudTop + 8,
        this.pillarData.name.toUpperCase(),
        {
          fontSize: '14px',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          color: Phaser.Display.Color.IntegerToColor(this.pillarData.glowColor).rgba,
          fontStyle: 'bold',
        },
      );
      title.setOrigin(0.5, 0);
      title.setAlpha(0.65);
      this.decor.push(title);
    }
  }

  private createStations(): void {
    const positions = getPillarStationPositions(
      this.playBounds,
      this.pillarData.brands.length,
    );

    this.pillarData.brands.forEach((brand, i) => {
      const { x, y } = positions[i];
      const station = this.add.container(x, y);

      const glow = this.add.circle(0, 0, 42, this.pillarData.color, 0.2);
      const body = this.add.rectangle(0, 0, 64, 64, 0x1a4ba0, 0.85);
      body.setStrokeStyle(3, this.pillarData.glowColor, 1);
      const name = this.add
        .text(0, 48, brand.name, {
          fontSize: '13px',
          fontStyle: 'bold',
          color: '#ffffff',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          stroke: '#000000',
          strokeThickness: 3,
        })
        .setOrigin(0.5, 0);

      station.add([glow, body, name]);
      station.setData('brand', brand);
      station.setSize(80, 100);
      this.stations.push(station);

      this.tweens.add({
        targets: glow,
        scale: 1.15,
        alpha: 0.08,
        duration: 1500 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private createPlayer(isCoarsePointer: boolean): void {
    const x = this.playBounds.x + this.playBounds.width * 0.5;
    const y = Math.min(this.scale.height * 0.82, this.playBounds.bottom - 28);
    this.player = new Player(this, x, y);
    void isCoarsePointer;
  }

  private interactLabel = 'Explorar (E)';

  private createHint(isCoarsePointer: boolean): void {
    this.interactLabel = isCoarsePointer ? 'Toca la marca' : 'Explorar (E)';
    this.hintText = this.add
      .text(0, 0, '', {
        fontSize: '14px',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        color: '#ffffff',
        fontStyle: 'bold',
        backgroundColor: '#00000099',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5, 1)
      .setDepth(60)
      .setVisible(false);
  }

  private createBackButton(zones: ReturnType<typeof getSafeZones>): void {
    const y = zones.hudTop + (zones.isMobile ? 4 : 12);
    const backBtn = this.add
      .text(this.playBounds.right - 8, y, '← Museo', {
        fontSize: zones.isMobile ? '13px' : '15px',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(1, 0)
      .setDepth(70)
      .setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.returnToHub());
  }

  private onResize = (): void => {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;
    const positions = getPillarStationPositions(
      this.playBounds,
      this.pillarData.brands.length,
    );
    this.stations.forEach((station, i) => {
      station.setPosition(positions[i].x, positions[i].y);
    });
  };

  private handleInteract(): void {
    if (this.agata?.isDialogueBlocking()) return;
    const pos = this.player.getPosition();
    for (const station of this.stations) {
      if (Phaser.Math.Distance.Between(pos.x, pos.y, station.x, station.y) < 88) {
        this.enterRoom(station.getData('brand') as Brand);
        return;
      }
    }
  }

  private enterRoom(brand: Brand): void {
    EventBus.emit('dialogue-finished');
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('RoomScene', { brand, pillarId: this.pillarData.id });
    });
  }

  private returnToHub(): void {
    EventBus.emit('dialogue-finished');
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('HubScene');
    });
  }

  update(_time: number, delta: number): void {
    this.player.update(delta, this.playBounds);

    if (this.agata?.isDialogueBlocking() || !this.hintText) {
      this.hintText?.setVisible(false);
      return;
    }
    let near: Phaser.GameObjects.Container | null = null;
    const pos = this.player.getPosition();
    for (const station of this.stations) {
      if (Phaser.Math.Distance.Between(pos.x, pos.y, station.x, station.y) < 88) {
        near = station;
        break;
      }
    }
    if (near) {
      const brand = near.getData('brand') as Brand;
      this.hintText.setText(`${this.interactLabel}: ${brand.name}`);
      this.hintText.setPosition(near.x, near.y - 72);
      this.hintText.setVisible(true);
    } else {
      this.hintText.setVisible(false);
    }
  }

  shutdown(): void {
    this.scale.off('resize', this.onResize, this);
    this.agata?.destroy();
    this.agata = null;
  }
}