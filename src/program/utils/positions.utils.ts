import * as PIXI from 'pixi.js';
import {TILE_SIZE} from "./tile.utils";

export const isPositionInsideContainer = (
    position: PIXI.IPointData,
    spritePosition: PIXI.IPointData,
    size: PIXI.ISize
): boolean => (
    position.x >= spritePosition.x
    && position.y >= spritePosition.y
    && position.x < spritePosition.x + size.width
    && position.y < spritePosition.y + size.height
)

export const getTilePosition = (
    position: PIXI.IPointData
): PIXI.Point => new PIXI.Point(
    Math.trunc(position.x / TILE_SIZE.width),
    Math.trunc(position.y / TILE_SIZE.height)
)

export const getInvertedPosition = (
    position: PIXI.IPointData
): PIXI.IPointData => ({
    x: - position.x + 0,
    y: - position.y + 0
})