import {ComponentAbstract} from "../component/component.abstract";
import {ComponentEnum} from "../component/component.enum";
import {PivotInterface} from "./pivot.interface";

export class Pivot extends ComponentAbstract<PivotInterface> {

    constructor() {
        super(
            ComponentEnum.PIVOT,
            {
                [ComponentEnum.PIVOT]: {
                    x: 0,
                    y: 0
                }
            }
        );
    }

}
