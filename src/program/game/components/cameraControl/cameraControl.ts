
import {CameraControlInterface} from "./cameraControl.interface";
import {ComponentEnum} from "../component/component.enum";
import {ComponentAbstract} from "../component/component.abstract";

export class CameraControl extends ComponentAbstract<CameraControlInterface> {

    constructor() {
        super(
            ComponentEnum.CAMERA_CONTROL,
            {
                [ComponentEnum.CAMERA_CONTROL]: {
                    follow: true
                }
            }
        );
    }

}
