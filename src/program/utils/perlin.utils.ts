import * as PIXI from 'pixi.js';
import {Noise} from "noisejs";
import {Program} from "../program";
import {GameMap} from "../game/entities/gameMap/gameMap";
import {GameMapInterface} from "../game/components/gameMap/gameMap.interface";
import {ComponentEnum} from "../game/components/component/component.enum";

let seed: number;
let noise: Noise;

const spawnRadius = 5;

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
