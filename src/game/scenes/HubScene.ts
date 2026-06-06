import Phaser from 'phaser';
import { Portal, type PillarId } from '../entities/Portal';
import { AgataGuide } from '../entities/AgataGuide';
import { EventBus } from '../EventBus';
import { getSafeZones, getHubPortalPositions } from '../utils/layout';
import { PILLAR_ORDER } from '../../data/pillarAssets';

/**
 * Hub del museo: Ágata NPC, portales táctiles (sin avatar jugador).
 */
export class HubScene extends Phaser.Scene {
  private portals: Portal[] = [];
  private agata: AgataGuide | null = null;
  private decor: Phaser.GameObjects.GameObject[] = [];
  private playBounds = new Phaser.Geom.Rectangle(0, 0, 0, 0);
  private introPlayed = false;
  private fromCompletedPillar = false;

  constructor() {
    super({ key: 'HubScene' });
  }

  init(data?: { fromCompletedPillar?: boolean }): void {
    // La escena se reutiliza: permitir volver a mostrar Ágata e intro
    this.introPlayed = false;
    this.fromCompletedPillar = !!data?.fromCompletedPillar;
  }

  create(): void {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;

    this.createDecor(zones);
    this.createPortals();

    this.agata = new AgataGuide(this);
    this.agata.showCharacter();

    EventBus.on('lead-capture-complete', this.startIntro, this);
    this.time.delayedCall(400, () => this.startIntro());

    this.scale.on('resize', this.onResize, this);
    this.events.on('portal-clicked', this.handlePortalClick, this);
    this.events.once('shutdown', this.shutdown, this);

    this.cameras.main.setBackgroundColor('#0a0a1e');
    this.cameras.main.fadeIn(500, 0, 0, 0);
    EventBus.emit('current-scene-ready', this);
  }

  private startIntro = (): void => {
    if (this.introPlayed) return;
    this.introPlayed = true;

    if (this.fromCompletedPillar) {
      const welcomeBack: any = {
        startNodeId: 'welcome',
        nodes: {
          welcome: {
            id: 'welcome',
            speaker: 'agata',
            text: 'Muy bien, ¿por qué otro pilar quieres seguir?',
          }
        }
      };
      this.agata?.playDialogue(welcomeBack);
    } else {
      EventBus.emit('start-hub-intro');
    }
  };

  private createDecor(zones: ReturnType<typeof getSafeZones>): void {
    const { width, height } = this.scale;

    // Ocultar plataformas decorativas en móvil
    if (!zones.isMobile) {
        const count = 5;
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

        const hint = this.add.text(width / 2, this.playBounds.y - 8, 'Pulsa el pilar donde quieras empezar', {
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
    const progress = (this.game as any).progress;
    const completedList = progress?.pillarsCompleted || [];

    this.portals = PILLAR_ORDER.map((id, index) => {
      const portal = Portal.fromPillar(this, positions[index].x, positions[index].y, id, false, index * 70);
      if (completedList.includes(id)) {
        portal.setCompleted(true);
      }
      return portal;
    });
  }

  private onResize = (): void => {
    const zones = getSafeZones(this.scale);
    this.playBounds = zones.playArea;
    const positions = getHubPortalPositions(this.playBounds);
    this.portals.forEach((portal, i) => {
      portal.container.setPosition(positions[i].x, positions[i].y);
    });
  };

  private handlePortalClick(pillarId: PillarId): void {
    // 🌟 CORRECCIÓN: Si el pilar ya está en la lista de completados, bloqueamos por completo el re-ingreso
    const progress = (this.game as any).progress;
    const completedList = progress?.pillarsCompleted || [];
    if (completedList.includes(pillarId)) {
      return; 
    }

    this.agata?.playState('jump');

    const farewell: any = {
      startNodeId: 'farewell',
      nodes: {
        farewell: {
          id: 'farewell',
          speaker: 'agata',
          text: '¡Buena elección! Vamos a descubrir qué sorpresas nos esperan allí.',
          nextId: 'end'
        }
      }
    };

    this.agata?.playDialogue(farewell, undefined, () => {
        this.enterPortal(pillarId);
    });
  }

  private enterPortal(pillarId: PillarId): void {
    EventBus.emit('portal-entered', pillarId);
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('PillarScene', { pillarId });
    });
  }

  shutdown(): void {
    this.scale.off('resize', this.onResize, this);
    this.events.off('portal-clicked', this.handlePortalClick, this);
    EventBus.off('lead-capture-complete', this.startIntro, this);
    this.agata?.destroy();
    this.agata = null;
  }
}
