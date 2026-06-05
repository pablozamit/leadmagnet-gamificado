import Phaser from 'phaser';
import { EventBus } from '../EventBus';
import { pillars } from '../../data/brandData';
import { PILLAR_ASSETS } from '../../data/pillarAssets';
import { AGATA_FRAME_WIDTH, AGATA_FRAME_HEIGHT } from '../config/agataAssets';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.load.spritesheet('agata', '/assets/characters/agata-sheet.png', {
      frameWidth: AGATA_FRAME_WIDTH,
      frameHeight: AGATA_FRAME_HEIGHT,
    });
    this.load.image('agata-mouth', '/assets/characters/agata-mouth.png');

    for (const pillar of pillars) {
      const asset = PILLAR_ASSETS[pillar.id as keyof typeof PILLAR_ASSETS];
      if (asset) {
        this.load.image(`pillar-icon-${pillar.id}`, asset.icon);
      }
    }
  }

  create(): void {
    EventBus.emit('current-scene-ready', this);
    this.scene.start('HubScene');
  }
}