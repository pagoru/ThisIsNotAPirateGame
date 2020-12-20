import {EntityAbstract} from "../entity/entity.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityEnum} from "../entity/entity.enum";
import {getRandomNumber} from "../../../utils/number.utils";

export class GameMap extends EntityAbstract {

    static id: string;

    constructor() {
        super(EntityEnum.GAME_MAP);

        GameMap.id = this.id;

        this.addComponent(ComponentEnum.POSITION, { [ComponentEnum.POSITION]: { x: 0, y: 0 } } );
        this.addComponent(ComponentEnum.GAME_MAP, { [ComponentEnum.GAME_MAP]: { seed: getRandomNumber(0, 9999) } } );
    }

}
