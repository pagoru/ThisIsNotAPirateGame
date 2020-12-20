import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {Program} from "../../../program";
import {LifeInterface} from "../../components/life/life.interface";
import {SpriteInterface} from "../../components/sprite/sprite.interface";
import {TexturesEnum} from "../../../canvas/textures/textures.enum";

export class SpriteLife extends SystemAbstract {

    constructor() {
        super([
            ComponentEnum.SPRITE,
            ComponentEnum.LIFE
        ]);
    }

    initEntity(entity: EntityAbstract) {

    }

    updateEntity(delta: number, entity: EntityAbstract) {
        const {
            [ComponentEnum.SPRITE]: sprite,
            [ComponentEnum.LIFE]: life
        } = entity.getData<SpriteInterface & LifeInterface>();

        if(sprite.texture.indexOf('ship') === -1) return;

        const shipType = sprite.texture.split('_')[1];
        const shipLifeId = Math.abs(life.max - life.current);

        const targetTexture = `ship_${shipType}_${shipLifeId}` as TexturesEnum;

        if(sprite.texture === targetTexture) return;

        const { canvas } = Program.getInstance();

        const spriteEntity = canvas.stage.getChildByName(entity.id) as PIXI.Sprite;
        spriteEntity.texture = canvas.textures.get(targetTexture);
        spriteEntity.texture.update();

        entity.updateData<SpriteInterface & LifeInterface>({
            [ComponentEnum.SPRITE]: sprite,
            [ComponentEnum.LIFE]: life
        });
    }

    protected onDataEntityUpdate(
        entity,
        componentEnums ,
        oldEntityData,
        newEntityData
    ) {

    }

}
