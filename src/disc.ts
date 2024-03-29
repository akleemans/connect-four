import Sprite = Phaser.GameObjects.Sprite;
import {ConnectFourScene, Player} from './connect-four.scene';

export class Disc extends Sprite {
    private readonly currentScene: ConnectFourScene;
    private readonly row: number;
    private readonly col: number;
    private readonly player: Player;

    public constructor(scene: ConnectFourScene, row: number, col: number, x: number, y: number, player) {
        super(scene, x, y, player);
        this.row = row;
        this.col = col;
        this.player = player;
        this.setOrigin(0.5, 0.5);
        this.setScale(0.4, 0.4);
        this.currentScene = scene;
        this.currentScene.add.existing(this);
    }

    public getPlayer(): Player {
        return this.player;
    }
}
