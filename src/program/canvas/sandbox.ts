import {Events} from "../events/events";
import {EventEnum} from "../events/event/event.enum";
import {Player} from "../game/entities/player/player";
import {Program} from "../program";
import {GameMap} from "../game/entities/gameMap/gameMap";

export class Sandbox {

    static load = () => {
        Events.on(EventEnum.UPDATE, Sandbox.update);

        const player = new Player({ x: 0, y: 0 }, 180);
        const gameMap = new GameMap();

        Program.getInstance().game.entities.addEntity(player, gameMap);
    }

    static update = (delta: number) => {

    }

}
