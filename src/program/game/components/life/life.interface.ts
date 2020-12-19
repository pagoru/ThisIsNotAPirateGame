import {ComponentEnum} from "../component/component.enum";

export interface LifeInterface {
    [ComponentEnum.LIFE]: {
        max: number,
        current: number
    }
}
