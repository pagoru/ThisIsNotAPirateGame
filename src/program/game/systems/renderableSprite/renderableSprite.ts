import * as PIXI from 'pixi.js';
import {SystemAbstract} from "../system/system.abstract";
import {ComponentEnum} from "../../components/component/component.enum";
import {PositionInterface} from "../../components/position/position.interface";
import {EntityAbstract} from "../../entities/entity/entity.abstract";
import {Program} from "../../../program";
import {SpriteInterface} from "../../components/sprite/sprite.interface";
import {RotationInterface} from "../../components/rotation/rotation.interface";
import {PivotInterface} from "../../components/pivot/pivot.interface";

export class RenderableSprite extends SystemAbstract {

    constructor() {
        super([
            ComponentEnum.POSITION,
            ComponentEnum.SPRITE
        ]);
    }

    initEntity(entity: EntityAbstract) {
        const {
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.PIVOT]: pivot,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.SPRITE]: sprite,
        } = entity.getData<PositionInterface & RotationInterface & SpriteInterface & PivotInterface>();

        if(!sprite.visible) return;

        const texture = Program.getInstance().canvas.textures.get(sprite.texture);
        const spriteEntity = new PIXI.Sprite(texture);
        spriteEntity.name = entity.id;
        spriteEntity.position.set(position.x, position.y);
        spriteEntity.pivot.set(texture.orig.width / 2, texture.orig.height / 2);
        spriteEntity.interactive = true;

        if(rotation) spriteEntity.angle = rotation.angle;
        if(pivot){
            spriteEntity.pivot.x += pivot.x;
            spriteEntity.pivot.y += pivot.y;
        }

        Program.getInstance().canvas.stage.addChild(spriteEntity);
    }

    updateEntity(delta: number, entity: EntityAbstract) {
        const {
            [ComponentEnum.POSITION]: position,
            [ComponentEnum.ROTATION]: rotation,
            [ComponentEnum.SPRITE]: sprite
        } = entity.getData<PositionInterface & RotationInterface & SpriteInterface>();
        const canvas = Program.getInstance().canvas;

        const spriteEntity = canvas.stage.getChildByName(entity.id);

        if(!spriteEntity) return;

        spriteEntity.position.copyFrom(position);
        if(rotation) spriteEntity.angle = rotation.angle - 90;

        if(sprite.visible) return;

        canvas.stage.removeChild(spriteEntity);
    }

    protected onDataEntityUpdate(
        entity,
        componentEnums ,
        oldEntityData,
        newEntityData
    ) {

    }

}
