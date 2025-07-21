import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import { type LevelData, type Cell, type GameState, type Message, type RecordScore, type Position, type ThemeContextType, type Card } from './types/gameTypes';

import Header from './components/Header';
import Gameboard from './components/Gameboard';
import Menu from './components/Menu';

import CandidatesContextMenu from './components/CandidatesContextMenu';
import { ThemeContext } from './components/ThemeContext';

import './styles/App.css'
import './styles/board.css'
import './styles/menu.css'

import { retrieveRecordScore } from './utils/localStorage';
import { Board } from './model/Board';

type BoardAction =
    | { type: 'CREATE_BOARD', board: Cell[][] }
    | { type: 'PLAY_CARD', rowIndex: number, colIndex: number }
    | { type: 'SHOW_CANDIDATE', rowIndex: number, colIndex: number, candidateIndex: number }
    | { type: 'REVEAL_BOARD' };

const boardReducer = (board: Cell[][], action: BoardAction): Cell[][] => {
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

const getInitialBoard = (): Cell[][] => {
    return new Board().generateEmptyBoard();
}

function App() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [board, dispatch] = useReducer(boardReducer, null, getInitialBoard);
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


    const createBoard = (board: Cell[][]): void => {
        dispatch({
            type: 'CREATE_BOARD',
            board: board
        });
    }

    const flipCardOnTheBoard = (rowIndex: number, colIndex: number): void => {
        dispatch({
            type: 'PLAY_CARD',
            rowIndex: rowIndex,
            colIndex: colIndex
        });
    }

    /**
     * Show the Candidate (0, 1, 2, 3) for the Card at the specified `rowIndex` and `colIndex`
     * @param board 
     * @param rowIndex 
     * @param colIndex 
     * @param candidateIndex [0 - 3]
     * @returns 
     */
    const showCandidateOnTheBoard = (rowIndex: number, colIndex: number, candidateIndex: number): void => {
        dispatch({
            type: 'SHOW_CANDIDATE',
            candidateIndex: candidateIndex,
            colIndex: colIndex,
            rowIndex: rowIndex
        });
    }

    const revealBoard = (): void => {
        dispatch({
            type: 'REVEAL_BOARD'
        });
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
                        showCandidateOnTheBoard={showCandidateOnTheBoard}
                        board={board}
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
                    flipCardOnTheBoard={flipCardOnTheBoard}
                    revealBoard={revealBoard}
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
                    createBoard={createBoard}
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
