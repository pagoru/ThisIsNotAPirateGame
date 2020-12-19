import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {EventEnum} from "../../../events/event/event.enum";
import {Events} from "../../../events/events";
import {KeyboardDataType} from "../../../events/callback/keyboard/keyboard.data.type";
import {RotationInterface} from "../../components/rotation/rotation.interface";
import {AccelerationInterface} from "../../components/acceleration/acceleration.interface";
import {getTilePosition} from "../../../utils/positions.utils";
import {Program} from "../../../program";
import {ScreenEnum} from "../../../canvas/screens/screen/screen.enum";
import {LifeInterface} from "../../components/life/life.interface";

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
            [ComponentEnum.LIFE]: life
        } = entity.getData<PositionInterface & RotationInterface & AccelerationInterface & LifeInterface>();

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


        const currentTilePosition = getTilePosition(position);

        position.x += delta * Math.cos(rotation.angle * Math.PI / 180) * targetAcceleration;
        position.y += delta * Math.sin(rotation.angle * Math.PI / 180) * targetAcceleration;

        const targetTilePosition = getTilePosition(position);

        this.collision(
            entity,
            currentTilePosition,
            targetTilePosition,
            rotation,
            life,
        )

        entity.updateData<PositionInterface & RotationInterface & AccelerationInterface & LifeInterface>({
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.ACCELERATION]: acceleration,
            [ComponentEnum.LIFE]: life
        });
    }

    protected collision(
        entity: EntityAbstract,
        currentTilePosition: PIXI.Point,
        targetTilePosition: PIXI.Point,
        rotation: RotationInterface[ComponentEnum.ROTATION],
        life: LifeInterface[ComponentEnum.LIFE]
    ) {
        if(currentTilePosition.equals(targetTilePosition)) return false;

        console.log(currentTilePosition, targetTilePosition)

        if(targetTilePosition.equals({ x: 0, y: 0 })) {
            life.current--;

            if(life.current > 0) {
                rotation.angle -= 180;
                return false;
            }

            entity.updateData<LifeInterface>({
                [ComponentEnum.LIFE]: life
            });

            entity.removeComponent(ComponentEnum.KEYBOARD_CONTROL);
            entity.removeComponent(ComponentEnum.CAMERA_CONTROL);
            Program.getInstance().canvas.setScreen(ScreenEnum.GAME_OVER);
            return true;
        }

        return false;
    }

}
