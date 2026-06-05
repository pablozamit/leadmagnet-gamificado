import Phaser from 'phaser';
import { AgataGuide } from './AgataGuide';
import type { BrandDialogue } from '../../data/dialogueData';

/** @deprecated Usar AgataGuide directamente. Wrapper mínimo para escenas legacy. */
export class Agata {
  private readonly guide: AgataGuide;

  constructor(scene: Phaser.Scene) {
    this.guide = new AgataGuide(scene);
  }

  public show(): void {
    this.guide.showCharacter();
  }

  public hide(): void {
    this.guide.playState('idle');
  }

  public playDialogue(dialogue: BrandDialogue): void {
    this.guide.playDialogue(dialogue);
  }

  public destroy(): void {
    this.guide.destroy();
  }
}