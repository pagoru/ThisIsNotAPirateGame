import {SystemAbstract} from "./system/system.abstract";
import {RenderableSprite} from "./renderableSprite/renderableSprite";
import {RenderableContainer} from "./renderableContainer/renderableContainer";
import {Events} from "../../events/events";
import {EventEnum} from "../../events/event/event.enum";
import {Program} from "../../program";
import {ScreenEnum} from "../../canvas/screens/screen/screen.enum";
import {EntityControl} from "./entityControl/entityControl";
import {EntityCamera} from "./entityCamera/entityCamera";

export class Systems {

    private readonly systems: SystemAbstract[];

    constructor() {
        this.systems = [
            new RenderableSprite(),
            new RenderableContainer(),
            new EntityControl(),
            new EntityCamera()
        ];
        Events.on(EventEnum.UPDATE, this.update);
    }

    get list() {
        return this.systems;
    }

    update = (delta: number) => {
        if(Program.getInstance().canvas.getSelectedScreenEnum() !== ScreenEnum.GAME) return;
        this.list.map(system => system.update(delta));
    }

}
