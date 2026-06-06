import Phaser from 'phaser';
import { PILLAR_ASSETS } from '../../data/pillarAssets';

export type PillarId = 'gamification' | 'acompanamiento' | 'celebracion' | 'comunidad';

export interface PortalConfig {
  id: PillarId;
  label: string;
  color: number;
  glowColor: number;
  iconKey: string;
  locked?: boolean;
}

// En móvil los portales son más pequeños para caber en la cuadrícula
const isMobileDevice = () =>
  typeof window !== 'undefined' && window.innerWidth <= 480;

function getPortalSizes() {
  const mobile = isMobileDevice();
  return {
    outerRadius: mobile ? 38 : 52,
    innerRadius: mobile ? 28 : 38,
    iconSize: mobile ? 48 : 72,
    hitRadius: mobile ? 36 : 40,
    labelY: mobile ? 46 : 58,
    counterY: mobile ? 62 : 78,
    labelFontSize: mobile ? '11px' : '14px',
    counterFontSize: mobile ? '10px' : '12px',
    containerSize: mobile ? 90 : 120,
  };
}

/**
 * `Portal` - Portal del Hub con icono PNG y feedback visual.
 */
export class Portal {
  public readonly container: Phaser.GameObjects.Container;
  public readonly config: PortalConfig;
  private readonly scene: Phaser.Scene;
  private readonly outerRing: Phaser.GameObjects.Arc;
  private readonly innerGlow: Phaser.GameObjects.Arc;
  private readonly icon: Phaser.GameObjects.Image;
  private readonly label: Phaser.GameObjects.Text;
  private readonly counter: Phaser.GameObjects.Text;
  private checkmark: Phaser.GameObjects.Text | null = null;
  private pulseTween: Phaser.Tweens.Tween | null = null;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: PortalConfig,
    appearDelay = 0,
  ) {
    this.scene = scene;
    this.config = config;
    this.container = scene.add.container(x, y);
    this.container.setScale(0);

    const s = getPortalSizes();

    this.outerRing = scene.add.circle(0, 0, s.outerRadius, config.color, 0);
    this.outerRing.setStrokeStyle(3, config.glowColor, 0.65);
    this.container.add(this.outerRing);

    this.innerGlow = scene.add.circle(0, 0, s.innerRadius, config.glowColor, 0.22);
    this.container.add(this.innerGlow);

    this.icon = scene.add.image(0, 0, config.iconKey);
    const iconScale = s.iconSize / Math.max(this.icon.width, this.icon.height);
    this.icon.setScale(iconScale);
    this.container.add(this.icon);

    this.label = scene.add.text(0, s.labelY, config.label, {
      fontSize: s.labelFontSize,
      fontFamily: 'Montserrat, system-ui, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: { width: s.containerSize - 8 },
    });
    this.label.setOrigin(0.5, 0);
    this.container.add(this.label);

    this.counter = scene.add.text(0, s.counterY, '0/3', {
      fontSize: s.counterFontSize,
      fontFamily: 'Montserrat, system-ui, sans-serif',
      color: '#f6a000',
      stroke: '#000000',
      strokeThickness: 2,
    });
    this.counter.setOrigin(0.5, 0.5);
    this.container.add(this.counter);
    this.counter.setVisible(false);

    if (config.locked) {
      this.applyLockedStyle();
    } else {
      this.startPulse();
    }

    this.container.setSize(s.containerSize, s.containerSize + 30);

    const hitbox = scene.add.circle(0, 0, s.hitRadius, 0x000000, 0);
    this.container.add(hitbox);

    if (!config.locked) {
      hitbox.setInteractive({ useHandCursor: true });
      hitbox.on('pointerdown', () => {
        if (this.config.locked) return;
        this.popSelect();
        this.scene.events.emit('portal-clicked', config.id);
      });
      hitbox.on('pointerover', () => this.popHover());
    }

    scene.tweens.add({
      targets: this.container,
      scale: 1,
      duration: 450,
      delay: appearDelay,
      ease: 'Back.easeOut',
    });
  }

  private popHover(): void {
    if (this.config.locked) return;
    this.scene.tweens.add({
      targets: this.icon,
      scale: this.icon.scale * 1.08,
      duration: 120,
      yoyo: true,
      ease: 'Sine.easeOut',
    });
  }

  private popSelect(): void {
    this.scene.tweens.add({
      targets: [this.icon, this.innerGlow],
      scaleX: '*=1.15',
      scaleY: '*=1.15',
      duration: 100,
      yoyo: true,
      ease: 'Back.easeOut',
    });
    this.innerGlow.setAlpha(0.55);
  }

  private startPulse(): void {
    this.pulseTween = this.scene.tweens.add({
      targets: this.outerRing,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  private applyLockedStyle(): void {
    this.outerRing.setStrokeStyle(2, 0x444444, 0.4);
    this.innerGlow.setFillStyle(0x444444, 0.1);
    this.icon.setAlpha(0.45);
    this.label.setColor('#888888');
    this.label.setText(`${this.config.label}\n(Próximamente)`);
  }

  public setCompleted(isCompleted: boolean): void {
    if (!isCompleted) return;

    this.counter.setVisible(false);
    this.pulseTween?.stop();
    this.outerRing.setScale(1);
    this.outerRing.setStrokeStyle(3, 0x44ff44, 0.8);
    this.innerGlow.setFillStyle(0x44ff44, 0.15);
    this.icon.setAlpha(0.8);

    const s = getPortalSizes();

    if (!this.checkmark) {
      this.checkmark = this.scene.add.text(0, s.innerRadius - 4, '✓', {
        fontSize: isMobileDevice() ? '28px' : '44px',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        color: '#44ff44',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 6,
      });
      this.checkmark.setOrigin(0.5, 0.5);
      this.container.add(this.checkmark);

      this.label.setText(`${this.config.label}\n✓`);
      this.label.setColor('#44ff44');
    }
  }

  public destroy(): void {
    this.pulseTween?.destroy();
    this.container.destroy();
  }

  public static fromPillar(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: PillarId,
    locked = false,
    appearDelay = 0,
  ): Portal {
    const asset = PILLAR_ASSETS[id];
    return new Portal(
      scene,
      x,
      y,
      {
        id,
        label: asset.label,
        color: asset.color,
        glowColor: asset.glowColor,
        iconKey: `pillar-icon-${id}`,
        locked,
      },
      appearDelay,
    );
  }
}
