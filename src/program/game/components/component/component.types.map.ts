import {ComponentEnum} from "./component.enum";
import {PositionInterface} from "../position/position.interface";
import {TargetDirectionInterface} from "../targetDirection/targetDirection.interface";
import {ContainerInterface} from "../container/container.interface";
import {SpriteInterface} from "../sprite/sprite.interface";
import {CameraControlInterface} from "../cameraControl/cameraControl.interface";
import {RotationInterface} from "../rotation/rotation.interface";
import {KeyboardControlInterface} from "../keyboardControl/keyboardControl.interface";
import {AccelerationInterface} from "../acceleration/acceleration.interface";
import {PivotInterface} from "../pivot/pivot.interface";
import {LifeInterface} from "../life/life.interface";
import {GameMapInterface} from "../gameMap/gameMap.interface";

// TODO: Can we check that all enum items are updated here? Otherwise this gameMap needs to be updated manually
export type ComponentTypeInterfaceMap = {
    [ComponentEnum.CONTAINER]: ContainerInterface,
    [ComponentEnum.SPRITE]: SpriteInterface,
    [ComponentEnum.TARGET_DIRECTION]: TargetDirectionInterface,
    [ComponentEnum.POSITION]: PositionInterface,
    [ComponentEnum.CAMERA_CONTROL]: CameraControlInterface,
    [ComponentEnum.ROTATION]: RotationInterface,
    [ComponentEnum.KEYBOARD_CONTROL]: KeyboardControlInterface,
    [ComponentEnum.ACCELERATION]: AccelerationInterface,
    [ComponentEnum.PIVOT]: PivotInterface,
    [ComponentEnum.LIFE]: LifeInterface,
    [ComponentEnum.GAME_MAP]: GameMapInterface
}

// Overload function declaration => https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type
type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// We declare a Overload for each enum using the InterfaceMap
export type AddComponentInterface =
    UnionToIntersection<ComponentEnum extends infer T
        ? (T extends ComponentEnum
            ? (type: T, data: ComponentTypeInterfaceMap[T]) => void
            : never)
        : never>