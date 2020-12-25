import * as PIXI from 'pixi.js';
import {Noise} from "noisejs";
import {Program} from "../program";
import {GameMap} from "../game/entities/gameMap/gameMap";
import {GameMapInterface} from "../game/components/gameMap/gameMap.interface";
import {ComponentEnum} from "../game/components/component/component.enum";
import {TexturesEnum} from "../canvas/textures/textures.enum";
import {TEXTURE_NODES} from "../game/systems/gameMap/textureNodes/textureNodes";
import {getRandomNumber} from "./number.utils";
import {TextureNodesType} from "../game/systems/gameMap/textureNodes/textureNodes.type";

let seed: number;
let noise: Noise;
let reversedNoise: Noise;

const spawnRadius = 5;

export const PERLIN_HEIGHT = 3;

export function getPerlinBySeed(tilePosition: PIXI.IPointData, h: number = 10, reversedSeed: boolean = false): number {
    const currentSeed = Program.getInstance().game.entities
        .get(GameMap.id)
        .getData<GameMapInterface>()[ComponentEnum.GAME_MAP].seed;
    if(seed !== currentSeed) {
        seed = currentSeed;
        noise = new Noise(currentSeed)
        reversedNoise = new Noise(currentSeed * Math.PI);
    }

    if(spawnRadius > tilePosition.x && -spawnRadius < tilePosition.x
        && spawnRadius > tilePosition.y && -spawnRadius < tilePosition.y)
        return 0;

    const _noise = reversedSeed ? reversedNoise : noise;

    return Math.trunc(_noise.simplex2(tilePosition.x / h, tilePosition.y / h) * h);
}

export function getTileTextureFromPosition(
    tilePosition: PIXI.IPointData
): TexturesEnum {
    const textureName = getTileTextureNodeFromPosition(tilePosition)?.textureName({ seed: seed });
    return textureName || `rock_${getRandomNumber(0, 5, seed)}` as TexturesEnum;
}

export function getTileTextureNodeFromPosition(
    tilePosition: PIXI.IPointData
): TextureNodesType | undefined {
    //out of this fori bieathc
    // [N, NE, E, SE, S, SO, O, NO]
    const nodeRelativePosArr = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

    const getCollideTile = (position : PIXI.IPointData) => getPerlinBySeed({ x: tilePosition.x + position.x, y: tilePosition.y + position.y });

    const cardinalNodes = nodeRelativePosArr
        .map((posArr) => getCollideTile({ x: posArr[0], y: posArr[1] }))
        .map((collideTile, index) => collideTile < PERLIN_HEIGHT ? null : index)
        .filter(collideIndex => collideIndex !== null);

    const isTileNodesValid = (...nodeArr: number[]) => nodeArr.every((v, i) => cardinalNodes[i] === v)
        && nodeArr.length === cardinalNodes.length;

    return TEXTURE_NODES.find(node => node.nodeArray.some(tileNodes => isTileNodesValid(...tileNodes)));
}

export function getObjectFromPerlinPosition(
    tilePosition: PIXI.IPointData,
    perlin: number,
    reversedPerlin: number,
    currentSeed: number
): TexturesEnum | undefined {

    const isWater = perlin < PERLIN_HEIGHT;

    const tileTexture = isWater ? undefined : getTileTextureFromPosition(tilePosition);
    // const reversedTileTexture = getTileTextureNodeFromPosition(tilePosition)?.textureName({ seed: -seed * reversedPerlin });

    if(reversedPerlin < PERLIN_HEIGHT - 2)
        return;

    const isNumberBetween = (max: number): boolean =>
        getRandomNumber(0, max, currentSeed) === 0;

    if(isWater && isNumberBetween(90))
        return `crew_${getRandomNumber(1, 6, currentSeed)}` as TexturesEnum;

    // console.log(tileTexture, tileTexture?.indexOf('tile_2_') === 0)
    if(tileTexture !== undefined && tileTexture?.indexOf('tile_2_') === 0)
        return `plant_${getRandomNumber(1, 5, currentSeed)}` as TexturesEnum;

    // const tileTexture = getTileTextureNodeFromPosition(tilePosition);
    // if(tileTexture?.textureName({ seed: seed * perlin }).indexOf('tile_2') === 0)
    //     return TexturesEnum.PLANT_1;

    return;
}