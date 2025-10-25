import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import type { HotspotDefinition, SceneDefinition } from '../types';

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;

export class SceneView extends Container {
  private backgroundLayer: Container;
  private hotspotLayer: Container;

  constructor() {
    super();
    this.backgroundLayer = new Container();
    this.hotspotLayer = new Container();
    this.addChild(this.backgroundLayer, this.hotspotLayer);
  }

  render(scene: SceneDefinition, options: { onHover: (hotspot: HotspotDefinition | null) => void; onClick: (hotspot: HotspotDefinition) => void; }) {
    this.backgroundLayer.removeChildren();
    this.hotspotLayer.removeChildren();

    scene.layers.forEach((layer) => {
      const graphic = new Graphics();
      graphic.beginFill(layer.color, layer.alpha);
      graphic.drawRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
      graphic.endFill();
      graphic.zIndex = layer.depth;
      this.backgroundLayer.addChild(graphic);

      if (layer.vignette) {
        const vignetteGraphic = new Graphics();
        const gradientSteps = 6;
        for (let i = 0; i < gradientSteps; i++) {
          const alpha = 0.12 + i * 0.08;
          vignetteGraphic.lineStyle(4, 0x000000, alpha);
          vignetteGraphic.drawRoundedRect(
            10 + i * 12,
            10 + i * 12,
            BASE_WIDTH - (i + 1) * 24,
            BASE_HEIGHT - (i + 1) * 24,
            24
          );
        }
        vignetteGraphic.zIndex = layer.depth + 1;
        this.backgroundLayer.addChild(vignetteGraphic);
      }
    });

    const textStyle = new TextStyle({
      fontFamily: 'Cinzel',
      fontSize: 18,
      fill: 0xe8dcc4
    });

    scene.hotspots.forEach((hotspot) => {
      const graphic = new Graphics();
      graphic.beginFill(0xffffff, 0.01);
      graphic.lineStyle(2, 0xe8dcc4, 0.2);
      graphic.drawRoundedRect(
        hotspot.rect.x,
        hotspot.rect.y,
        hotspot.rect.width,
        hotspot.rect.height,
        12
      );
      graphic.endFill();
      graphic.eventMode = 'static';
      graphic.cursor = 'pointer';
      graphic.on('pointerover', () => {
        graphic.alpha = 0.5;
        options.onHover(hotspot);
      });
      graphic.on('pointerout', () => {
        graphic.alpha = 1;
        options.onHover(null);
      });
      graphic.on('pointertap', () => {
        options.onClick(hotspot);
      });

      const label = new Text(hotspot.name, textStyle);
      label.alpha = 0.7;
      label.position.set(hotspot.rect.x + 12, hotspot.rect.y + 12);
      this.hotspotLayer.addChild(graphic, label);

    });
  }

  updateParallax(pointerRatio: { x: number; y: number }, reduceMotion: boolean) {
    if (reduceMotion) {
      this.backgroundLayer.children.forEach((child) => {
        child.position.set(0, 0);
      });
      return;
    }
    this.backgroundLayer.children.forEach((child) => {
      const depth = child.zIndex ?? 0;
      child.position.set(-(pointerRatio.x - 0.5) * depth * 0.04, -(pointerRatio.y - 0.5) * depth * 0.03);
    });
  }
}

export const DESIGN_SIZE = { width: BASE_WIDTH, height: BASE_HEIGHT };
