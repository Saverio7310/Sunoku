export type GameState = 'idle' | 'starting' | 'playing' | 'level-advancing' | 'game-over';

export type Card = {
    type: 'card',
    value: number,
    isPlayed: boolean
};

export type Counter = {
    type: 'counter',
    bomb_value: number,
    count_value: number
};

export type Cell = Card | Counter;

export type Message = {
    type: 'log' | 'warning' | 'error' | 'success',
    text: string
};

export type Difficulty = 'easy' | 'medium' | 'hard'

export type LevelData = {
    difficulty: Difficulty,
    ZERO: number,
    TWO: number,
    THREE: number,
}

export type RecordScore = {
    value: number,
    date: string
}