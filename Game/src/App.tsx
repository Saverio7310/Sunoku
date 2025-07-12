import { useState } from 'react';
import './App.css'
import { type LevelData, type Cell, type GameState, type Message } from './types/gameTypes';
import { Board } from './model/Board';

function App() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [board, setBoard] = useState<Cell[][]>([
        [
            { type: 'card', value: 0, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 2, isPlayed: false },
            { type: 'card', value: 3, isPlayed: false },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 2, isPlayed: false },
            { type: 'card', value: 0, isPlayed: false },
            { type: 'card', value: 0, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 0, isPlayed: false },
            { type: 'card', value: 3, isPlayed: false },
            { type: 'card', value: 2, isPlayed: false },
            { type: 'card', value: 0, isPlayed: false },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 3, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'card', value: 1, isPlayed: false },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'counter', bomb_value: 9, count_value: 9 },
            { type: 'counter', bomb_value: 9, count_value: 9 },
            { type: 'counter', bomb_value: 9, count_value: 9 },
            { type: 'counter', bomb_value: 9, count_value: 9 },
            { type: 'counter', bomb_value: 9, count_value: 9 },
            { type: 'counter', bomb_value: 0, count_value: 0 },
        ]
    ]);
    const [levelInfo, setLevelInfo] = useState<LevelData>({ difficulty: 'easy', ZERO: 0, TWO: 0, THREE: 0 });
    const [levelScore, setLevelScore] = useState<number>(0);
    const [gameScore, setGameScore] = useState<number>(0);
    const [recordScore, setRecordScore] = useState<number>(0);
    const [level, setLevel] = useState<number>(0);
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [message, setMessage] = useState<Message>({ type: 'warning', text: 'Press Start!' });

    console.log('Rendering App!');

    const rows: number = Board.BOARD_ROWS;
    const cols: number = Board.BOARD_COLS;

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
                if (cell.type === 'card' && cell.isPlayed === false && i === rowIndex && j === colIndex) cell.isPlayed = true;
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

    /**
     * Reveal the entire board
     * @returns 
     */
    const revealCompleteBoard = (): Cell[][] => {
        const revealedBoard: Cell[][] = Array(board.length).fill(null).map(() => []);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell: Cell = board[i][j];
                if (cell.type === 'card' && cell.isPlayed === false) cell.isPlayed = true;
                revealedBoard[i][j] = cell;
            }
        }
        return revealedBoard;
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
            setMessage({ type: 'success', text: 'You found every 2 and 3, YOU WON!' })
            setTimeout(() => {
                const newBoard: Cell[][] = revealCompleteBoard();
                setBoard(newBoard);
                setGameScore(previous => previous + (levelScore * el.value));
                setLevelScore(0);
            }, 500);
        }
    }

    /**
     * Changes the currently visible tab of the menu
     * @param index 
     */
    const handleTabClick = (index: number): void => {
        setActiveTabIndex(index)
    }

    /**
     * Make the game start
     * @param level 
     */
    const handleStartGame = (level: number): void => {
        console.log('Starting with level:', level);
        setLevelScore(0);
        setGameState('starting');
        setMessage({ type: 'log', text: 'Starting Game!' });

        console.log('Matrix creation');
        const boardShuffler = new Board();
        const [levelData, matrix] = boardShuffler.generateBoard(level);
        setTimeout(() => {
            setLevelInfo(levelData);
            setBoard(matrix);
            setGameState('playing');
            setMessage({ type: 'log', text: 'Game has started. Choose your first cell!' });
        }, 600);
    }

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
        <div className='homepage'>
            <div className='gameboard'>
                <div className={`playgrid ${checkState(gameState, ['idle', 'starting', 'level-advancing', 'game-over']) ? 'inactive' : ''}`}>
                    {board.map((row: Cell[], i: number) =>
                        row.map((el: Cell, j: number) => {
                            switch (el.type) {
                                case 'card':
                                    return (
                                        <div key={j + i * cols} className={`playgrid-element ${el.isPlayed ? 'clicked' : 'clickable'}`} onClick={() => handleCardClick(j + i * cols)}>
                                            {el.isPlayed ? el.value : '?'}
                                        </div>);
                                case 'counter':
                                    return (<div key={j + i * cols} className={`playgrid-element ${getCounterCardBackgroundColor(i, j)}`}>{`${el.bomb_value}, ${el.count_value}`}</div>);
                                default:
                                    return (<div key={j + i * cols} className='playgrid-element'>{j + i * cols}</div>);
                            }
                        }
                        )
                    )}
                </div>
            </div>
            <div className='menu'>
                <div className='playmenu'>
                    <div className='current-score'>
                        <h1>Current score: {gameScore}</h1>
                    </div>
                    <div className='record-score'>
                        <h2>Record high: {recordScore}</h2>
                    </div>
                    <div className='tab-holder'>
                        <div className='tab-container'>
                            <ul className='tabs'>
                                <li className={`tab ${activeTabIndex === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>Game stats</li>
                                <li className={`tab ${activeTabIndex === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>How to play</li>
                            </ul>
                        </div>
                        <div className='tab-content'>
                            <div className={`tab-pane ${activeTabIndex === 0 ? 'active' : ''}`}>
                                <h3>Level: {level + 1}</h3>
                                <h3>Level score: {levelScore}</h3>
                                <h3 className={message.type}>{message.text}</h3>
                            </div>
                            <div className={`tab-pane ${activeTabIndex === 1 ? 'active' : ''}`}>
                                <p className='game-description'>
                                    • Your goal is to find all 3's and 2's hidden in the grid.<br></br>
                                    • The last column and the last row shows how many 0's there are in the related column/row and the total sum of the numers contained.<br></br>
                                    • If you find them all, you will win the level and proceed to the next one.<br></br>
                                    • Finding any 0 will make you lose the game right away.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='button-container'>
                        <button onClick={() => handleStartGame(level)}>Start</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
