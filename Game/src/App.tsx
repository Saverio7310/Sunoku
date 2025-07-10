import { useState } from 'react';
import './App.css'
import { type Cell, type GameState, type Message } from './types/gameTypes';
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
    const [levelScore, setLevelScore] = useState<number>(0);
    const [gameScore, setGameScore] = useState<number>(0);
    const [recordScore, setRecordScore] = useState<number>(0);
    const [level, setLevel] = useState<number>(0);
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [message, setMessage] = useState<Message>({ type: 'warning', text: 'Press Start!' });

    console.log('Rendering App!');

    const rows: number = board.length;
    const cols: number = board[0].length;

    const updateBoardWithNewCell = (board: Cell[][], rowIndex: number, colIndex: number): Cell[][] => {
        const newBoard: Cell[][] = [];
        board.forEach((row: Cell[], index: number) => {
            if (index === rowIndex) {
                const newRow: Cell[] = [];
                row.forEach((cell: Cell, index: number) => {
                    if (index === colIndex && cell.type === 'card') {
                        const newCell: Cell = {
                            type: cell.type,
                            value: cell.value,
                            isPlayed: true
                        };
                        newRow.push(newCell);
                    } else {
                        newRow.push(cell);
                    }
                });
                newBoard[index] = newRow;
            } else {
                newBoard[index] = row;
            }
        });
        return newBoard;
    }

    const handleCardClick = (index: number): void => {
        if (gameState !== 'playing') {
            setMessage({ type: 'warning', text: 'Start the game before or wait till the level is loaded!' });
            return;
        }
        const row: number = Math.floor(index / cols);
        const col: number = index % cols;
        const el: Cell = board[row][col];
        if (el.type === 'card' && !el.isPlayed) {
            console.log(el);
            if (el.value === 0) {
                setMessage({ type: 'error', text: 'You lost!' });
                setLevelScore(0)
                setGameState('game-over')
            } else {
                setMessage({ type: 'log', text: `You found a ${el.value}` })
                setLevelScore(previous => {
                    if (previous === 0) return el.value;
                    return previous * el.value;
                })
            }
            const newBoard: Cell[][] = updateBoardWithNewCell(board, row, col);
            setBoard(newBoard);
        } else {
            setMessage({ type: 'warning', text: 'Card already pressed!' });
        }
    }

    const handleTabClick = (index: number): void => {
        setActiveTabIndex(index)
    }

    const handleStartGame = (level: number): void => {
        console.log('Starting with level:', level);

        setGameState('starting');
        setMessage({ type: 'log', text: 'Starting Game!' });

        console.log('Matrix creation');
        const boardShuffler = new Board();
        const matrix = boardShuffler.generateBoard(level);
        setBoard(matrix);
        setGameState('playing');
        setMessage({ type: 'log', text: 'Game has started. Choose your first cell!' });
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
     * For the animation: <div className={`gameboard ${gameState === 'idle' ? 'hidden' : ''} ${gameState === 'starting' ? 'entering' : ''} ${gameState === 'level-advancing' ? 'exiting' : ''}`}>
     */
    
    return (
        <div className='homepage'>
            <div className='gameboard'>
                <div className={`playgrid ${checkState(gameState, ['idle', 'starting', 'level-advancing', 'game-over']) ? 'inactive' : ''}`}>
                    {board.map((row: Cell[], i: number) =>
                        row.map((el: Cell, j: number) => {
                            switch (el.type) {
                                case 'card':
                                    return (
                                        <div key={j + i * cols} className={`playgrid-element ${el.isPlayed ? '' : 'clickable'}`} onClick={() => handleCardClick(j + i * cols)}>
                                            {el.isPlayed ? el.value : '?'}
                                        </div>);
                                case 'counter':
                                    return (<div key={j + i * cols} className='playgrid-element'>{`${el.bomb_value}, ${el.count_value}`}</div>);
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
