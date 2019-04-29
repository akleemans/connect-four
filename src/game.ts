/* tslint:disable-next-line:no-reference */
/// <reference path="./phaser.d.ts"/>

import 'phaser';
import {ConnectFourScene} from './connect-four.scene';

// main game configuration
const config: GameConfig = {
    width: 460,
    height: 420,
    type: Phaser.WEBGL, // CANVAS | WEBGL
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

// when the page is loaded, create our game instance
window.onload = () => {
    const game = new Game(config);
};
