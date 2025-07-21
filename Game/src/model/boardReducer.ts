import type { BoardReducerAction, Card, Cell } from "../types/gameTypes";

const boardReducer = (board: Cell[][], action: BoardReducerAction): Cell[][] => {
    switch (action.type) {
        case 'CREATE_BOARD': {
            return action.board;
        }
        case 'PLAY_CARD': {
            return flipCard(board, action.rowIndex, action.colIndex);
        }
        case 'SHOW_CANDIDATE': {
            return showCandidate(board, action.rowIndex, action.colIndex, action.candidateIndex);
        }
        case 'REVEAL_BOARD': {
            return flipCard(board);
        }
        default:
            return board;
    }
}

const flipCard = (board: Cell[][], rowIndex: number | null = null, colIndex: number | null = null): Cell[][] => {
    return board.map((row, i) => {
        return row.map((cell, j) => {
            const isTargetCell = (rowIndex === null && colIndex === null) || (i === rowIndex && j === colIndex);
            if (cell.type === 'card' && cell.isPlayed === false && isTargetCell) {
                let newCell: Card = {
                    ...cell,
                    isPlayed: true,
                    areCandidatesVisible: Array(4).fill(null).map(() => false)
                };
                return newCell;
            } return cell;
        });
    });
}

const showCandidate = (board: Cell[][], rowIndex: number, colIndex: number, candidateIndex: number): Cell[][] => {
    return board.map((row, i) => {
        return row.map((cell, j) => {
            if (cell.type === 'card' && cell.isPlayed === false && i === rowIndex && j === colIndex) {
                const newCell: Card = { ...cell, areCandidatesVisible: [...cell.areCandidatesVisible] };
                newCell.areCandidatesVisible[candidateIndex] = !newCell.areCandidatesVisible[candidateIndex];
                return newCell;
            } else return cell;
        });
    });
}

export default boardReducer;