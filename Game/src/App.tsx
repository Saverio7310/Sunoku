import { useContext, useEffect, useReducer, useRef, useState } from 'react';

import type { LevelData, Cell, GameState, Message, RecordScore, ThemeContextType, CandidatesContextMenuContextType } from './types/gameTypes';

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
import boardReducer from './model/boardReducer';
import { CandidatesContextMenuContext } from './components/CandidatesContextMenuContext';

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

    const contextMenuRef = useRef<HTMLDivElement>(null);
    const levelTracker = useRef<number>(0);

    const { theme } = useContext<ThemeContextType>(ThemeContext);
    const { isContextMenuVisible, setContextMenuVisibility } = useContext<CandidatesContextMenuContextType>(CandidatesContextMenuContext);

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
            if (contextMenuRef && !contextMenuRef.current?.contains(event.target as Node)) {
                setContextMenuVisibility(false);
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
                        ref={contextMenuRef}
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
                    flipCardOnTheBoard={flipCardOnTheBoard}
                    revealBoard={revealBoard}
                    board={board}
                    gameState={gameState}
                    levelTracker={levelTracker}
                    levelInfo={levelInfo}
                    levelScore={levelScore}
                    gameScore={gameScore}
                    recordScore={recordScore}
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
