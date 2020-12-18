import {ComponentAbstract} from "../component/component.abstract";
import {ComponentEnum} from "../component/component.enum";
import {RotationInterface} from "./rotation.interface";

export class Rotation extends ComponentAbstract<RotationInterface> {

    constructor() {
        super(
            ComponentEnum.ROTATION,
            {
                [ComponentEnum.ROTATION]: {
                    angle: 0
                }
            }
        );
    }

}
