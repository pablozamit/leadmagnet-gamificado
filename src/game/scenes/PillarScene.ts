import Phaser from 'phaser';
import { AgataGuide } from '../entities/AgataGuide';
import { EventBus } from '../EventBus';
import { pillars, type PillarData, type Brand } from '../../data/brandData';
import { getSafeZones, getPillarStationPositions } from '../utils/layout';

const STATION_DEPTH = 150;
const UI_DEPTH = 200;

export class PillarScene extends Phaser.Scene {
  private agata: AgataGuide | null = null;
  private pillarData!: PillarData;
  private stationZones: Phaser.GameObjects.Zone[] = [];
  private playBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
  private decor: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'PillarScene' });
  }

  init(data: { pillarId?: string }): void {
    const pillarId = data?.pillarId;
    const found = pillarId ? pillars.find((p) => p.id === pillarId) : undefined;
    if (!found) {
      this.scene.start('HubScene');
      return;
    }
    this.pillarData = found;
  }

  create(): void {
    if (!this.pillarData) return;

    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;

    this.createDecor(zones);
    this.createStations();
    this.createBackButton(zones);

    this.agata = new AgataGuide(this);
    this.agata.showCharacter();
    this.time.delayedCall(350, () => {
      EventBus.emit('start-pillar-intro', this.pillarData.name);
    });

    this.cameras.main.setBackgroundColor('#0a1428');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.scale.on('resize', this.onResize, this);
    this.events.once('shutdown', this.shutdown, this);

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

    if (!zones.isMobile) {
      const hint = this.add.text(
        this.playBounds.centerX,
        this.playBounds.y - 6,
        'Toca una marca para entrar en su historia',
        {
          fontSize: '12px',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          color: '#666666',
        },
      );
      hint.setOrigin(0.5, 1);
      this.decor.push(hint);
    }
  }

  private createStations(): void {
    const positions = getPillarStationPositions(
      this.playBounds,
      this.pillarData.brands.length,
    );

    this.pillarData.brands.forEach((brand, i) => {
      const { x, y } = positions[i];

      const name = this.add
        .text(x, y, brand.name.toUpperCase(), {
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#ffffff',
          fontFamily: 'Montserrat, system-ui, sans-serif',
          backgroundColor: '#ffffff11',
          padding: { x: 20, y: 12 },
        })
        .setOrigin(0.5)
        .setDepth(STATION_DEPTH + 2)
        .setInteractive({ useHandCursor: true });

      name.on('pointerdown', () => this.onStationClick(brand));

      name.on('pointerover', () => {
        name.setBackgroundColor('#ffffff22');
        name.setScale(1.05);
      });

      name.on('pointerout', () => {
        name.setBackgroundColor('#ffffff11');
        name.setScale(1);
      });

      this.tweens.add({
        targets: name,
        alpha: { from: 0.8, to: 1 },
        duration: 1000 + i * 200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      this.stationZones.push(name as any);
    });
  }

  private onStationClick(brand: Brand): void {
    this.agata?.forceEndDialogue();
    this.enterRoom(brand);
  }

  private createBackButton(zones: ReturnType<typeof getSafeZones>): void {
    const x = this.playBounds.right - 12;
    const y = this.playBounds.y + (zones.isMobile ? 6 : 12);
    const backBtn = this.add
      .text(x, y, '← Museo', {
        fontSize: zones.isMobile ? '13px' : '15px',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        color: '#ffffff',
        backgroundColor: '#00000088',
        padding: { x: 10, y: 6 },
      })
      .setOrigin(1, 0)
      .setDepth(UI_DEPTH)
      .setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', (_p: Phaser.Input.Pointer, _x: number, _y: number, ev?: Event) => {
      ev?.stopPropagation();
      this.onBackClick();
    });
  }

  private onBackClick(): void {
    this.agata?.forceEndDialogue();
    this.returnToHub();
  }

  private onResize = (): void => {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;
    const positions = getPillarStationPositions(
      this.playBounds,
      this.pillarData.brands.length,
    );
    this.stationZones.forEach((zone, i) => {
      const { x, y } = positions[i];
      (zone as unknown as Phaser.GameObjects.Text).setPosition(x, y);
    });
  };

  private enterRoom(brand: Brand): void {
    EventBus.emit('dialogue-finished');

    if (this.cameras.main.fadeEffect.isRunning) return;

    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('RoomScene', { brand, pillarId: this.pillarData.id });
    });
  }

  private returnToHub(): void {
    EventBus.emit('dialogue-finished');

    if (this.cameras.main.fadeEffect.isRunning) return;

    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      // 🌟 CORRECCIÓN: Ahora pasamos el flag al volver para evitar el mensaje de bienvenida inicial repetitivo
      this.scene.start('HubScene', { fromCompletedPillar: true });
    });
  }

  shutdown(): void {
    this.scale.off('resize', this.onResize, this);
    this.stationZones.forEach((z) => z.destroy());
    this.stationZones = [];
    this.agata?.destroy();
    this.agata = null;
  }
}
