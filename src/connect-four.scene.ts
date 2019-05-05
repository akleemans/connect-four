import {ConnectFourSimulation} from './connect-four-simulation';
import {Disc} from './disc';

export enum Player {
    human = 'X',
    computer = 'O',
}

export class ConnectFourScene extends Phaser.Scene {
    private cols = 7;
    private rows = 6;
    private board: Disc[][] = [];
    private empty = null;
    private finished = false;
    private statusText: Phaser.GameObjects.Text;
    private spinner: Phaser.GameObjects.Sprite;

    private nextPlayer: Player;
    private winner: Player;
    private c4: ConnectFourSimulation;

    private offsetX = 55;
    private offsetY = 390;
    private spacingX = 58;
    private spacingY = 56;

    public constructor() {
        super({
            key: 'MainScene',
        });
    }

    public preload(): void {
        // const assetPath = 'https://www.kleemans.ch/static/island-sokoban/assets/';
        const assetPath = 'assets/';
        this.load.image('bg', assetPath + 'img/bg.png');
        this.load.image('X', assetPath + 'img/blue.png');
        this.load.image('O', assetPath + 'img/red.png');
        this.load.image('arrow', assetPath + 'img/arrow.png');
        this.load.image('spinner', assetPath + 'img/spinner.png');
    }

    public create(): void {
        // background, arrows
        this.add.image(0, this.offsetY - 320, 'bg').setOrigin(0, 0).setScale(0.4, 0.4);

        for (let i = 0; i < 7; i++) {
            this.add.sprite(this.offsetX + i * this.spacingX, this.offsetY - 345, 'arrow')
                .setOrigin(0.5, 0.5).setScale(0.1).setInteractive().on('pointerdown', () => {
                if (!this.finished) {
                    this.makePlayerMove(i);
                }
            });
        }
        this.statusText = this.add.text(230, 10, 'Initializing...', {font: '22px'}).setOrigin(0.5, 0.5).setTint(0x0);
        this.spinner = this.add.sprite(320, 10, 'spinner').setScale(0.2, 0.2).setVisible(false);

        // init starting player
        this.nextPlayer = (Math.random() > 0.5 ? Player.human : Player.computer);

        // init board
        for (let i = 0; i < this.rows; i++) {
            const row = [];
            for (let j = 0; j < this.cols; j++) {
                row.push(this.empty);
            }
            this.board.push(row);
        }

        // init simulation
        this.c4 = new ConnectFourSimulation();
        if (this.nextPlayer === Player.computer) {
            this.makeComputerMove();
        } else {
            this.updateStatus('Your turn!');
        }
    }

    public update(time: number, delta: number): void {
        if (this.spinner.visible) {
            const angle = this.spinner.angle;
            this.spinner.setAngle(angle + 5);
        }
    }

    private makePlayerMove(move: number): void {
        if (this.nextPlayer !== Player.human) {
            return;
        }

        const row = this.makeMove(move, Player.human);
        if (row !== -1) {
            this.nextPlayer = Player.computer;
            this.checkWinner(row, move);
            if (!this.finished) {
                this.updateStatus('Thinking...');
                this.spinner.setVisible(true);
                setTimeout(() => this.makeComputerMove(), 500);
            }
        }
    }

    private makeComputerMove(): void {
        const t1 = new Date();
        const move = this.c4.getBestMove() - 1;
        const t2 = new Date();
        /* tslint:disable-next-line:no-console */
        console.log('Found computer move:', move, 'in', Math.abs(t2.getTime() - t1.getTime()), 'ms');
        const row = this.makeMove(move, Player.computer);

        // finished
        this.spinner.setVisible(false);
        this.nextPlayer = Player.human;
        this.updateStatus('Your turn!');
        this.checkWinner(row, move);
    }

    private updateStatus(text: string): void {
        /* tslint:disable-next-line:no-console */
        console.log('updating status:', text);
        this.statusText.setText(text);
    }

    private checkWinner(row, col): void {
        this.winner = this.getWinner(row, col);

        if (this.winner !== null) {
            if (this.winner === Player.human) {
                this.updateStatus('Game finished, you won!');
            } else {
                this.updateStatus('Game finished, I won!');
            }
            this.finished = true;
        } else {
            if (this.isBoardFull()) {
                this.updateStatus('Game finished, nobody won.');
                this.finished = true;
            }
        }
    }

    private makeMove(col: number, player: Player): number {
        // make move on c4 board
        this.c4.makeMove(col + 1);

        // make move on own board
        for (let row = 0; row < this.rows; row++) {
            // check uppermost free row in column
            if (this.board[row][col] === this.empty) {
                const x = this.offsetX + col * this.spacingX;
                const y = this.offsetY - row * this.spacingY;
                this.board[row][col] = new Disc(this, row, col, x, y, player);
                return row;
            }
        }

        return -1;
    }

    private getWinner(row: number, col: number): Player | null {
        const human = 'XXXX';
        const comp = 'OOOO';
        let str = '';

        // check row
        for (let i = 0; i < 7; i++) {
            str += this.getBoardString(row, i);
        }
        if (str.indexOf(human) !== -1) {
            return Player.human;
        } else if (str.indexOf(comp) !== -1) {
            return Player.computer;
        }

        // check col
        str = '';
        for (let i = 0; i < 6; i++) {
            str += this.getBoardString(i, col);
        }
        if (str.indexOf(human) !== -1) {
            return Player.human;
        } else if (str.indexOf(comp) !== -1) {
            return Player.computer;
        }

        // diagonal 1
        str = '';
        let startCol = col;
        let startRow = row;

        for (let i = 0; i < 6; i++) {
            startCol--;
            startRow--;
            if (startCol < 0 || startRow < 0) {
                startCol++;
                startRow++;
                break;
            }
        }

        for (let i = 0; i < 6; i++) {
            if (startCol + i >= 0 && startCol + i < 7 && startRow + i >= 0 && startRow + i < 6) {
                str += this.getBoardString(startRow + i, startCol + i);
            }
        }
        if (str.indexOf(human) !== -1) {
            return Player.human;
        } else if (str.indexOf(comp) !== -1) {
            return Player.computer;
        }

        // diagonal 2
        str = '';
        startCol = col;
        startRow = row;

        for (let i = 0; i < 6; i++) {
            startCol--;
            startRow++;
            if (startCol < 0 || startRow > 5) {
                startCol++;
                startRow--;
                break;
            }
        }

        for (let i = 0; i < 6; i++) {
            if (startCol + i >= 0 && startCol + i < 7 && startRow - i >= 0 && startRow - i < 6) {
                str += this.getBoardString(startRow - i, startCol + i);
            }
        }
        if (str.indexOf(human) !== -1) {
            return Player.human;
        } else if (str.indexOf(comp) !== -1) {
            return Player.computer;
        }

        return null;
    }

    private getBoardString(row: number, col: number): string {
        const s = this.board[row][col];
        if (s !== null) {
            return s.getPlayer();
        } else {
            return '.';
        }
    }

    private isBoardFull(): boolean {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === this.empty) {
                    return false;
                }
            }
        }
        return true;
    }
}
