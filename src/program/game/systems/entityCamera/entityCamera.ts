import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {Program} from "../../../program";
import {getInvertedPosition, getTilePosition} from "../../../utils/positions.utils";
import {GameMap} from "../../entities/gameMap/gameMap";

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

        const { camera } = Program.getInstance().canvas;

        const targetCameraPosition = getInvertedPosition(position);

        if(camera.position.equals(targetCameraPosition)) return;

        const currentTilePosition = getTilePosition(getInvertedPosition(camera.position));
        const targetTilePosition = getTilePosition(position);

        camera.moveTo(targetCameraPosition);

        if(currentTilePosition.equals(targetTilePosition)) return;

        Program.getInstance().game.entities.get<GameMap>(GameMap.id)
            .updateData<PositionInterface>({ [ComponentEnum.POSITION]: targetTilePosition })
    }

    protected onDataEntityUpdate(
        entity,
        componentEnums ,
        oldEntityData,
        newEntityData
    ) {

    }

}
