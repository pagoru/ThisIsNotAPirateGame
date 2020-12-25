import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {EventEnum} from "../../../events/event/event.enum";
import {Events} from "../../../events/events";
import {KeyboardDataType} from "../../../events/callback/keyboard/keyboard.data.type";
import {RotationInterface} from "../../components/rotation/rotation.interface";
import {AccelerationInterface} from "../../components/acceleration/acceleration.interface";
import {getPositionFromAngle, getTilePosition} from "../../../utils/positions.utils";
import {Program} from "../../../program";
import {ScreenEnum} from "../../../canvas/screens/screen/screen.enum";
import {LifeInterface} from "../../components/life/life.interface";
import {getObjectFromPerlinPosition, getPerlinBySeed, PERLIN_HEIGHT} from "../../../utils/perlin.utils";
import {PivotInterface} from "../../components/pivot/pivot.interface";
import {GameMap} from "../gameMap/gameMap";
import * as PIXI from "pixi.js";
import {TILE_SIZE} from "../../../utils/tile.utils";

export class EntityControl extends SystemAbstract {

    private readonly keyPressMap: Map<string, boolean>;

    constructor() {
        super([
            ComponentEnum.KEYBOARD_CONTROL,
            ComponentEnum.POSITION,
            ComponentEnum.ROTATION,
            ComponentEnum.ACCELERATION,
            ComponentEnum.LIFE
        ]);

        this.keyPressMap = new Map<string, boolean>();

        Events.on(EventEnum.KEYBOARD_KEY, this.onKeyboardKey.bind(this))
    }

    private onKeyboardKey(keyboardDataType: KeyboardDataType) {
        this.keyPressMap.set(keyboardDataType.keyboardEvent.code, keyboardDataType.isDown);
    }

    initEntity(entity: EntityAbstract) {

    }

    updateEntity(delta: number, entity: EntityAbstract) {
        const {
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.ACCELERATION]: acceleration,
            [ComponentEnum.LIFE]: life,
        } = entity.getData<PositionInterface & RotationInterface & AccelerationInterface & LifeInterface & PivotInterface>();

        // const isKeyWDown = this.keyPressMap.get('KeyW');

        // if(acceleration.current === 0) return;

        const isKeyDDown = this.keyPressMap.get('KeyD');
        const isKeyADown = this.keyPressMap.get('KeyA');

        let targetAcceleration = acceleration.current + ((isKeyDDown || isKeyADown)
            ? -(delta * acceleration.friction)
            : (delta * acceleration.velocity));

        if(targetAcceleration > acceleration.max)
            targetAcceleration = acceleration.max;

        if(targetAcceleration < acceleration.min)
            targetAcceleration = acceleration.min;

        if(0 > targetAcceleration)
            targetAcceleration = 0;

        acceleration.current = targetAcceleration;

        if (targetAcceleration > 0 && isKeyDDown)
            rotation.angle += delta * targetAcceleration / 4;

        if (targetAcceleration > 0 && isKeyADown)
            rotation.angle -= delta * targetAcceleration / 4;

        // console.log('2', targetAcceleration);

        const positionFromAngle = getPositionFromAngle(rotation.angle);

        position.x += delta * positionFromAngle.x * targetAcceleration;
        position.y += delta * positionFromAngle.y * targetAcceleration;

        this.collision(
            entity,
            rotation,
            life,
        );

        this.objectCollision(
            entity
        );

        entity.updateData<PositionInterface & RotationInterface & AccelerationInterface & LifeInterface>({
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.ACCELERATION]: acceleration,
            [ComponentEnum.LIFE]: life
        });
    }

    protected objectCollision(
        entity: EntityAbstract,
    ) {
        const spriteEntity = Program.getInstance().canvas.stage.getChildByName(entity.id);
        if(!spriteEntity) return false;

        const targetTilePosition = getTilePosition(spriteEntity.position);
        const perlin = getPerlinBySeed(targetTilePosition);
        const reversedPerlin = getPerlinBySeed(targetTilePosition, 10, true);

        const correctedTilePosition = new PIXI.Point(
            targetTilePosition.x * TILE_SIZE.width,
            targetTilePosition.y * TILE_SIZE.height
        );

        const currentSeed = reversedPerlin / 10 - ( correctedTilePosition.x * 2 + correctedTilePosition.y);

        const targetObject = getObjectFromPerlinPosition(targetTilePosition, perlin, reversedPerlin, currentSeed);

        if(!targetObject || targetObject.indexOf('crew_') !== 0) return;

        console.log(targetObject)

        const objectEntity = GameMap.getTerrainTilesContainer()
            .getChildByName(`object_${currentSeed}`);

        objectEntity.alpha = 0;
        console.log(objectEntity)
    }

    protected collision(
        entity: EntityAbstract,
        rotation: RotationInterface[ComponentEnum.ROTATION],
        life: LifeInterface[ComponentEnum.LIFE],
    ) {
        const spriteEntity = Program.getInstance().canvas.stage.getChildByName(entity.id);
        if(!spriteEntity) return false;

        const targetTilePosition = getTilePosition(spriteEntity.position);
        const perlin = getPerlinBySeed(targetTilePosition);

        if(perlin < PERLIN_HEIGHT) return false;

        life.current--;

        if(life.current > 0) {
            rotation.angle -= 180;
            return true;
        }

        entity.updateData<LifeInterface>({
            [ComponentEnum.LIFE]: life
        });

        entity.removeComponent(ComponentEnum.KEYBOARD_CONTROL);
        entity.removeComponent(ComponentEnum.CAMERA_CONTROL);
        Program.getInstance().canvas.setScreen(ScreenEnum.GAME_OVER);
        return true;
    }

    protected onDataEntityUpdate(
        entity,
        componentEnums ,
        oldEntityData,
        newEntityData
    ) {

    }

}
