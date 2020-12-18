
import {KeyboardControlInterface} from "./keyboardControl.interface";
import {ComponentEnum} from "../component/component.enum";
import {ComponentAbstract} from "../component/component.abstract";

export class KeyboardControl extends ComponentAbstract<KeyboardControlInterface> {

    constructor() {
        super(
            ComponentEnum.KEYBOARD_CONTROL,
            {
                [ComponentEnum.KEYBOARD_CONTROL]: {
                    enabled: true
                }
            }
        );
    }

}
