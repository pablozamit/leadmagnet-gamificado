import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { Portal, type PillarId } from '../entities/Portal';
import { AgataGuide } from '../entities/AgataGuide';
import { EventBus } from '../EventBus';
import { getSafeZones, getHubPortalPositions } from '../utils/layout';
import { PILLAR_ORDER } from '../../data/pillarAssets';

/**
 * Hub del museo: Ágata NPC a la izquierda, portales a la derecha, sin título duplicado en móvil.
 */
export class HubScene extends Phaser.Scene {
  private player!: Player;
  private portals: Portal[] = [];
  private agata: AgataGuide | null = null;
  private decor: Phaser.GameObjects.GameObject[] = [];
  private hintText: Phaser.GameObjects.Text | null = null;
  private playBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
  private introStarted = false;

  constructor() {
    super({ key: 'HubScene' });
  }

  create(): void {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;

    this.createDecor(zones);
    this.createPortals();
    this.createPlayer();
    this.createHint(zones.isCoarsePointer);

    this.agata = new AgataGuide(this);
    EventBus.on('lead-capture-complete', this.startIntro, this);
    this.time.delayedCall(600, () => this.startIntro());
    this.events.once('shutdown', () => {
      EventBus.off('lead-capture-complete', this.startIntro, this);
    });

    this.scale.on('resize', this.onResize, this);
    this.events.on('portal-clicked', this.handlePortalClick, this);
    this.player.onInteract(() => this.handleInteract());

    this.cameras.main.setBackgroundColor('#0a0a1e');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    EventBus.emit('current-scene-ready', this);
  }

  private startIntro = (): void => {
    if (this.introStarted) return;
    this.introStarted = true;
    this.agata?.showCharacter();
    EventBus.emit('start-hub-intro');
  };

  private createDecor(zones: ReturnType<typeof getSafeZones>): void {
    const { width, height } = this.scale;
    const count = zones.isMobile ? 3 : 5;

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(this.playBounds.x, width - 24);
      const y = Phaser.Math.Between(this.playBounds.y, height - 60);
      const platform = this.add.rectangle(x, y, 60, 10, 0x1a1a3a, 0.35);
      platform.setStrokeStyle(1, 0x3a3a6a, 0.4);
      this.tweens.add({
        targets: platform,
        y: y - 12,
        alpha: 0.55,
        duration: 2500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      this.decor.push(platform);
    }

    if (!zones.isMobile) {
      const hint = this.add.text(width / 2, this.playBounds.y - 8, 'Explora los 4 pilares del museo', {
        fontSize: '13px',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        color: '#888888',
      });
      hint.setOrigin(0.5, 1);
      this.decor.push(hint);
    }
  }

  private createPortals(): void {
    const positions = getHubPortalPositions(this.playBounds);
    this.portals = PILLAR_ORDER.map((id, index) =>
      Portal.fromPillar(this, positions[index].x, positions[index].y, id, false, index * 70),
    );
  }

  private createPlayer(): void {
    const y = Math.min(this.scale.height * 0.78, this.playBounds.bottom - 32);
    const x = this.playBounds.x + this.playBounds.width * 0.55;
    this.player = new Player(this, x, y);
  }

  private createHint(isCoarsePointer: boolean): void {
    this.hintText = this.add.text(0, 0, '', {
      fontSize: '15px',
      fontFamily: 'Montserrat, system-ui, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      backgroundColor: '#00000099',
      padding: { x: 14, y: 8 },
    });
    this.hintText.setOrigin(0.5, 1).setDepth(60).setVisible(false);

    this.events.on('portal-near', (pillarId: PillarId) => {
      const portal = this.portals.find((p) => p.config.id === pillarId);
      if (portal && this.hintText) {
        const action = isCoarsePointer ? 'Toca el portal' : 'Entrar (E)';
        this.hintText.setText(action);
        this.hintText.setPosition(portal.container.x, portal.container.y - 92);
        this.hintText.setVisible(true);
      }
    });
    this.events.on('portal-far', () => this.hintText?.setVisible(false));
  }

  private onResize = (): void => {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;
    const positions = getHubPortalPositions(this.playBounds);
    this.portals.forEach((portal, i) => {
      portal.container.setPosition(positions[i].x, positions[i].y);
    });
  };

  private handleInteract(): void {
    if (this.agata?.isDialogueBlocking?.()) return;
    const pos = this.player.getPosition();
    for (const portal of this.portals) {
      const distance = Phaser.Math.Distance.Between(
        pos.x,
        pos.y,
        portal.container.x,
        portal.container.y,
      );
      if (distance < 96) {
        this.enterPortal(portal.config.id);
        return;
      }
    }
  }

  private handlePortalClick(pillarId: PillarId): void {
    if (this.agata?.isDialogueBlocking()) return;
    this.enterPortal(pillarId);
  }

  private enterPortal(pillarId: PillarId): void {
    if (this.agata?.isDialogueBlocking()) return;
    EventBus.emit('dialogue-finished');
    EventBus.emit('portal-entered', pillarId);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('PillarScene', { pillarId });
    });
  }

  update(_time: number, delta: number): void {
    this.player.update(delta, this.playBounds);
    const playerPos = this.player.getPosition();
    for (const portal of this.portals) {
      portal.update(playerPos);
    }
  }

  shutdown(): void {
    this.scale.off('resize', this.onResize, this);
    this.agata?.destroy();
    this.agata = null;
  }
}