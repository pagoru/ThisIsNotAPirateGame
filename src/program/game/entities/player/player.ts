import {EntityAbstract} from "../entity/entity.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityEnum} from "../entity/entity.enum";
import * as PIXI from "pixi.js";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";
import {getRandomNumber} from "../../../utils/number.utils";

export class Player extends EntityAbstract {

    constructor(
        position: PIXI.IPointData,
        rotation: number
    ) {
        super(EntityEnum.PLAYER);

        const friction = getRandomNumber(2, 8) / 50;
        const maxVelocity = getRandomNumber(6, 12);
        const velocity = getRandomNumber(6, 14) / 10;

        const texture = `ship_${getRandomNumber(1, 6)}_0` as TexturesEnum;

        this.addComponent(ComponentEnum.POSITION, { [ComponentEnum.POSITION]: position } );
        this.addComponent(ComponentEnum.SPRITE, { [ComponentEnum.SPRITE]: { visible: true, texture } });
        this.addComponent(ComponentEnum.ROTATION, { [ComponentEnum.ROTATION]: { angle: rotation } } );
        this.addComponent(ComponentEnum.KEYBOARD_CONTROL, { [ComponentEnum.KEYBOARD_CONTROL]: { enabled: true } } );
        this.addComponent(ComponentEnum.CAMERA_CONTROL, { [ComponentEnum.CAMERA_CONTROL]: { follow: true } });
        this.addComponent(ComponentEnum.ACCELERATION, { [ComponentEnum.ACCELERATION]: { current: 0, max: maxVelocity, friction, velocity } });
        this.addComponent(ComponentEnum.PIVOT, { [ComponentEnum.PIVOT]: { x: 0, y: 25 } } );
        this.addComponent(ComponentEnum.LIFE, { [ComponentEnum.LIFE]: { max: 3, current: 3 } } );
    }

}
