import {ConnectFourSimulation} from './connect-four-simulation';
import {Disc} from './disc';

export enum Player {
    human = 'X',
    computer = 'O',
}

export class ConnectFourScene extends Phaser.Scene {
    public static getRandomInt(): number {
        // TODO higher random number?
        return Math.ceil(Math.random() * 10);
    }

    private cols = 7;
    private rows = 6;
    private board: Disc[][] = [];
    private empty = null;
    private finished = false;

    private nextPlayer: Player;
    private winner: Player;
    private c4: ConnectFourSimulation;

    private offsetX = 55;
    private offsetY = 370;
    private spacingX = 58;
    private spacingY = 56;

    constructor() {
        super({
            key: 'MainScene',
        });
    }

    public preload(): void {
        // https://www.kleemans.ch/static/connect-four/
        const assetPath = 'assets/';
        this.load.image('bg', assetPath + 'img/bg.png');
        this.load.image('X', assetPath + 'img/blue.png');
        this.load.image('O', assetPath + 'img/red.png');
        this.load.image('arrow', assetPath + 'img/arrow.png');
    }

    public create(): void {
        // bg
        this.add.image(0, 50, 'bg').setOrigin(0, 0).setScale(0.4, 0.4);

        for (let i = 0; i < 7; i++) {
            this.add.sprite(this.offsetX + i * this.spacingX, 25, 'arrow').setOrigin(0.5, 0.5).setScale(0.1)
                .setInteractive().on('pointerdown', () => {
                this.makePlayerMove(i);
            });
        }

        // TODO init starting player
        // this.nextPlayer = (Math.random() > 0.5 ? Player.human : Player.computer);
        this.nextPlayer = Player.computer;

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
        }
    }

    private log(...args: any): void {
        /* tslint:disable:no-console */
        console.log(...args);
    }

    private makePlayerMove(move: number): void {
        console.log('Player tries to make move:', move);
        if (this.nextPlayer !== Player.human) {
            console.log('blocked, computer still thinking!');
            return;
        }

        const row = this.makeMove(move, Player.human);
        if (row === -1) {
            console.log('invalid column, seems to be full!');
        } else {
            this.nextPlayer = Player.computer;
            this.checkWinner(row, move);
            if (!this.finished) {
                setTimeout(() => this.makeComputerMove(), 500);
            }
        }
    }

    private makeComputerMove(): void {
        const t1 = new Date();
        const move = this.c4.getBestMove() - 1;
        console.log('getBestMove() returned:', move + 1);
        const t2 = new Date();
        this.log('Found computer move:', move, 'in', Math.abs(t2.getTime() - t1.getTime()), 'ms');
        const row = this.makeMove(move, Player.computer);

        this.nextPlayer = Player.human;
        this.checkWinner(row, move);
    }

    private checkWinner(row, col): void {
        this.winner = this.getWinner(row, col);

        if (this.winner !== null) {
            console.log('Game finished, winner:', this.winner);
            this.finished = true;
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

    private printBoard(): void {
        for (let i = this.rows - 1; i >= 0; i--) {
            let s = '';
            for (let j = 0; j < this.cols; j++) {
                s += this.board[i][j];
            }
            this.log(s);
        }
    }

}
