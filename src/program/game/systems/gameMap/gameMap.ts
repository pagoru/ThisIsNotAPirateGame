import * as PIXI from 'pixi.js';
import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {PositionInterface} from "../../components/position/position.interface";
import {GameMapInterface} from "../../components/gameMap/gameMap.interface";
import {Program} from "../../../program";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";
import {TILE_SIZE} from "../../../utils/tile.utils";
import {
    getObjectFromPerlinPosition,
    getPerlinBySeed,
    getTileTextureFromPosition,
    PERLIN_HEIGHT
} from "../../../utils/perlin.utils";
import {getRandomNumber} from "../../../utils/number.utils";

const MAP_CONTAINER = 'MAP_CONTAINER';
const WATER_TILE_PARTICLE_CONTAINER = 'WATER_TILE_PARTICLE_CONTAINER';
const TERRAIN_TILE_CONTAINER = 'TERRAIN_TILE_CONTAINER';

export class GameMap extends SystemAbstract {

    constructor() {
        super([
            ComponentEnum.GAME_MAP,
            ComponentEnum.POSITION
        ]);
    }

    protected initEntity(entity: EntityAbstract) {
        const {
            [ComponentEnum.POSITION]: position
        } = entity.getData<GameMapInterface & PositionInterface>();

        const { stage } = Program.getInstance().canvas;

        const mapContainer = new PIXI.Container();
        mapContainer.zIndex = -1;
        mapContainer.name = MAP_CONTAINER;

        stage.addChild(mapContainer);

        const waterTileParticleContainer = new PIXI.ParticleContainer();
        waterTileParticleContainer.name = WATER_TILE_PARTICLE_CONTAINER;

        const terrainTileContainer = new PIXI.Container();
        terrainTileContainer.name = TERRAIN_TILE_CONTAINER;

        mapContainer.addChild(waterTileParticleContainer, terrainTileContainer);

        this.renderMap(position);
    }

    protected updateEntity(delta: number, entity: EntityAbstract) {

    }

    protected onDataEntityUpdate(
        entity,
        componentEnums ,
        oldEntityData: PositionInterface,
        newEntityData: PositionInterface & GameMapInterface
    ) {
        const {
            [ComponentEnum.POSITION]: newPosition
        } = newEntityData;

        if(componentEnums.includes(ComponentEnum.POSITION))
            this.renderMap(newPosition);

    }

    private renderMap(
        position: PIXI.IPointData
    ) {
        const { textures, stage } = Program.getInstance().canvas;

        const mapContainer = stage.getChildByName(MAP_CONTAINER) as PIXI.Container;
        if(!mapContainer) return;
        const waterTileParticleContainer = mapContainer.getChildByName(WATER_TILE_PARTICLE_CONTAINER) as PIXI.ParticleContainer;
        if(!waterTileParticleContainer) return;
        const terrainTileContainer = mapContainer.getChildByName(TERRAIN_TILE_CONTAINER) as PIXI.Container;

        waterTileParticleContainer.removeChildren();
        terrainTileContainer.removeChildren();

        const waterTileTexture = textures.get(TexturesEnum.TILE_WATER);

        for (let y = -6; y < 7; y++) {
            for (let x = -9; x < 10; x++) {

                const tileSprite = new PIXI.Sprite(waterTileTexture);
                const tilePosition = {
                    x: position.x + x,
                    y: position.y + y
                }
                const correctedTilePosition = new PIXI.Point(
                    tilePosition.x * TILE_SIZE.width,
                    tilePosition.y * TILE_SIZE.height
                );
                tileSprite.position.copyFrom(correctedTilePosition);

                waterTileParticleContainer.addChild(tileSprite);

                const perlin = getPerlinBySeed(tilePosition);

                if(perlin < PERLIN_HEIGHT) continue;

                const tile = new PIXI.Sprite(textures.get(getTileTextureFromPosition(tilePosition)));
                tile.position.copyFrom(correctedTilePosition);

                terrainTileContainer.addChild(tile);
            }
        }
        for (let y = -6; y < 7; y++) {
            for (let x = -9; x < 10; x++) {


                const tilePosition = {
                    x: position.x + x,
                    y: position.y + y
                }

                const perlin = getPerlinBySeed(tilePosition);
                const targetObject = getObjectFromPerlinPosition(tilePosition, perlin);

                if(!targetObject) continue;

                const correctedTilePosition = new PIXI.Point(
                    tilePosition.x * TILE_SIZE.width,
                    tilePosition.y * TILE_SIZE.height
                );

                const objectTexture = getObjectFromPerlinPosition(correctedTilePosition, perlin);
                if(!objectTexture) continue;

                const spriteTexture = Program.getInstance().canvas.textures.get(objectTexture);
                const correctedObjectPosition = new PIXI.Point(
                    correctedTilePosition.x - getRandomNumber(0, 128, perlin),
                    correctedTilePosition.y - getRandomNumber(0, 128, perlin)
                );

                const spriteObject = new PIXI.Sprite(spriteTexture);
                spriteObject.zIndex = 998;
                spriteObject.position.copyFrom(correctedObjectPosition);

                terrainTileContainer.addChild(spriteObject);

            }
        }
    }

}
