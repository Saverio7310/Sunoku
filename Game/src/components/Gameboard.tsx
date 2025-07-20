import type { Cell, GameState, LevelData, Message, Position } from "../types/gameTypes";

import { Board } from "../model/Board";
import { saveRecordScore } from "../utils/localStorage";

type GameboardProps = {
    setLevelScore: React.Dispatch<React.SetStateAction<number>>,
    setGameScore: React.Dispatch<React.SetStateAction<number>>,
    setRecordScore: React.Dispatch<React.SetStateAction<number>>,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setMessage: React.Dispatch<React.SetStateAction<Message>>,
    setLevelInfo: React.Dispatch<React.SetStateAction<LevelData>>,
    setIsContextMenuVisible: React.Dispatch<React.SetStateAction<boolean>>,
    setContextMenuPosition: React.Dispatch<React.SetStateAction<Position>>,
    setBoard: React.Dispatch<React.SetStateAction<Cell[][]>>,
    board: Cell[][],
    gameState: GameState,
    levelTracker: React.RefObject<number>,
    levelInfo: LevelData,
    levelScore: number,
    gameScore: number,
    recordScore: number,
    isContextMenuVisible: boolean,
    contextMenuPosition: Position

}

function Gameboard({
        setLevelScore,
        setGameScore,
        setRecordScore,
        setGameState,
        setMessage,
        setLevelInfo,
        setIsContextMenuVisible,
        setContextMenuPosition,
        setBoard,
        board,
        gameState,
        levelTracker,
        levelInfo,
        levelScore,
        gameScore,
        recordScore,
        isContextMenuVisible,
        contextMenuPosition
    }: GameboardProps) {
    const cols: number = Board.BOARD_COLS;

    /**
     * Chesk if `actualGameState` is equal to one of the specified states inside `allowedStates`
     * @param actualGameState Current state of the game
     * @param allowedStates Possible states you want the `actualGameState` to be in
     * @returns 
     */
    const checkState = (actualGameState: GameState, allowedStates: GameState[]): boolean => {
        let check = false;
        allowedStates.forEach((state) => {
            if (actualGameState === state) check = true;
        });
        return check;
    }

    /**
     * Handle the click of a Card
     * @param index
     * @returns 
     */
    const handleCardClick = (index: number): void => {
        if (gameState !== 'playing') {
            setMessage({ type: 'warning', text: 'Start the game before or wait till the level is loaded!' });
            return;
        }

        const row: number = Math.floor(index / cols);
        const col: number = index % cols;
        const el: Cell = board[row][col];

        if (el.type !== 'card') return;
        if (el.type === 'card' && el.isPlayed === true) {
            setMessage({ type: 'warning', text: 'Card already pressed!' });
            return;
        }

        if (el.value === 0) {
            setMessage({ type: 'error', text: 'You lost!' });
            setLevelScore(0);
            //setGameScore(0)?

            if (levelScore === 0) levelTracker.current = 0;
            else levelTracker.current = Math.max(0, levelTracker.current - 1)

            setGameState('game-over');
            const newBoard: Cell[][] = revealCompleteBoard();
            setBoard(newBoard);
            return;
        }

        setMessage({ type: 'log', text: `You found a ${el.value}` })
        setLevelScore(previous => {
            if (previous === 0) return el.value;
            return previous * el.value;
        })
        const newLevelinfo: LevelData = updateLevelData(el.value);
        setLevelInfo(newLevelinfo);

        const newBoard: Cell[][] = updateBoardWithFlippedCell(board, row, col);
        setBoard(newBoard);

        if (newLevelinfo.TWO === 0 && newLevelinfo.THREE === 0) {
            setMessage({ type: 'success', text: 'You found every 2 and 3, YOU WON! Click Start for the next level' });
            setGameState('level-advancing');
            setTimeout(() => {
                const newBoard: Cell[][] = revealCompleteBoard();
                setBoard(newBoard);
                const totalLevelScore: number = gameScore + (levelScore * el.value);
                setGameScore(totalLevelScore);
                setLevelScore(0);

                if (totalLevelScore > recordScore) {
                    setRecordScore(totalLevelScore);
                    saveRecordScore(totalLevelScore);
                }

                levelTracker.current += 1;
            }, 500);
        }
    }

    /**
     * Reveal the entire board
     * @returns 
     */
    const revealCompleteBoard = (): Cell[][] => {
        const revealedBoard: Cell[][] = Array(board.length).fill(null).map(() => []);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell: Cell = board[i][j];
                if (cell.type === 'card' && cell.isPlayed === false) {
                    cell.isPlayed = true;
                    cell.areCandidatesVisible = Array(4).fill(null).map(() => false);
                }
                revealedBoard[i][j] = cell;
            }
        }
        return revealedBoard;
    }

    /**
     * Flip the Card at the specified `rowIndex` and `colIndex` by setting its `isPlayed` property to true
     * @param board 
     * @param rowIndex 
     * @param colIndex 
     * @returns 
     */
    const updateBoardWithFlippedCell = (board: Cell[][], rowIndex: number, colIndex: number): Cell[][] => {
        const newBoard: Cell[][] = Array(board.length).fill(null).map(() => []);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell: Cell = board[i][j];
                if (cell.type === 'card' && cell.isPlayed === false && i === rowIndex && j === colIndex) {
                    cell.isPlayed = true;
                    cell.areCandidatesVisible = Array(4).fill(null).map(() => false);
                }
                newBoard[i][j] = cell;
            }
        }
        return newBoard;
    }

    /**
     * Update current LevelData with the just cilicked Cell's value
     * @param valueSelected 
     * @returns 
     */
    const updateLevelData = (valueSelected: number): LevelData => {
        const newLevelinfo: LevelData = { ...levelInfo };
        switch (valueSelected) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                newLevelinfo.TWO -= 1
                break;
            case 3:
                newLevelinfo.THREE -= 1
                break;
            default:
                console.warn('Unrecognised value')
                break;
        }
        return newLevelinfo;
    }

    const handleContextMenu = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
        e.preventDefault();
        setIsContextMenuVisible(true);
        const target = e.currentTarget.getBoundingClientRect();
        console.log(target);
        const position: Position = {
            x: target.left + (target.width * 1.1),
            y: target.top + (target.height * 0.7),
            row: rowIndex,
            column: colIndex
        };
        console.log('Right click', position);
        setContextMenuPosition(position)
    };

    /**
     * Return the correct css class name for the Counter at the specified `row` and `col`
     * @param row 
     * @param col 
     * @returns 
     */
    const getCounterCardBackgroundColor = (row: number, col: number): string => {
        let value: number = 0;
        if (col === Board.BOARD_COLS) value = row;
        else value = col;
        switch (value) {
            case 0:
                return 'red'
            case 1:
                return 'green'
            case 2:
                return 'yellow'
            case 3:
                return 'blue'
            case 4:
                return 'purple'
            default:
                return '';
        }
    }

    return (
        <div className='gameboard'>
            <div className={`playgrid ${checkState(gameState, ['idle', 'starting', 'level-advancing', 'game-over']) ? 'inactive' : ''}`}>
                {board.map((row: Cell[], i: number) =>
                    row.map((el: Cell, j: number) => {
                        switch (el.type) {
                            case 'card':
                                return (
                                    <div
                                        key={j + i * cols}
                                        className={`playgrid-element ${el.isPlayed ? 'clicked' : 'clickable'} ${isContextMenuVisible && contextMenuPosition.row === i && contextMenuPosition.column === j ? 'right-clicked' : ''}`}
                                        onClick={() => handleCardClick(j + i * cols)}
                                        onContextMenu={(e) => handleContextMenu(e, i, j)}
                                    >
                                        {el.isPlayed ? el.value : '?'}
                                        {el.areCandidatesVisible[0] && <div className='candidates-container top-left'>0</div>}
                                        {el.areCandidatesVisible[1] && <div className='candidates-container top-right'>1</div>}
                                        {el.areCandidatesVisible[2] && <div className='candidates-container bottom-left'>2</div>}
                                        {el.areCandidatesVisible[3] && <div className='candidates-container bottom-right'>3</div>}

                                    </div>);
                            case 'counter':
                                return (<div key={j + i * cols} className={`playgrid-element ${getCounterCardBackgroundColor(i, j)}`}>{`${el.bomb_value}, ${el.count_value}`}</div>);
                            default:
                                return (<div key={j + i * cols} className='playgrid-element'>{j + i * cols}</div>);
                        }
                    })
                )}
            </div>
        </div>
    );
}

export default Gameboard;