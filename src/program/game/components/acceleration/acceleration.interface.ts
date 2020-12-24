import {ComponentEnum} from "../component/component.enum";

export interface AccelerationInterface {
    [ComponentEnum.ACCELERATION]: {
        max: number,
        min: number,
        velocity: number,
        friction: number,
        current: number
    }
}
