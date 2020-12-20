import * as PIXI from 'pixi.js';
import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {PositionInterface} from "../../components/position/position.interface";
import {GameMapInterface} from "../../components/gameMap/gameMap.interface";
import {Program} from "../../../program";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";
import {TILE_SIZE} from "../../../utils/tile.utils";
import {Noise} from "noisejs";

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
            [ComponentEnum.GAME_MAP]: gameMap,
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

        this.renderMap(position, gameMap.seed);
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
            [ComponentEnum.POSITION]: oldPosition,
        } = oldEntityData;

        const {
            [ComponentEnum.POSITION]: newPosition
        } = newEntityData;

        if(componentEnums.includes(ComponentEnum.POSITION))
            this.onPositionUpdate(entity, oldPosition, newPosition);

    }

    private onPositionUpdate(entity: EntityAbstract, oldPosition: PIXI.IPointData, newPosition: PIXI.IPointData) {
        const {
            [ComponentEnum.GAME_MAP]: gameMap
        } = entity.getData<GameMapInterface>();

        this.renderMap(newPosition, gameMap.seed);
    }

    private renderMap(
        position: PIXI.IPointData,
        seed: number
    ) {
        const { textures, stage } = Program.getInstance().canvas;

        const mapContainer = stage.getChildByName(MAP_CONTAINER) as PIXI.Container;
        const waterTileParticleContainer = mapContainer.getChildByName(WATER_TILE_PARTICLE_CONTAINER) as PIXI.ParticleContainer;
        const terrainTileContainer = mapContainer.getChildByName(TERRAIN_TILE_CONTAINER) as PIXI.Container;

        waterTileParticleContainer.removeChildren();
        terrainTileContainer.removeChildren();

        const waterTileTexture = textures.get(TexturesEnum.TILE_WATER);
        const tileA = textures.get(TexturesEnum.TILE_2_1);

        const noise = new Noise(seed);

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

                const perlinHeight = 10;

                const perlinY = Math.trunc(noise.simplex2(tilePosition.x / perlinHeight, tilePosition.y / perlinHeight) * perlinHeight);

                if(perlinY < 5) continue;

                const tile = new PIXI.Sprite(tileA);
                tile.position.copyFrom(correctedTilePosition);

                terrainTileContainer.addChild(tile)

            }
        }
    }

}
