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
import {getPerlinBySeed} from "../../../utils/perlin.utils";
import {PivotInterface} from "../../components/pivot/pivot.interface";

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

        const isKeyWDown = this.keyPressMap.get('KeyW');

        if(!isKeyWDown && acceleration.current === 0) return;

        let targetAcceleration = acceleration.current + (isKeyWDown ? delta * acceleration.velocity : - delta * acceleration.friction);

        if(targetAcceleration > acceleration.max)
            targetAcceleration = acceleration.max;

        if(0 > targetAcceleration)
            targetAcceleration = 0;

        acceleration.current = targetAcceleration;

        if (targetAcceleration > 0 && this.keyPressMap.get('KeyD'))
            rotation.angle += delta * targetAcceleration / 4;

        if (targetAcceleration > 0 && this.keyPressMap.get('KeyA'))
            rotation.angle -= delta * targetAcceleration / 4;


        const positionFromAngle = getPositionFromAngle(rotation.angle);

        position.x += delta * positionFromAngle.x * targetAcceleration;
        position.y += delta * positionFromAngle.y * targetAcceleration;

        this.collision(
            entity,
            rotation,
            life,
        );

        entity.updateData<PositionInterface & RotationInterface & AccelerationInterface & LifeInterface>({
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.ACCELERATION]: acceleration,
            [ComponentEnum.LIFE]: life
        });
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

        if(perlin < 5) return false;

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
