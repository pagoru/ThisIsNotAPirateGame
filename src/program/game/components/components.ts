import {ComponentAbstract} from "./component/component.abstract";
import {ComponentEnum} from "./component/component.enum";
import {Position} from "./position/position";
import {TargetDirection} from "./targetDirection/targetDirection";
import {addComponentDispatchAction} from "../../store/components/dispatchers";
import {Store} from "redux";
import {Actions, DefaultState} from "../../store/store.definitions";
import {ComponentTypes} from "./component/component.types";
import {Container} from "./container/container";
import {Sprite} from "./sprite/sprite";
import {CameraControl} from "./cameraControl/cameraControl";
import {Rotation} from "./rotation/rotation";
import {KeyboardControl} from "./keyboardControl/keyboardControl";
import {Acceleration} from "./acceleration/acceleration";
import {Pivot} from "./pivot/pivot";
import {Life} from "./life/life";
import {GameMap} from "./gameMap/gameMap";

export class Components {

    private readonly components: Map<ComponentEnum, ComponentAbstract<any>>;

    constructor(store: Store<DefaultState, Actions>) {
        this.components = new Map<ComponentEnum, ComponentAbstract<any>>();

        this.addComponent(store, ComponentEnum.POSITION, new Position());
        this.addComponent(store, ComponentEnum.TARGET_DIRECTION, new TargetDirection());
        this.addComponent(store, ComponentEnum.CONTAINER, new Container());
        this.addComponent(store, ComponentEnum.SPRITE, new Sprite());
        this.addComponent(store, ComponentEnum.CAMERA_CONTROL, new CameraControl());
        this.addComponent(store, ComponentEnum.ROTATION, new Rotation());
        this.addComponent(store, ComponentEnum.KEYBOARD_CONTROL, new KeyboardControl());
        this.addComponent(store, ComponentEnum.ACCELERATION, new Acceleration());
        this.addComponent(store, ComponentEnum.PIVOT, new Pivot());
        this.addComponent(store, ComponentEnum.LIFE, new Life());
        this.addComponent(store, ComponentEnum.GAME_MAP, new GameMap());
    }

    get list() {
        return this.components;
    }

    get<TComponentType extends ComponentTypes>(
        componentEnum: ComponentEnum
    ): ComponentAbstract<TComponentType> {
        return this.list.get(componentEnum);
    }

    private addComponent<TComponentType extends ComponentTypes>(
        store: Store<DefaultState, Actions>,
        componentEnum: ComponentEnum,
        component: ComponentAbstract<TComponentType>
    ) {
        store.dispatch(addComponentDispatchAction(componentEnum));
        this.components.set(componentEnum, component);
    }


}
