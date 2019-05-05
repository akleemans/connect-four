import * as Long from 'long';
import {Book} from './book';

export class ConnectFourSimulation {
    private static INT_MOD: number = 126;
    private book: number[] = Book.book;
    private bookIndex: number = 0;

    private readOperations: number = 0;
    private bookInCalled: number = 0;
    private datasetCalled: number = 0;
    private hashCalled: number = 0;

    private buf5: number;
    private nrle: number;
    private history: number[][] = [[-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 4, 2, 1, 0, -1, 1, 3, 5, 7, 5, 3, 1,
        -1, 2, 5, 8, 10, 8, 5, 2, -1, 2, 5, 8, 10, 8, 5, 2, -1, 1, 3, 5, 7, 5, 3, 1, -1, 0, 1, 2, 4, 2, 1, 0],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 4, 2, 1, 0, -1, 1, 3, 5, 7, 5, 3, 1, -1, 2, 5, 8, 10, 8, 5, 2,
            -1, 2, 5, 8, 10, 8, 5, 2, -1, 1, 3, 5, 7, 5, 3, 1, -1, 0, 1, 2, 4, 2, 1, 0]];
    private ht: number[];
    private he: number[];
    private stride: number;
    private htindex: number;
    private lock: number;
    private posed: number;
    private colthr: number[];
    private moves: number[];
    private plycnt: number;
    private rows: number[];
    private dias: number[];
    private columns: number[];
    private height: number[];

    public constructor() {
        this.nrle = 0;
        this.stride = 0;
        this.htindex = 0;
        this.lock = 0;
        this.posed = 0;
        this.plycnt = 0;

        this.colthr = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(128);
        for (let i: number = 8; i < 128; i += 8) {
            this.colthr[i] = 1;
            this.colthr[i + 7] = 2;
        }
        this.buf5 = 1;
        this.ht = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(1050011);
        this.he = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(1050011);
        this.moves = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(44);
        this.rows = [0, 0, 0, 0, 0, 0, 0, 0];
        this.dias = (s => {
            const a = [];
            while (s-- > 0) {
                a.push(0);
            }
            return a;
        })(19);
        this.columns = [0, 0, 0, 0, 0, 0, 0, 0];
        this.height = [0, 0, 0, 0, 0, 0, 0, 0];
        this.reset();
        this.dataset();
    }

    public makeMove(i: number) {
        this.moves[++this.plycnt] = i;
        const l: number = this.plycnt & 1;
        const k: number = this.height[i]++;
        this.columns[i] = (this.columns[i] << 1) + l;
        const j: number = 1 << 2 * i + l;
        this.rows[k] |= j;
        this.dias[5 + i + k] |= j;
        this.dias[(5 + i) - k] |= j;
    }

    public getBestMove(): number {
        const ai: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        const ai1: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        const ai2: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        let i3: number;
        const l2: number = (i3 = this.plycnt & 1) ^ 1;
        let k: number;
        let j3: number;
        let k3: number;
        let l3: number;
        for (let i: number = j3 = k3 = l3 = 0; ++i <= 7;) {
            if ((k = this.height[i]) <= 6) {
                if (this.wins(i, k, 1 << l2) || this.colthr[this.columns[i]] === 1 << l2) {
                    return i;
                }
                if (this.wins(i, k, 1 << i3) || this.colthr[this.columns[i]] !== 0) {
                    ai1[k3++] = i;
                } else if (k + 1 <= 6 && this.wins(i, k + 1, 1 << i3)) {
                    ai2[l3++] = i;
                } else {
                    ai[j3++] = i;
                }
            }
        }
        if (k3 > 0) {
            return ai1[this.getRandomInt(k3)];
        }
        if (j3 === 0) {
            if (l3 === 0) {
                return 0;
            } else {
                return ai2[this.getRandomInt(l3)];
            }
        }
        let l: number;
        if ((l = this.transpose()) !== -128 && l >> 5 === -2) {
            return ai[this.getRandomInt(j3)];
        }
        const l4: number = this.posed;
        let j1: number;
        let i2: number = j1 = 0;
        let j: number = 0;
        for (let i1: number = -2; j < j3 && i1 < 2; j++) {
            let k1: number = j;
            let k2: number = -128;
            for (; k1 < j3; k1++) {
                const l1: number = ai[k1];
                const j2: number = this.history[l2][this.height[l1] << 3 | l1];
                if (j2 > k2) {
                    k2 = j2;
                    i2 = k1;
                }
            }
            k1 = ai[i2];
            ai[i2] = ai[j];
            ai[j] = k1;
            this.makeMove(k1);
            k2 = -this.ab(-2, 2);
            this.backmove();
            if (k2 >= i1) {
                if (k2 > i1) {
                    i1 = k2;
                    j1 = 0;
                }
                ai[j] = ai[j1];
                ai[j1++] = k1;
            }
        }
        if (this.posed - l4 >= 1048576) {
            this.emptyTT();
        }
        return ai[this.getRandomInt(j1)];
    }

    private readBookstream(): number {
        this.readOperations++;
        return this.book[this.bookIndex++];
    }

    private reset() {
        this.plycnt = 0;
        for (let i: number = 0; i < 19; i++) {
            this.dias[i] = 0;
        }
        for (let j: number = 0; j < 8; j++) {
            this.columns[j] = 1;
            this.height[j] = 1;
            this.rows[j] = 0;
        }
    }

    private wins(i: number, j: number, k: number): boolean {
        k <<= 2 * i;
        let l: number = this.rows[j] | k;
        let i1: number = l & l << 2;
        if ((i1 & i1 << 4) !== 0) {
            return true;
        }
        l = this.dias[5 + i + j] | k;
        i1 = l & l << 2;
        if ((i1 & i1 << 4) !== 0) {
            return true;
        }
        l = this.dias[(5 + i) - j] | k;
        i1 = l & l << 2;
        return (i1 & i1 << 4) !== 0;
    }

    private backmove() {
        const l: number = this.plycnt & 1;
        const k: number = this.moves[this.plycnt--];
        const j: number = --this.height[k];
        this.columns[k] >>= 1;
        const i: number = ~(1 << 2 * k + l);
        this.rows[j] &= i;
        this.dias[5 + k + j] &= i;
        this.dias[(5 + k) - j] &= i;
    }

    private emptyTT() {
        for (let i: number = 0; i < 1050011; i++) {
            let byte0: number;
            let j: number;
            if ((j = (byte0 = this.he[i]) & 31) < 31) {
                this.he[i] = (byte0 - (j >= 16 ? 4 : j)) | 0;
            }
        }
        this.posed = 0;
    }

    private hash() {
        this.hashCalled++;
        const i: number = (this.columns[1] << 7 | this.columns[2]) << 7 | this.columns[3];
        const j: number = (this.columns[7] << 7 | this.columns[6]) << 7 | this.columns[5];

        let l: Long;
        if (i <= j) {
            l = new Long(j << 7);
            l = l.or(this.columns[4]);
            l = l.shiftLeft(21);
            l = l.or(i);
        } else {
            l = new Long(i << 7);
            l = l.or(this.columns[4]);
            l = l.shiftLeft(21);
            l = l.or(j);
        }

        this.lock = l.shiftRight(17).or(0).toNumber();
        this.htindex = l.modulo(1050011).or(0).toNumber();

        this.stride = 131072 + this.lock % 179;
        if (this.lock < 0 && (this.stride += ConnectFourSimulation.INT_MOD) < 131072) {
            this.stride += 179;
        }
    }

    private transpose(): number {
        this.hash();
        let i: number = this.htindex;
        for (let j: number = 0; j < 8; j++) {
            if (this.ht[i] === this.lock) {
                return this.he[i];
            }
            if ((i += this.stride) >= 1050011) {
                i -= 1050011;
            }
        }
        return -128;
    }

    private transrestore(i: number, j: number) {
        if (j > 31) {
            j = 31;
        }
        this.posed++;
        this.hash();
        let l: number = this.htindex;
        for (let k: number = 0; k < 8; k++) {
            if (this.ht[l] === this.lock) {
                this.he[l] = (i << 5 | j) | 0;
                return;
            }
            if ((l += this.stride) >= 1050011) {
                l -= 1050011;
            }
        }
        this.transput(i, j);
    }

    private transtore(i: number, j: number) {
        if (j > 31) {
            j = 31;
        }
        this.posed++;
        this.hash();
        this.transput(i, j);
    }

    private transput(i: number, j: number) {
        let k: number = this.htindex;
        for (let l: number = 0; l < 8; l++) {
            if (j > (this.he[k] & 31)) {
                this.ht[k] = this.lock;
                this.he[k] = (i << 5 | j) | 0;
                return;
            }
            if ((k += this.stride) >= 1050011) {
                k -= 1050011;
            }
        }
    }

    private bookin(): number {
        this.bookInCalled++;
        if (this.buf5 === 1) {
            if (this.nrle !== 0) {
                this.buf5 = 242;
                this.nrle--;
            } else {
                this.buf5 = this.readBookstream();
                if (this.buf5 > 242) {
                    this.nrle = this.buf5 - 242;
                    this.buf5 = 242;
                }
            }
            this.buf5 += 243;
        }
        const i: number = 2 * (this.buf5 % 3) - 2;
        this.buf5 = (n => n < 0 ? Math.ceil(n) : Math.floor(n))(this.buf5 / 3);
        return i;
    }

    private dataset(): number {
        this.datasetCalled++;
        const i2: number = this.transpose();
        if (i2 !== -128) {
            return i2 >> 5;
        }
        let l2: number;
        const k2: number = (l2 = this.plycnt & 1) ^ 1;
        if (this.plycnt >= 8) {
            let k1: number;
            let j2: number = k1 = 0;
            let l: number;
            while ((++k1 <= 7)) {
                if ((l = this.height[k1]) <= 6) {
                    if (this.wins(k1, l, 1 << k2) || this.colthr[this.columns[k1]] === 1 << k2) {
                        return 2;
                    }
                    if (this.wins(k1, l, 1 << l2) || this.colthr[this.columns[k1]] !== 0) {
                        j2 = j2 << 3 | k1;
                    }
                }
            }

            if (j2 > 7) {
                return -2;
            }
            if (j2 === 0) {
                let i: number = this.bookin();
                if (k2 === 0) {
                    i = -i;
                }
                this.transtore(i, 31);
                return i;
            } else {
                this.makeMove(j2);
                const j: number = -this.dataset();
                this.backmove();
                return j;
            }
        }
        let j1: number = -2147483648;
        let i3: number = 8;
        for (let l1: number = 4; (l1 = i3 - l1) !== 0;) {
            let i1: number;
            if ((i1 = this.height[l1]) <= 6) {
                if (this.wins(l1, i1, 1 << k2) || this.colthr[this.columns[l1]] === 1 << k2) {
                    j1 = 2;
                } else {
                    this.makeMove(l1);
                    let k: number;
                    if ((k = -this.dataset()) > j1) {
                        j1 = k;
                    }
                    this.backmove();
                }
            }
            i3 = 15 - i3;
        }
        this.transtore(j1, 1);
        return j1;
    }

    private ab(i: number, j: number): number {
        const ai: number[] = [0, 0, 0, 0, 0, 0, 0, 0];
        if (this.plycnt === 41) {
            return 0;
        }
        let i5: number;
        const k4: number = (i5 = this.plycnt & 1) ^ 1;
        let j4: number;
        let l: number = j4 = 0;
        while ((++l <= 7)) {
            let l1: number;
            if ((l1 = this.height[l]) > 6) {
                continue;
            }
            if (this.wins(l, l1, 3) || this.colthr[this.columns[l]] !== 0) {
                if (l1 + 1 <= 6 && this.wins(l, l1 + 1, 1 << i5)) {
                    return -2;
                }
                ai[0] = l;
                while ((++l <= 7)) {
                    if ((l1 = this.height[l]) <= 6 && (this.wins(l, l1, 3) ||
                        this.colthr[this.columns[l]] !== 0)) {
                        return -2;
                    }
                }
                j4 = 1;
                break;
            }
            if (l1 + 1 > 6 || !this.wins(l, l1 + 1, 1 << i5)) {
                ai[j4++] = l;
            }
        }
        if (j4 === 0) {
            return -2;
        }
        if (j4 === 1) {
            this.makeMove(ai[0]);
            const l2: number = -this.ab(-j, -i);
            this.backmove();
            return l2;
        }
        let k3: number;
        if ((k3 = this.transpose()) !== -128) {
            const i3: number = k3 >> 5;
            if (i3 === -1) {
                if ((j = 0) <= i) {
                    return i3;
                }
            } else if (i3 === 1) {
                if ((i = 0) >= j) {
                    return i3;
                }
            } else {
                return i3;
            }
        }
        let l4: number = this.posed;
        let k: number;
        let j2: number = k = 0;
        let j3: number = -2147483648;
        for (let i1: number = 0; i1 < j4; i1++) {
            let k1: number = i1;
            let k2: number = -2147483648;
            for (; k1 < j4; k1++) {
                const i2: number = ai[k1];
                const l3: number = this.history[k4][this.height[i2] << 3 | i2];
                if (l3 > k2) {
                    k2 = l3;
                    j2 = k1;
                }
            }
            k1 = ai[j2];
            if (i1 !== j2) {
                ai[j2] = ai[i1];
                ai[i1] = k1;
            }
            this.makeMove(k1);
            k2 = -this.ab(-j, -i);
            this.backmove();
            if (k2 <= j3) {
                continue;
            }
            k = i1;
            if ((j3 = k2) <= i || (i = k2) < j) {
                continue;
            }
            if (j3 === 0 && i1 < j4 - 1) {
                j3 = 1;
            }
            break;
        }
        if (k > 0) {
            for (let j1: number = 0; j1 < k; j1++) {
                this.history[k4][this.height[ai[j1]] << 3 | ai[j1]]--;
            }
            this.history[k4][this.height[ai[k]] << 3 | ai[k]] += k;
        }
        l4 = this.posed - l4;
        let i4: number;
        /* tslint:disable-next-line:no-empty */
        for (i4 = 1; (l4 >>= 1) !== 0; i4++) {
        }
        if (k3 !== -128) {
            if (j3 === -(k3 >> 5)) {
                j3 = 0;
            }
            this.transrestore(j3, i4);
        } else {
            this.transtore(j3, i4);
        }
        return j3;
    }

    private getRandomInt = (max: number): number => Math.ceil(Math.random() * (max - 1));
}
