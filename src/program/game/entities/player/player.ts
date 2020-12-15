import {EntityAbstract} from "../entity/entity.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {TargetDirectionEnum} from "../../components/targetDirection/targetDirection.enum";
import {EntityEnum} from "../entity/entity.enum";
import * as PIXI from "pixi.js";
import {TexturesEnum} from "../../../canvas/textures.enum";

export class Player extends EntityAbstract {

    constructor(
        username: string,
        position: PIXI.IPointData,
        direction: TargetDirectionEnum
    ) {
        super(EntityEnum.PLAYER);
        this.addComponent(ComponentEnum.TARGET_DIRECTION, { [ComponentEnum.TARGET_DIRECTION]: { direction } } );
        this.addComponent(ComponentEnum.POSITION, { [ComponentEnum.POSITION]: position } );
        this.addComponent(ComponentEnum.TAG, { [ComponentEnum.TAG]: { username } });
        this.addComponent(ComponentEnum.SPRITE, { [ComponentEnum.SPRITE]: { visible: true, texture: TexturesEnum.SHIP_PIRATE_1 } });
        this.addComponent(ComponentEnum.FOLLOW_CAMERA, { [ComponentEnum.FOLLOW_CAMERA]: { follow: true } });
    }

}
