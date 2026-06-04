import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Portal, type PillarId } from '../entities/Portal';
import { Agata } from '../entities/Agata';
import { EventBus } from '../EventBus';
import { pillars } from '../../data/brandData';

const PORTAL_POSITIONS: Record<PillarId, { x: number; y: number }> = {
  gamification: { x: 0.25, y: 0.4 },
  acompanamiento: { x: 0.75, y: 0.4 },
  celebracion: { x: 0.25, y: 0.7 },
  fidelizacion: { x: 0.75, y: 0.7 },
};

export class HubScene extends Phaser.Scene {
  private player!: Player;
  private agata!: Agata;
  private portals: Partial<Record<PillarId, Portal>> = {};
  private hintText: Phaser.GameObjects.Text | null = null;
  private introStarted: boolean = false;

  constructor() {
    super({ key: 'HubScene' });
  }

  preload(): void {
    this.load.image('agata', '/avatar.png');
  }

  create(): void {
    const { width, height } = this.scale;

    this.createBackground(width, height);
    this.createPortals(width, height);
    this.createPlayer(width, height);
    this.createAgata(width, height);
    this.createHint();

    this.cameras.main.setBackgroundColor('#0a0a1e');
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.events.on('portal-clicked', this.handlePortalClick, this);
    this.player.onInteract(() => this.handleInteract());

    // Listen for lead-capture-complete to show Agata
    EventBus.on('lead-capture-complete', this.startIntro, this);

    // If we just finished lead capture or already have progress, start intro
    // We use a small delay to ensure React components are ready
    this.time.delayedCall(800, () => this.startIntro());

    this.events.once('shutdown', () => {
        EventBus.off('lead-capture-complete', this.startIntro, this);
    });

    EventBus.emit('current-scene-ready', this);
  }

  private startIntro(): void {
    if (this.introStarted) return;
    this.introStarted = true;

    this.agata.show(this.scale.width / 2, this.scale.height * 0.4);
    EventBus.emit('start-hub-intro');
  }

  private createBackground(width: number, height: number): void {
    const cx = width / 2;

    const title = this.add.text(cx, 50, 'MUSEO DE LA DINAMIZACIÓN DIGITAL', {
      fontSize: '26px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#705893',
      strokeThickness: 6,
    });
    title.setOrigin(0.5, 0.5);

    const subtitle = this.add.text(cx, 85, 'Una experiencia guiada por Ágata', {
      fontSize: '14px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#aaaaaa',
    });
    subtitle.setOrigin(0.5, 0.5);
  }

  private createPortals(width: number, height: number): void {
    pillars.forEach(p => {
      const pos = PORTAL_POSITIONS[p.id as PillarId];
      this.portals[p.id as PillarId] = new Portal(this, width * pos.x, height * pos.y, {
        id: p.id as PillarId,
        label: p.name,
        color: p.color,
        glowColor: p.glowColor,
        locked: false
      });
    });
  }

  private createPlayer(width: number, height: number): void {
    this.player = new Player(this, width / 2, height * 0.9);
  }

  private createAgata(width: number, height: number): void {
    this.agata = new Agata(this, width / 2, height * 0.2);
    // Agata is hidden by default in Hub until intro starts
  }

  private createHint(): void {
    this.hintText = this.add.text(0, 0, '', {
      fontSize: '18px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#00000088',
      padding: { x: 16, y: 8 },
    });
    this.hintText.setOrigin(0.5, 1);
    this.hintText.setVisible(false);

    this.events.on('portal-near', (pillarId: PillarId) => {
      const portal = this.portals[pillarId];
      if (portal && this.hintText) {
        this.hintText.setText(`Entrar a ${portal.config.label} (E)`);
        this.hintText.setPosition(portal.container.x, portal.container.y - 70);
        this.hintText.setVisible(true);
      }
    });

    this.events.on('portal-far', () => {
      this.hintText?.setVisible(false);
    });
  }

  private handleInteract(): void {
    const pos = this.player.getPosition();
    for (const portal of Object.values(this.portals)) {
      if (!portal || portal.config.locked) continue;
      const distance = Phaser.Math.Distance.Between(
        pos.x,
        pos.y,
        portal.container.x,
        portal.container.y,
      );
      if (distance < 90) {
        this.enterPortal(portal.config.id);
        return;
      }
    }
  }

  private handlePortalClick(pillarId: PillarId): void {
    const portal = this.portals[pillarId];
    if (!portal || portal.config.locked) return;
    this.enterPortal(pillarId);
  }

  private enterPortal(pillarId: PillarId): void {
    EventBus.emit('portal-entered', pillarId);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('PillarScene', { pillarId });
    });
  }

  update(_time: number, delta: number): void {
    const bounds = new Phaser.Geom.Rectangle(
      40,
      120,
      this.scale.width - 80,
      this.scale.height - 180,
    );
    this.player.update(delta, bounds);
    const playerPos = this.player.getPosition();
    for (const portal of Object.values(this.portals)) {
      portal?.update(playerPos);
    }
  }
}
