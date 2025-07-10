import type { Cell, LevelData } from "../types/gameTypes";

export class Board {
    static BOARD_ROWS: number = 5;
    static BOARD_COLS: number = 5;
    static BOARD_SIZE: number = 25;
    static levelsData: LevelData[] = [
        { difficulty: 'easy', ZERO: 6, THREE: 0, TWO: 5 },
        { difficulty: 'easy', ZERO: 7, THREE: 2, TWO: 3 },
        { difficulty: 'medium', ZERO: 8, THREE: 3, TWO: 2 },
        { difficulty: 'medium', ZERO: 8, THREE: 3, TWO: 3 },
        { difficulty: 'hard', ZERO: 10, THREE: 5, TWO: 1 },
        { difficulty: 'hard', ZERO: 10, THREE: 6, TWO: 2 },
    ];

    constructor() {   
    }

    createFlatInitialNumericList(currentLevelData: LevelData): number[] {
        const elements: number[] = [];
        for (let i = 0; i < Board.BOARD_SIZE; i++) {
            if (currentLevelData.ZERO > 0) {
                elements[i] = 0;
                currentLevelData.ZERO--;
            } else if (currentLevelData.TWO > 0) {
                elements[i] = 2;
                currentLevelData.TWO--;
            } else if (currentLevelData.THREE > 0) {
                elements[i] = 3;
                currentLevelData.THREE--;
            } else {
                elements[i] = 1;
            }
        }
        return elements;
    }

    shuffleNumericList(list: number[]): void {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]]; // Swap
        }
    }

    createCellMatrixFromNumericList(list: number[]): Cell[][] {
        const matrix: Cell[][] = [];
        let i: number;
        let j: number;

        for (i = 0; i <= Board.BOARD_ROWS; i++) {
            matrix.push([]);

            if (i === Board.BOARD_ROWS) break;

            let zeroInCurrentRow: number = 0
            let nonZeroInCurrentRow: number = 0

            for (j = 0; j <= Board.BOARD_COLS; j++) {
                const currentValue = list[j + i * Board.BOARD_COLS];

                if (currentValue === 0) zeroInCurrentRow++;
                else nonZeroInCurrentRow++;

                let cell: Cell;

                if (j === Board.BOARD_COLS) {
                    cell = {
                        type: "counter",
                        bomb_value: zeroInCurrentRow,
                        count_value: nonZeroInCurrentRow
                    };
                    
                } else {
                    cell = {
                        type: "card",
                        value: currentValue,
                        isPlayed: false
                    };
                }

                matrix[i].push(cell);
            }
        }

        for (i = 0; i < Board.BOARD_COLS; i++) {
            let zeroInCurrentCol: number = 0
            let nonZeroInCurrentCol: number = 0
            for (j = 0; j <= Board.BOARD_ROWS; j++) {
                if (j === Board.BOARD_ROWS) {
                    const counter: Cell = {
                        type: "counter",
                        bomb_value: zeroInCurrentCol,
                        count_value: nonZeroInCurrentCol,
                    }

                    matrix[j].push(counter);
                } else {
                    const cell: Cell = matrix[j][i];
                    if (cell.type === 'card' && cell.value === 0) zeroInCurrentCol++;
                    else if (cell.type === 'card' && cell.value !== 0) nonZeroInCurrentCol++;
                }
            }
        }

        matrix[Board.BOARD_ROWS ][Board.BOARD_COLS ] = {
            type: 'counter',
            bomb_value: 0,
            count_value: 0
        }

        return matrix;
    }

    generateBoard(level: number): Cell[][] {
        level = Math.min(level, Board.levelsData.length - 1)
        const currentLevelData: LevelData = { ...Board.levelsData[level] };

        const elements: number[] = this.createFlatInitialNumericList(currentLevelData);

        this.shuffleNumericList(elements);

        const matrix: Cell[][] = this.createCellMatrixFromNumericList(elements);
        return matrix;
    }
}