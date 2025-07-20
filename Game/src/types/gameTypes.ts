export type Theme = 'dark' | 'light';

export type ThemeContextType = {
  theme: Theme;
  switchTheme: () => void;
};

export type GameState = 'idle' | 'starting' | 'playing' | 'level-advancing' | 'game-over';

export type Card = {
    type: 'card',
    value: number,
    isPlayed: boolean,
    areCandidatesVisible: boolean[]
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

/**
 * The values number array contains the occurrences of each number. The number is the same as the index.
 * The number 1 has no meaning, so its occurences are -1
 */
export type LevelData = {
    difficulty: Difficulty,
    values: number[],
}

export type RecordScore = {
    value: number,
    date: string
}

export type Position = {
    x: number,
    y: number,
    row: number,
    column: number
}