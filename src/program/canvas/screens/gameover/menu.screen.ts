import {ScreenAbstract} from "../screen/screen.abstract";
import {ScreenEnum} from "../screen/screen.enum";
import * as PIXI from "pixi.js";
import {Program} from "../../../program";

export class GameOverScreen extends ScreenAbstract {

    constructor() {
        super(ScreenEnum.GAME_OVER);

        const gameOverText = new PIXI.Text('GAME OVER', new PIXI.TextStyle({
            fontSize: 80,
            fill: '#9bbc0f'
        }));


        this.addChild(gameOverText);
    }

    protected onAdded() {
        super.onAdded();

        setTimeout(() => {
            Program.getInstance().canvas.setScreen(ScreenEnum.MENU);
        }, 5000)
    }

    protected update(delta: number) {
    }

}
