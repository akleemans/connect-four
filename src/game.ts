/* tslint:disable-next-line:no-reference */
/// <reference path="../node_modules/phaser3-docs/typescript/phaser.d.ts"/>

import 'phaser';
import {ConnectFourScene} from './connect-four.scene';

const config: GameConfig = {
    width: 460,
    height: 440,
    type: Phaser.AUTO, // CANVAS | WEBGL
    backgroundColor: '#fff',
    parent: 'game',
    scene: [
        ConnectFourScene,
    ],
};

export class Game extends Phaser.Game {
    constructor(conf: GameConfig) {
        super(conf);
    }
}

window.onload = () => {
    const game = new Game(config);
};
