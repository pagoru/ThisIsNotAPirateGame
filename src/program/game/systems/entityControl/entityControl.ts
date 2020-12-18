import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {EventEnum} from "../../../events/event/event.enum";
import {Events} from "../../../events/events";
import {KeyboardDataType} from "../../../events/callback/keyboard/keyboard.data.type";
import {RotationInterface} from "../../components/rotation/rotation.interface";
import {AccelerationInterface} from "../../components/acceleration/acceleration.interface";

export class EntityControl extends SystemAbstract {

    private readonly keyPressMap: Map<string, boolean>;

    constructor() {
        super([
            ComponentEnum.KEYBOARD_CONTROL,
            ComponentEnum.POSITION,
            ComponentEnum.ROTATION,
            ComponentEnum.ACCELERATION
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
            [ComponentEnum.ACCELERATION]: acceleration
        } = entity.getData<PositionInterface & RotationInterface & AccelerationInterface>();

        const isKeyWDown = this.keyPressMap.get('KeyW');

        if(!isKeyWDown && acceleration.current === 0) return;

        let targetAcceleration = acceleration.current + (isKeyWDown ? delta * acceleration.velocity : - delta * acceleration.friction);

        if(targetAcceleration > acceleration.max)
            targetAcceleration = acceleration.max;

        if(0 > targetAcceleration)
            targetAcceleration = 0;

        acceleration.current = targetAcceleration

        if (targetAcceleration > 0 && this.keyPressMap.get('KeyD'))
            rotation.angle += delta * targetAcceleration / 4;

        if (targetAcceleration > 0 && this.keyPressMap.get('KeyA'))
            rotation.angle -= delta * targetAcceleration / 4;


        position.x += delta * Math.cos(rotation.angle * Math.PI / 180) * targetAcceleration;
        position.y += delta * Math.sin(rotation.angle * Math.PI / 180) * targetAcceleration;

        entity.updateData<PositionInterface & RotationInterface & AccelerationInterface>({
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.ACCELERATION]: acceleration
        });
    }

}
