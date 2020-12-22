import * as PIXI from 'pixi.js';
import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {PositionInterface} from "../../components/position/position.interface";
import {GameMapInterface} from "../../components/gameMap/gameMap.interface";
import {Program} from "../../../program";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";
import {TILE_SIZE} from "../../../utils/tile.utils";
import {getPerlinBySeed} from "../../../utils/perlin.utils";
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
        const waterTileParticleContainer = mapContainer.getChildByName(WATER_TILE_PARTICLE_CONTAINER) as PIXI.ParticleContainer;
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

                if(perlin < 5) continue;

                const getCollideTile = (x: number, y: number) => getPerlinBySeed({ x: tilePosition.x + x, y: tilePosition.y + y });

                const tileSeed = parseFloat(`0.${perlin * 99}`);

                let tileTexture = textures.get(`rock_${getRandomNumber(0, 5, tileSeed)}` as TexturesEnum);

                const tileWaterSides = [];

                /*

                -0-1-2-
                -3-X-4-
                -5-6-7-

                 */
                let index = 0;
                for (let pY = -1; pY < 2; pY++) {
                    for (let pX = -1; pX < 2; pX++) {
                        if(pX === 0 && pY === 0) continue;

                        if(getCollideTile(pX, pY) < 5)
                            tileWaterSides.push(index);
                        index++;
                    }
                }
                const areTilesWaterEvery = (indexTileWaterArray: number[]) => indexTileWaterArray.every(v => tileWaterSides.includes(v));
                const areTilesWaterSome = (indexTileWaterArray: number[]) => tileWaterSides.every(v => indexTileWaterArray.includes(v));


                if(areTilesWaterEvery([5, 6, 7]))
                    tileTexture = textures.get(TexturesEnum.TILE_1_F);

                if(areTilesWaterSome([1, 3, 4, 6]))
                    tileTexture = textures.get(TexturesEnum. TILE_2_1);


                const tile = new PIXI.Sprite(tileTexture);
                tile.position.copyFrom(correctedTilePosition);

                terrainTileContainer.addChild(tile);
            }
        }
    }

}
