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

const spawnRadius = 5;

export const PERLIN_HEIGHT = 3;

export function getPerlinBySeed(tilePosition: PIXI.IPointData, h: number = 10): number {
    const currentSeed = Program.getInstance().game.entities
        .get(GameMap.id)
        .getData<GameMapInterface>()[ComponentEnum.GAME_MAP].seed;
    if(seed !== currentSeed) {
        seed = currentSeed;
        noise = new Noise(currentSeed)
    }

    if(spawnRadius > tilePosition.x && -spawnRadius < tilePosition.x
        && spawnRadius > tilePosition.y && -spawnRadius < tilePosition.y)
        return 0;

    return Math.trunc(noise.simplex2(tilePosition.x / h, tilePosition.y / h) * h);
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
    perlin: number
): TexturesEnum | undefined {

    const isValid = (max: number) => getRandomNumber(0, max, seed * perlin) === 0;

    if(isValid(1000) && perlin < PERLIN_HEIGHT)
        return TexturesEnum.CREW_1;

    const tileTexture = getTileTextureNodeFromPosition(tilePosition);
    if(isValid(1) && tileTexture?.textureName({ seed: seed * perlin }).indexOf('tile_2') === 0)
        return TexturesEnum.PLANT_1;

    return undefined;
}