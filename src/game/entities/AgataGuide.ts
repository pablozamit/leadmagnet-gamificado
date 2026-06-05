import Phaser from 'phaser';
import { AgataSpeechBubble } from './AgataSpeechBubble';
import { EventBus } from '../EventBus';
import {
  getSafeZones,
  getAgataNpcPosition,
  type SafeZones,
} from '../utils/layout';
import type { BrandDialogue, DialogueNode } from '../../data/dialogueData';
import { hubIntroDialogue, brandDialogues } from '../../data/dialogueData';

export type AgataAnimState = 'idle' | 'talk' | 'point' | 'wink' | 'emphasis';

/**
 * Ágata como NPC: sprite + boca animada + burbuja de diálogo en Phaser.
 */
export class AgataGuide {
  public readonly root: Phaser.GameObjects.Container;
  private readonly scene: Phaser.Scene;
  private readonly body: Phaser.GameObjects.Sprite;
  private readonly mouth: Phaser.GameObjects.Image;
  private readonly aura: Phaser.GameObjects.Arc;
  private readonly bubble: AgataSpeechBubble;
  private zones: SafeZones;
  private npcScale = 0.2;
  private breatheTween: Phaser.Tweens.Tween | null = null;
  private mouthTween: Phaser.Tweens.Tween | null = null;
  private activeDialogue: BrandDialogue | null = null;
  private currentNodeId: string | null = null;
  private visible = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.zones = getSafeZones(scene.scale);
    this.root = scene.add.container(0, 0).setDepth(80);

    this.aura = scene.add.circle(0, 0, 90, 0xf6a000, 0.12);
    this.aura.setStrokeStyle(2, 0xf6a000, 0.35);
    this.body = scene.add.sprite(0, 0, 'agata', 0);
    this.body.setOrigin(0.5, 1);
    this.mouth = scene.add.image(0, 0, 'agata-mouth').setVisible(false);
    this.mouth.setOrigin(0.5, 0.5);

    this.root.add([this.aura, this.body, this.mouth]);
    this.bubble = new AgataSpeechBubble(scene);

    this.createAnimations();
    this.applyLayout();
    this.root.setAlpha(0);

    scene.scale.on('resize', this.onResize, this);

    EventBus.on('start-hub-intro', this.onHubIntro, this);
    EventBus.on('start-pillar-intro', this.onPillarIntro, this);
    EventBus.on('start-brand-dialogue', this.onBrandDialogue, this);
  }

  private createAnimations(): void {
    if (this.scene.anims.exists('agata-idle')) return;

    this.scene.anims.create({
      key: 'agata-idle',
      frames: this.scene.anims.generateFrameNumbers('agata', { start: 0, end: 1 }),
      frameRate: 2.5,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'agata-talk',
      frames: this.scene.anims.generateFrameNumbers('agata', { frames: [2, 0, 2, 1] }),
      frameRate: 7,
      repeat: -1,
    });
    this.scene.anims.create({
      key: 'agata-point',
      frames: [{ key: 'agata', frame: 3 }],
      frameRate: 1,
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'agata-emphasis',
      frames: [{ key: 'agata', frame: 4 }],
      frameRate: 1,
      repeat: 0,
    });
    this.scene.anims.create({
      key: 'agata-wink',
      frames: [{ key: 'agata', frame: 4 }],
      frameRate: 1,
      repeat: 0,
    });
  }

  public showCharacter(): void {
    if (this.visible) return;
    this.visible = true;
    this.applyLayout();
    this.scene.tweens.add({
      targets: this.root,
      alpha: 1,
      y: this.root.y + 12,
      duration: 450,
      ease: 'Back.easeOut',
    });
    this.playState('idle');
  }

  public playDialogue(dialogue: BrandDialogue): void {
    this.showCharacter();
    this.activeDialogue = dialogue;
    this.showNode(dialogue.startNodeId);
  }

  private showNode(nodeId: string): void {
    if (!this.activeDialogue) return;
    const node = this.activeDialogue.nodes[nodeId];
    if (!node) {
      this.endDialogue();
      return;
    }
    this.currentNodeId = nodeId;
    this.playStateForNode(node);

    const anchor = this.getBubbleAnchor();
    this.bubble.show(node, anchor.x, anchor.y, anchor.maxWidth, {
      onAdvance: () => this.advanceFromNode(node),
      onChoice: (nextId) => this.handleChoice(nextId),
    });
    this.bubble.enableTapAdvance();
  }

  private playStateForNode(node: DialogueNode): void {
    if (node.options && node.options.length > 0) {
      this.playState('point');
      return;
    }
    const t = node.text.toLowerCase();
    if (t.includes('?') || t.includes('¿')) {
      this.playState('emphasis');
      return;
    }
    if (t.includes('!') || t.includes('¡')) {
      this.playState('point');
      return;
    }
    this.playState('talk');
  }

  private advanceFromNode(node: DialogueNode): void {
    if (node.options && node.options.length > 0) return;
    if (node.nextId === 'exit' || node.nextId === 'end' || !node.nextId) {
      this.endDialogue();
      return;
    }
    this.showNode(node.nextId);
  }

  private handleChoice(nextId: string): void {
    if (!nextId) {
      this.endDialogue();
      return;
    }
    if (nextId === 'exit') {
      EventBus.emit('dialogue-exit-request');
      this.endDialogue();
      return;
    }
    this.showNode(nextId);
  }

  private endDialogue(): void {
    this.bubble.hide();
    this.activeDialogue = null;
    this.currentNodeId = null;
    this.playState('idle');
    EventBus.emit('dialogue-finished');
  }

  public playState(state: AgataAnimState): void {
    this.mouthTween?.stop();
    EventBus.emit('agata-anim', state);
    const key =
      state === 'wink' ? 'agata-wink' : `agata-${state === 'emphasis' ? 'emphasis' : state}`;

    if (state === 'talk') {
      this.body.anims.play('agata-talk', true);
      this.mouth.setVisible(true);
      this.mouthTween = this.scene.tweens.add({
        targets: this.mouth,
        scaleY: 1.15,
        duration: 180,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      return;
    }

    this.mouth.setVisible(false);
    if (state === 'idle') {
      this.body.anims.play('agata-idle', true);
      this.startIdleBreathing();
      return;
    }

    this.breatheTween?.stop();
    if (state === 'point' || state === 'emphasis') {
      this.body.once(`animationcomplete-${key}`, () => this.playState('idle'));
      this.body.anims.play(key, false);
      return;
    }
    this.body.anims.play(key, true);
  }

  private startIdleBreathing(): void {
    this.breatheTween?.stop();
    this.body.setScale(1, 1);
    this.breatheTween = this.scene.tweens.add({
      targets: this.body,
      scaleY: 1.04,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  public isDialogueBlocking(): boolean {
    return this.activeDialogue !== null;
  }

  private applyLayout(): void {
    this.zones = getSafeZones(this.scene.scale);
    const pos = getAgataNpcPosition(this.scene.scale, this.zones);
    this.npcScale = pos.scale;
    this.root.setPosition(pos.x, pos.y);
    this.root.setScale(pos.scale);
    this.body.setPosition(0, 0);
    this.mouth.setPosition(-6, -this.body.displayHeight * 0.56);
    this.mouth.setScale(0.55 / pos.scale);
    this.aura.setPosition(0, -this.body.displayHeight * 0.45);

    if (this.currentNodeId && this.activeDialogue) {
      const anchor = this.getBubbleAnchor();
      this.bubble.setPosition(anchor.x, anchor.y, anchor.maxWidth);
    }
  }

  private getBubbleAnchor(): { x: number; y: number; maxWidth: number } {
    const pos = getAgataNpcPosition(this.scene.scale, this.zones);
    const headY = this.root.y - this.body.displayHeight - 8;
    return {
      x: this.root.x,
      y: headY,
      maxWidth: pos.bubbleMaxWidth,
    };
  }

  private onResize = (): void => {
    this.applyLayout();
  };

  private onHubIntro = (): void => {
    this.playDialogue(hubIntroDialogue);
  };

  private onPillarIntro = (pillarName: string): void => {
    const dialogue: BrandDialogue = {
      startNodeId: 'start',
      nodes: {
        start: {
          id: 'start',
          speaker: 'agata',
          text: `¡Bienvenida al pilar de ${pillarName}! Acércate a una marca y pulsa E o tócala.`,
          nextId: 'end',
        },
        end: {
          id: 'end',
          speaker: 'agata',
          text: 'Cada sala esconde una táctica real. ¡Explora!',
          options: [{ text: '¡A explorar!', nextId: '' }],
        },
      },
    };
    this.playDialogue(dialogue);
  };

  private onBrandDialogue = (brandId: string): void => {
    const d = brandDialogues[brandId];
    if (d) this.playDialogue(d);
    else {
      this.playDialogue({
        startNodeId: 'start',
        nodes: {
          start: {
            id: 'start',
            speaker: 'agata',
            text: 'Próximamente más secretos de esta marca…',
            options: [{ text: 'Volver', nextId: 'exit' }],
          },
        },
      });
    }
  };

  public destroy(): void {
    EventBus.off('start-hub-intro', this.onHubIntro, this);
    EventBus.off('start-pillar-intro', this.onPillarIntro, this);
    EventBus.off('start-brand-dialogue', this.onBrandDialogue, this);
    this.scene.scale.off('resize', this.onResize, this);
    this.breatheTween?.stop();
    this.mouthTween?.stop();
    this.bubble.destroy();
    this.root.destroy();
  }
}