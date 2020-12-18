import {PositionInterface} from "../position/position.interface";
import {TargetDirectionInterface} from "../targetDirection/targetDirection.interface";
import {ContainerInterface} from "../container/container.interface";
import {SpriteInterface} from "../sprite/sprite.interface";
import {CameraControlInterface} from "../cameraControl/cameraControl.interface";
import {RotationInterface} from "../rotation/rotation.interface";
import {KeyboardControlInterface} from "../keyboardControl/keyboardControl.interface";
import {AccelerationInterface} from "../acceleration/acceleration.interface";
import {PivotInterface} from "../pivot/pivot.interface";

export type ComponentTypes =
    | PositionInterface
    | TargetDirectionInterface
    | ContainerInterface
    | SpriteInterface
    | CameraControlInterface
    | RotationInterface
    | KeyboardControlInterface
    | AccelerationInterface
    | PivotInterface
