import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { pillars } from '../../data/brandData';
import { PILLAR_ASSETS } from '../../data/pillarAssets';

export class PreloadScene extends Phaser.Scene {
  constructor() { super({ key: 'PreloadScene' }); }
  preload(): void {
    this.load.spritesheet('agata', '/assets/characters/agata-sheet.png', { frameWidth: 520, frameHeight: 720 });
    for (const pillar of pillars) {
      const asset = PILLAR_ASSETS[pillar.id as keyof typeof PILLAR_ASSETS];
      if (asset) this.load.image(`pillar-icon-${pillar.id}`, asset.icon);
    }
  }
  create(): void {
    EventBus.emit('current-scene-ready', this);
    this.scene.start('HubScene');
  }
}