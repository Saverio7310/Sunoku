import type { Cell, LevelData } from "../types/gameTypes";

export class Board {
    static BOARD_ROWS: number = 5;
    static BOARD_COLS: number = 5;
    static BOARD_SIZE: number = 25;
    static levelsData: LevelData[] = [
        { difficulty: 'easy', values: [6, -1, 5, 0] },
        { difficulty: 'easy', values: [7, -1, 3, 2] },
        { difficulty: 'medium', values: [8, -1, 2, 3] },
        { difficulty: 'medium', values: [8, -1, 3, 3] },
        { difficulty: 'hard', values: [10, -1, 1, 5] },
        { difficulty: 'hard', values: [10, -1, 2, 6] },
    ];

    constructor() {
    }

    createFlatInitialNumericList(currentLevelData: LevelData): number[] {
        const elements: number[] = [];
        for (let i = 0; i < Board.BOARD_SIZE; i++) {
            if (currentLevelData.values[0] > 0) {
                elements.push(0);
                currentLevelData.values[0]--;
            } else if (currentLevelData.values[2] > 0) {
                elements.push(2);
                currentLevelData.values[2]--;
            } else if (currentLevelData.values[3] > 0) {
                elements.push(3);
                currentLevelData.values[3]--;
            } else {
                elements.push(1);
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

        /**
         * This is a matrix of array to keep track of every zero and the sum of the value contained for
         * each row and column. The outer array contains two subarrays, the first keeps track of the
         * counters for the rows, the second for the columns. Both contains `Board.BOARD_ROWS` subarrays,
         * each one containing the number of zeros in the first place, and the total sum in the second
         */
        const counterZerosNumbers: number[][][] = Array(2).fill(null).map(() => {
            return Array(Board.BOARD_ROWS).fill(null).map(() => {
                return Array(2).fill(0);
            });
        });

        let cell: Cell;

        for (i = 0; i < Board.BOARD_ROWS; i++) {
            matrix.push([]);
            for (j = 0; j < Board.BOARD_COLS; j++) {
                const listValue: number = list[j + i*Board.BOARD_COLS];
                cell = {
                    type: "card",
                    isPlayed: false,
                    value: listValue,
                    areCandidatesVisible: Array(4).fill(null).map(() => false)
                };
                matrix[i].push(cell);
                if (listValue === 0) {
                    counterZerosNumbers[0][i][0]+=1;
                    counterZerosNumbers[1][j][0]+=1;
                }
                else {
                    counterZerosNumbers[0][i][1]+=listValue;
                    counterZerosNumbers[1][j][1]+=listValue;
                }
            }
        }

        for (i = 0; i < Board.BOARD_ROWS; i++) {
            cell = {
                type: "counter",
                bomb_value: counterZerosNumbers[0][i][0],
                count_value: counterZerosNumbers[0][i][1]
            };
            matrix[i].push(cell);
        }

        counterZerosNumbers[1].push([0,0]);
        
        
        const countersList: Cell[] = counterZerosNumbers[1].map(el => {
            return cell = {
                type: "counter",
                bomb_value: el[0],
                count_value: el[1]
            };
        });
        matrix.push(countersList);

        return matrix;
    }

    generateBoard(level: number): [LevelData, Cell[][]] {
        level = Math.min(level, Board.levelsData.length - 1);
        const currentLevelData: LevelData = { difficulty: Board.levelsData[level].difficulty, values: [ ...Board.levelsData[level].values ] };

        const elements: number[] = this.createFlatInitialNumericList(currentLevelData);
        
        this.shuffleNumericList(elements);
        
        const matrix: Cell[][] = this.createCellMatrixFromNumericList(elements);
        return [{ difficulty: Board.levelsData[level].difficulty, values: [ ...Board.levelsData[level].values ] }, matrix];
    }
}