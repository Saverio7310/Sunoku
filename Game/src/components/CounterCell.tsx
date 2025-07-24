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

    return (
        <div className={`playgrid-element ${getCounterCardBackgroundColor(row, col)}`}>
            {row === Board.BOARD_ROWS && col === Board.BOARD_COLS ?
                <div className='playgrid-element-empty'>X</div>
                :
                <>
                    <div className='counter-bomb-value counter'>
                        <span className='key-text'>Bombs</span>
                        <span className='value-text'>{bomb_value}</span>
                    </div>
                    <hr className="counter-hr"/>
                    <div className='counter-count-value counter'>
                        <span className='key-text'>Sum</span>
                        <span className='value-text'>{count_value}</span>
                    </div>
                </>
            }
        </div>
    );
}

export default React.memo(CounterCell);