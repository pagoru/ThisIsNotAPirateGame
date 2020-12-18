import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {Program} from "../../../program";

export class EntityCamera extends SystemAbstract {

    constructor() {
        super([
            ComponentEnum.POSITION,
            ComponentEnum.CAMERA_CONTROL
        ]);
    }

    initEntity(entity: EntityAbstract) {
        this.onUpdate(entity);
    }

    updateEntity(delta: number, entity: EntityAbstract) {
        this.onUpdate(entity);
    }

    protected onUpdate(entity: EntityAbstract) {
        const {
            [ComponentEnum.POSITION]: position
        } = entity.getData<PositionInterface>();

        Program.getInstance().canvas.camera.moveTo({
            x: - position.x,
            y: - position.y
        });
    }

}
