import {EntityAbstract} from "../entity/entity.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityEnum} from "../entity/entity.enum";
import * as PIXI from "pixi.js";
import {TexturesEnum} from "../../../canvas/textures.enum";

export class Player extends EntityAbstract {

    constructor(
        position: PIXI.IPointData,
        rotation: number
    ) {
        super(EntityEnum.PLAYER);
        this.addComponent(ComponentEnum.POSITION, { [ComponentEnum.POSITION]: position } );
        this.addComponent(ComponentEnum.SPRITE, { [ComponentEnum.SPRITE]: { visible: true, texture: TexturesEnum.SHIP_1 } });
        this.addComponent(ComponentEnum.ROTATION, { [ComponentEnum.ROTATION]: { angle: rotation } } );
        this.addComponent(ComponentEnum.KEYBOARD_CONTROL, { [ComponentEnum.KEYBOARD_CONTROL]: { enabled: true } } );
        this.addComponent(ComponentEnum.CAMERA_CONTROL, { [ComponentEnum.CAMERA_CONTROL]: { follow: true } });
        this.addComponent(ComponentEnum.ACCELERATION, { [ComponentEnum.ACCELERATION]: { current: 0, max: 10, friction: 0.2, velocity: 1 } });
        this.addComponent(ComponentEnum.PIVOT, { [ComponentEnum.PIVOT]: { x: 0, y: 25 } } );
    }

}
