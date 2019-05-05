/* tslint:disable-next-line:no-reference */
/// <reference path="../node_modules/phaser3-docs/typescript/phaser.d.ts"/>

import 'phaser';
import {ConnectFourScene} from './connect-four.scene';

const config: GameConfig = {
    width: 460,
    height: 420,
    type: Phaser.WEBGL, // CANVAS | WEBGL
    backgroundColor: '#fff',
    parent: 'game',
    scene: [
        ConnectFourScene,
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

export class Game extends Phaser.Game {
    constructor(conf: GameConfig) {
        super(conf);
    }
}

window.onload = () => {
    const game = new Game(config);
};
