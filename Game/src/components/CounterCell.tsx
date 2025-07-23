import React from "react";
import { Board } from "../model/Board";

type CounterCellProps = {
    row: number,
    col: number,
    bomb_value: number,
    count_value: number
}

function CounterCell({ row, col, bomb_value, count_value }: CounterCellProps) {
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

    return (<div className={`playgrid-element ${getCounterCardBackgroundColor(row, col)}`}>{`${bomb_value}, ${count_value}`}</div>);
}

export default React.memo(CounterCell);