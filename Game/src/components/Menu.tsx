import { useState } from "react";

import type { Cell, GameState, LevelData, Message } from "../types/gameTypes";

import { Board } from "../model/Board";

type MenuProps = {
    setLevelScore: React.Dispatch<React.SetStateAction<number>>,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    setMessage: React.Dispatch<React.SetStateAction<Message>>,
    setLevelInfo: React.Dispatch<React.SetStateAction<LevelData>>,
    createBoard: (board: Cell[][]) => void,
    gameState: GameState,
    levelTracker: React.RefObject<number>,
    levelScore: number,
    gameScore: number,
    recordScore: number,
    message: Message
}

function Menu({
        setLevelScore,
        setGameState,
        setMessage,
        setLevelInfo,
        createBoard,
        gameState,
        levelTracker,
        levelScore,
        gameScore,
        recordScore,
        message
    }: MenuProps) {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [level, setLevel] = useState<number>(0);

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
    const handleStartGame = (): void => {
        console.log('Starting with level:', levelTracker);
        setLevel(levelTracker.current);
        setLevelScore(0);
        setGameState('starting');
        setMessage({ type: 'log', text: 'Starting Game!' });

        console.log('Matrix creation');
        const boardShuffler = new Board();
        const [levelData, matrix] = boardShuffler.generateBoard(levelTracker.current);
        setTimeout(() => {
            setLevelInfo(levelData);
            createBoard(matrix);
            setGameState('playing');
            setMessage({ type: 'log', text: 'Game has started. Choose your first cell!' });
        }, 600);
    }

    return (
        <div className='menu'>
            <div className='playmenu'>
                <div className='current-score'>
                    <h1 className='current-score-title'>Current score: {gameScore}</h1>
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
                            <h3 className='current-level-title'>Level: {level + 1}</h3>
                            <h3 className='current-level-score-title'>Level score: {levelScore}</h3>
                            <h3 className={message.type}>{message.text}</h3>
                        </div>
                        <div className={`tab-pane ${activeTabIndex === 1 ? 'active' : ''}`}>
                            <p className='game-description'>
                                • Your goal is to find all 3's and 2's hidden in the grid.
                                <hr className='game-description-hr'/>
                                • The last column and last row show how many 0's are present in each corresponding column/row, and what the total value of the numbers is.
                                <hr className='game-description-hr'/>
                                • If you find them all, you will win the level and proceed to the next one.
                                <hr className='game-description-hr'/>
                                • You can right-click on any card to add a candidate value.
                                <hr className='game-description-hr'/>
                                • Finding any 0 will make you lose the game right away.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='button-container'>
                    <button
                        className={gameState === 'playing' ? 'not-allowed' : ''}
                        disabled={gameState === 'playing' ? true : false}
                        onClick={handleStartGame}
                    >
                        Start
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Menu;