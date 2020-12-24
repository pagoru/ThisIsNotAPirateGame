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
import {TEXTURE_NODES} from "./textureNodes/textureNodes";

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

    private getTileTexture(
        tilePosition: PIXI.IPointData,
        perlin: number
    ): TexturesEnum {

        const tileSeed = parseFloat(`0.${perlin * 99}`);

        //out of this fori bieathc
        // [N, NE, E, SE, S, SO, O, NO]
        const nodeRelativePosArr = [[-1, -1], [0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0]];

        const getCollideTile = (position : PIXI.IPointData) => getPerlinBySeed({ x: tilePosition.x + position.x, y: tilePosition.y + position.y });

        const cardinalNodes = nodeRelativePosArr
            .map((posArr) => getCollideTile({ x: posArr[0], y: posArr[1] }))
            .map((collideTile, index) => collideTile < 5 ? null : index)
            .filter(collideIndex => collideIndex !== null);

        const isTileNodesValid = (...nodeArr: number[]) => nodeArr.every((v, i) => cardinalNodes[i] === v)
            && nodeArr.length === cardinalNodes.length;

        const textureName = TEXTURE_NODES
            .find(node => node.nodeArray.some(tileNodes => isTileNodesValid(...tileNodes)))
            ?.textureName({ tileSeed });

        return textureName || `rock_${getRandomNumber(0, 5, tileSeed)}` as TexturesEnum;
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

                const tile = new PIXI.Sprite(textures.get(this.getTileTexture(tilePosition, perlin)));
                tile.position.copyFrom(correctedTilePosition);

                terrainTileContainer.addChild(tile);
            }
        }
    }

}
