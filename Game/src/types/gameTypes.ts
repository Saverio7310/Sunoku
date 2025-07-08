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