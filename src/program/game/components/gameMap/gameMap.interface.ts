import {ComponentEnum} from "../component/component.enum";

export interface GameMapInterface {
    [ComponentEnum.GAME_MAP]: {
        seed: number
    }
}
