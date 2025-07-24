import type { Card, Cell, GameState, LevelData, Message } from "../types/gameTypes";

import { Board } from "../model/Board";
import { saveRecordScore } from "../utils/localStorage";
import CounterCell from "./CounterCell";
import CardCell from "./CardCell";

type GameboardProps = {
    setLevelScore: React.Dispatch<React.SetStateAction<number>>,
    setGameScore: React.Dispatch<React.SetStateAction<number>>,
    setRecordScore: React.Dispatch<React.SetStateAction<number>>,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setMessage: React.Dispatch<React.SetStateAction<Message>>,
    setLevelInfo: React.Dispatch<React.SetStateAction<LevelData>>,
    flipCardOnTheBoard: (rowIndex: number, colIndex: number) => void,
    revealBoard: () => void,
    board: Cell[][],
    gameState: GameState,
    levelTracker: React.RefObject<number>,
    levelInfo: LevelData,
    levelScore: number,
    gameScore: number,
    recordScore: number,
}

function Gameboard({
    setLevelScore,
    setGameScore,
    setRecordScore,
    setGameState,
    setMessage,
    setLevelInfo,
    flipCardOnTheBoard,
    revealBoard,
    board,
    gameState,
    levelTracker,
    levelInfo,
    levelScore,
    gameScore,
    recordScore,
}: GameboardProps) {
    const cols: number = Board.BOARD_COLS;

    const getRowColumnAndCellAtIndex = (index: number): [row: number, col: number, cell: Cell] => {
        const row: number = Math.floor(index / cols);
        const col: number = index % cols;
        return [row, col, board[row][col]];
    }

    const isCardValid = (cell: Cell): boolean => {
        if (cell.type !== 'card') return false;
        if (cell.type === 'card' && cell.isPlayed === true) {
            setMessage({ type: 'warning', text: 'Card already pressed!' });
            return false;
        }
        return true;
    }

    const handleLoss = (): void => {
        setMessage({ type: 'error', text: 'You lost!' });
        setLevelScore(0);

        if (levelScore === 0) levelTracker.current = 0;
        else levelTracker.current = Math.max(0, levelTracker.current - 1)

        setGameState('game-over');
        revealBoard();
    }

    const handleCorrectCardFlipped = (card: Card, row: number, col: number): LevelData => {
        setMessage({ type: 'log', text: `You found a ${card.value}` });
        setLevelScore(previous => {
            if (previous === 0) return card.value;
            return previous * card.value;
        });

        const newLevelinfo: LevelData = updateLevelData(card.value);
        setLevelInfo(newLevelinfo);

        flipCardOnTheBoard(row, col);

        return newLevelinfo;
    }

    const handleLevelCompletion = (newLevelinfo: LevelData, card: Card): void => {
        if (newLevelinfo.values[2] === 0 && newLevelinfo.values[3] === 0) {
            setMessage({ type: 'success', text: 'You found every 2 and 3, YOU WON! Click Start for the next level' });
            setGameState('level-advancing');
            setTimeout(() => {
                revealBoard();
                const totalLevelScore: number = gameScore + (levelScore * card.value);
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
     * Handle the click of a Card
     * @param index
     * @returns 
     */
    const handleCardClick = (index: number): void => {
        if (gameState !== 'playing') {
            return setMessage({ type: 'warning', text: 'Start the game before or wait till the level is loaded!' });
        }

        const [row, col, cell] = getRowColumnAndCellAtIndex(index);

        if (!isCardValid(cell)) return;

        const card: Card = cell as Card;

        if (card.value === 0) {
            return handleLoss();
        }

        const newLevelinfo: LevelData = handleCorrectCardFlipped(card, row, col);

        handleLevelCompletion(newLevelinfo, card);
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
                newLevelinfo.values[2] -= 1
                break;
            case 3:
                newLevelinfo.values[3] -= 1
                break;
            default:
                console.warn('Unrecognised value')
                break;
        }
        return newLevelinfo;
    }

    return (
        <div className='gameboard'>
            <div className='playgrid'>
                {board.map((row: Cell[], i: number) =>
                    row.map((cell: Cell, j: number) => {
                        switch (cell.type) {
                            case 'card':
                                return (
                                    <CardCell
                                        key={j + i * cols}
                                        cell={cell}
                                        row={i}
                                        col={j}
                                        handleCardClick={handleCardClick}
                                    />);
                            case 'counter':
                                return (<CounterCell
                                    key={j + i * cols}
                                    row={i}
                                    col={j}
                                    bomb_value={cell.bomb_value}
                                    count_value={cell.count_value}
                                />);
                        }
                    })
                )}
            </div>
        </div>
    );
}

export default Gameboard;