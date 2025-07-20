import { useContext, useEffect, useRef, useState } from 'react';

import { type LevelData, type Cell, type GameState, type Message, type RecordScore, type Position, type ThemeContextType } from './types/gameTypes';

import Header from './components/Header';
import Gameboard from './components/Gameboard';
import Menu from './components/Menu';

import CandidatesContextMenu from './components/CandidatesContextMenu';
import { ThemeContext } from './components/ThemeContext';

import './styles/App.css'
import './styles/board.css'
import './styles/menu.css'

import { retrieveRecordScore } from './utils/localStorage';

function App() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [board, setBoard] = useState<Cell[][]>([
        [
            { type: 'card', value: 0, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 2, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 3, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 2, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 0, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 0, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 0, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 3, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 2, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 0, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'counter', bomb_value: 9, count_value: 9 }
        ],
        [
            { type: 'card', value: 3, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
            { type: 'card', value: 1, isPlayed: false, areCandidatesVisible: [false, false, false, false] },
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
    const [levelInfo, setLevelInfo] = useState<LevelData>({ difficulty: 'easy', values: [] });
    const [levelScore, setLevelScore] = useState<number>(0);
    const [gameScore, setGameScore] = useState<number>(0);
    const [recordScore, setRecordScore] = useState<number>(0);
    const [message, setMessage] = useState<Message>({ type: 'warning', text: 'Press Start!' });
    const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<Position>({ x: 0, y: 0, row: 0, column: 0 });

    const contectMenuRef = useRef<HTMLDivElement>(null);
    const levelTracker = useRef<number>(0);

    const { theme } = useContext<ThemeContextType>(ThemeContext);

    /**
     * Check if this is correct []
     */
    useEffect(() => {
        console.log('Effect starting');
        const record: RecordScore = retrieveRecordScore();
        if (record.date === '' || record.value > 0) setRecordScore(record.value);
    }, []);

    /**
     * Closes the context menu if you click away from it
     */
    useEffect(() => {
        const handleMouseClick = (event: MouseEvent): void => {
            if (contectMenuRef && !contectMenuRef.current?.contains(event.target as Node)) {
                setIsContextMenuVisible(false);
            }
        }

        document.addEventListener('mousedown', handleMouseClick);
        return () => {
            document.removeEventListener('mousedown', handleMouseClick);
        }
    }, []);

    useEffect(() => {
        document.body.className = theme
    }, [theme]);

    console.log('Rendering App!', theme);

    /**
     * Show the Candidate (0, 1, 2, 3) for the Card at the specified `rowIndex` and `colIndex`
     * @param board 
     * @param rowIndex 
     * @param colIndex 
     * @param candidateIndex [0 - 3]
     * @returns 
     */
    const updateBoardToShowCandidate = (board: Cell[][], rowIndex: number, colIndex: number, candidateIndex: number): Cell[][] => {
        const newBoard: Cell[][] = Array(board.length).fill(null).map(() => []);
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[0].length; j++) {
                const cell: Cell = board[i][j];
                if (cell.type === 'card' && cell.isPlayed === false && i === rowIndex && j === colIndex) {
                    cell.areCandidatesVisible.forEach((visibility, index) => {
                        if (index === candidateIndex) cell.areCandidatesVisible[index] = !visibility;
                    });
                }
                newBoard[i][j] = cell;
            }
        }
        return newBoard;
    }

    return (
        <>
            <Header />
            <div className='homepage'>
                {
                    (isContextMenuVisible && gameState === 'playing') &&
                    <CandidatesContextMenu
                        ref={contectMenuRef}
                        setIsContextMenuVisible={setIsContextMenuVisible}
                        position={contextMenuPosition}
                        updateBoardToShowCandidate={updateBoardToShowCandidate}
                        board={board}
                        setBoard={setBoard}
                    />
                }
                <Gameboard 
                    setLevelScore={setLevelScore}
                    setGameScore={setGameScore}
                    setRecordScore={setRecordScore}
                    setGameState={setGameState}
                    setMessage={setMessage}
                    setLevelInfo={setLevelInfo}
                    setIsContextMenuVisible={setIsContextMenuVisible}
                    setContextMenuPosition={setContextMenuPosition}
                    setBoard={setBoard}
                    board={board}
                    gameState={gameState}
                    levelTracker={levelTracker}
                    levelInfo={levelInfo}
                    levelScore={levelScore}
                    gameScore={gameScore}
                    recordScore={recordScore}
                    isContextMenuVisible={isContextMenuVisible}
                    contextMenuPosition={contextMenuPosition}
                />
                <Menu 
                    setLevelScore={setLevelScore}
                    setGameState={setGameState}
                    setMessage={setMessage}
                    setLevelInfo={setLevelInfo}
                    setBoard={setBoard}
                    gameState={gameState}
                    levelTracker={levelTracker}
                    levelScore={levelScore}
                    gameScore={gameScore}
                    recordScore={recordScore}
                    message={message}
                />
            </div>
        </>
    );
}

export default App;
