import {ComponentAbstract} from "../component/component.abstract";
import {ComponentEnum} from "../component/component.enum";
import {LifeInterface} from "./life.interface";

export class Life extends ComponentAbstract<LifeInterface> {

    constructor() {
        super(
            ComponentEnum.LIFE,
            {
                [ComponentEnum.LIFE]: {
                    current: 3,
                    max: 3
                }
            }
        );
    }

}
