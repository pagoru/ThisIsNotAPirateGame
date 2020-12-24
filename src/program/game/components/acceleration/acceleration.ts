import {ComponentAbstract} from "../component/component.abstract";
import {ComponentEnum} from "../component/component.enum";
import {AccelerationInterface} from "./acceleration.interface";

export class Acceleration extends ComponentAbstract<AccelerationInterface> {

    constructor() {
        super(
            ComponentEnum.ACCELERATION,
            {
                [ComponentEnum.ACCELERATION]: {
                    velocity: 1,
                    friction: 1,
                    max: 10,
                    min: 2,
                    current: 0
                }
            }
        );
    }

}
