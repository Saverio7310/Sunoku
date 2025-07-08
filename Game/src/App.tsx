import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css'
import type { Cell } from './types/gameTypes';

function App() {
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
    const [score, setScore] = useState<number>(0);
    const [record, setRecord] = useState<number>(0);

    const rows: number = board.length;
    const cols: number = board[0].length;

    const handleCardClick = (index: number) => {
        const row: number = Math.floor(index / cols)
        const col: number = index % cols
        console.log(board[row][col]);
    }

    return (
        <div className='homepage'>
            <div className='gameboard'>
                <div className='playgrid'>
                    {board.map((row: Cell[], i: number) =>
                        row.map((el: Cell, j: number) => {
                            switch (el.type) {
                                case 'card':
                                    return (<div key={j + i * cols} className='playgrid-element clickable' onClick={() => handleCardClick(j + i * cols)}>{j + i * cols}</div>);
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
                    <div>
                        <h1>Current score: {score}</h1>
                    </div>
                    <div>
                        <h2>Record high: {record}</h2>
                    </div>
                    <div className='game-description'>
                        <p>Your goal is to find all 3's and 2's hidden in the grid.</p>
                    </div>
                    <div>
                        <button>Start</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
