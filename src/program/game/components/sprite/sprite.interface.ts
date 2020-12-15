import {ComponentEnum} from "../component/component.enum";
import {TexturesEnum} from "../../../canvas/textures.enum";

export interface SpriteInterface {
    [ComponentEnum.SPRITE]: {
        visible: true;
        texture?: TexturesEnum;
    }
}
