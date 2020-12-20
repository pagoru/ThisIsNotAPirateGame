import {Events} from "../events/events";
import {EventEnum} from "../events/event/event.enum";
import {Player} from "../game/entities/player/player";
import {Program} from "../program";
import {BadGuy} from "../game/entities/badGuy/badGuy";
import {GameMap} from "../game/entities/gameMap/gameMap";

export class Sandbox {

    static load = () => {
        Events.on(EventEnum.UPDATE, Sandbox.update);

        const player = new Player({ x: 0, y: 0 }, 180);
        const badGuy = new BadGuy({ x: 0, y: 0 });
        const gameMap = new GameMap();

        Program.getInstance().game.entities.addEntity(player, badGuy, gameMap);
    }

    static update = (delta: number) => {

    }

}
