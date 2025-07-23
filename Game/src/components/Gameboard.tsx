import type { Cell, GameState, LevelData, Message } from "../types/gameTypes";

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

            if (levelScore === 0) levelTracker.current = 0;
            else levelTracker.current = Math.max(0, levelTracker.current - 1)

            setGameState('game-over');
            revealBoard();
            return;
        }

        setMessage({ type: 'log', text: `You found a ${el.value}` })
        setLevelScore(previous => {
            if (previous === 0) return el.value;
            return previous * el.value;
        })
        const newLevelinfo: LevelData = updateLevelData(el.value);
        setLevelInfo(newLevelinfo);

        flipCardOnTheBoard(row, col);

        if (newLevelinfo.values[2] === 0 && newLevelinfo.values[3] === 0) {
            setMessage({ type: 'success', text: 'You found every 2 and 3, YOU WON! Click Start for the next level' });
            setGameState('level-advancing');
            setTimeout(() => {
                revealBoard();
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
            <div className={`playgrid ${checkState(gameState, ['idle', 'starting', 'level-advancing', 'game-over']) ? 'inactive' : ''}`}>
                {board.map((row: Cell[], i: number) =>
                    row.map((el: Cell, j: number) => {
                        switch (el.type) {
                            case 'card':
                                return (
                                    <CardCell
                                        key={j + i * cols}
                                        cell={el}
                                        row={i}
                                        col={j}
                                        handleCardClick={handleCardClick}
                                    />);
                            case 'counter':
                                return (<CounterCell 
                                            key={j + i * cols}
                                            row={i}
                                            col={j}
                                            bomb_value={el.bomb_value}
                                            count_value={el.count_value}
                                        />);
                        }
                    })
                )}
            </div>
        </div>
    );
}

export default Gameboard;