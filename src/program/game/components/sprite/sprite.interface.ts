import {ComponentEnum} from "../component/component.enum";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";

export interface SpriteInterface {
    [ComponentEnum.SPRITE]: {
        visible: true;
        texture?: TexturesEnum;
    }
}
