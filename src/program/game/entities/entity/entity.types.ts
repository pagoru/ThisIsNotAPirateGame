import {Player} from "../player/player";
import {BadGuy} from "../badGuy/badGuy";
import {GameMap} from "../gameMap/gameMap";

export type EntityTypes =
    | Player
    | BadGuy
    | GameMap
