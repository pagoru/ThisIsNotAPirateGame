import {ComponentAbstract} from "../component/component.abstract";
import {ComponentEnum} from "../component/component.enum";
import {GameMapInterface} from "./gameMap.interface";

export class GameMap extends ComponentAbstract<GameMapInterface> {

    constructor() {
        super(
            ComponentEnum.GAME_MAP,
            {
                [ComponentEnum.GAME_MAP]: {
                    seed: 0
                }
            }
        );
    }

}
