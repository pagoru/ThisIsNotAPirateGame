import {TexturesEnum} from "../../../../canvas/textures/textures.enum";

export type TextureNodesType = {
    readonly nodeArray: number[][];
    readonly textureName: (data?: any) => TexturesEnum;
}