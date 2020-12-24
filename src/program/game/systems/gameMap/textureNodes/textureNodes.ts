import {getRandomNumber} from "../../../../utils/number.utils";
import {TexturesEnum} from "../../../../canvas/textures/textures.enum";
import {TextureNodesType} from "./textureNodes.type";

export const TEXTURE_NODES: TextureNodesType[] = [
    // Inside Tile
    {
        nodeArray: [
            [0, 1, 2, 3, 4, 5, 6, 7],
        ],
        textureName: (data: any) => `tile_2_${getRandomNumber(1, 4, data.tileSeed)}` as TexturesEnum
    },
    // Inside Tile 4A
    {
        nodeArray: [
            [1, 2, 3, 5, 6, 7],
        ],
        textureName: (data: any) => TexturesEnum.TILE_4_A
    },
    // Inside Tile 4B
    {
        nodeArray: [
            [0, 1, 3, 4, 5, 7],
        ],
        textureName: (data: any) => TexturesEnum.TILE_4_B
    },
    // Inside Corner Bottom Right
    {
        nodeArray: [
            [0, 1, 2, 3, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_3_A
    },
    // Inside Corner Bottom Left
    {
        nodeArray: [
            [0, 1, 2, 3, 4, 5, 7],
        ],
        textureName: () => TexturesEnum.TILE_3_B
    },
    // Inside Corner Top Right
    {
        nodeArray: [
            [1, 2, 3, 4, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_3_D
    },
    // Inside Corner Top Left
    {
        nodeArray: [
            [0, 1, 3, 4, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_3_C
    },
    // Bottom Right
    {
        nodeArray: [
            [0, 1, 2, 6, 7],
            [0, 1, 7],
            [0, 1, 2, 7],
            [0, 1, 6, 7],
            [0, 1, 5, 7],
            [0, 1, 3, 5, 7],
            [0, 1, 3, 7],
            [0, 1, 2, 5, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_E
    },
    // Bottom Left
    {
        nodeArray: [
            [1, 2, 3],
            [0, 1, 2, 3, 4],
            [1, 2, 3, 7],
            [1, 2, 3, 5],
            [0, 1, 2, 3],
            [1, 2, 3, 5, 7],
            [1, 2, 3, 4],
        ],
        textureName: () => TexturesEnum.TILE_1_G
    },
    // Top Right
    {
        nodeArray: [
            [3, 4, 5],
            [3, 4, 5, 6],
            [2, 3, 4, 5],
            [1, 3, 4, 5,],
            [2, 3, 4, 5, 6],
            [3, 4, 5, 7],
            [1, 3, 4, 5, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_A
    },
    // Top Left
    {
        nodeArray: [
            [0, 4, 5, 6, 7],
            [4, 5, 6, 7],
            [1, 3, 5, 6, 7],
            [0, 5, 6, 7],
            [3, 5, 6, 7],
            [5, 6, 7],
            [1, 5, 6, 7],
            [2, 3, 4, 5, 7],
            [1, 2, 3, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_C
    },
    // Bottom
    {
        nodeArray: [
            [0, 1, 2, 3, 4, 6, 7],
            [0, 1, 2, 3, 4, 7],
            [0, 1, 2, 3, 6, 7],
            [0, 1, 2, 3, 5, 7],
            [0, 1, 2, 3, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_F
    },
    // Left
    {
        nodeArray: [
            [0, 1, 2, 3, 4, 5, 6],
            [1, 2, 3, 4, 5, 6],
            [0, 1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5, 7],
            [1, 2, 3, 4, 5],
        ],
        textureName: () => TexturesEnum.TILE_1_H
    },
    // Right
    {
        nodeArray: [
            [0, 1, 2, 4, 5, 6, 7],
            [0, 1, 4, 5, 6, 7],
            [0, 1, 2, 5, 6, 7],
            [0, 1, 3, 5, 6, 7],
            [0, 1, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_D
    },
    // Top
    {
        nodeArray: [
            [0, 2, 3, 4, 5, 6, 7],
            [2, 3, 4, 5, 6, 7],
            [0, 3, 4, 5, 6, 7],
            [1, 3, 4, 5, 6, 7],
            [3, 4, 5, 6, 7],
        ],
        textureName: () => TexturesEnum.TILE_1_B
    },
];

/*
001122
77  33
665544

[N, NE, E, SE, S, SO, O, NO]

[0, 1, 2, 3, 4, 5, 6, 7],
 */