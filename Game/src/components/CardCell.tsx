import { useContext } from "react";
import { Board } from "../model/Board";
import type { CandidatesContextMenuContextType, Card, Position } from "../types/gameTypes";
import { CandidatesContextMenuContext } from "./CandidatesContextMenuContext";

type CardCellProps = {
    cell: Card,
    row: number,
    col: number,
    handleCardClick: (index: number) => void,
}

function CardCell({
    cell,
    row,
    col,
    handleCardClick,
}: CardCellProps) {
    const { isContextMenuVisible, setContextMenuVisibility, contextMenuPosition, setContextMenuNewPosition } = useContext<CandidatesContextMenuContextType>(CandidatesContextMenuContext);


    const handleContextMenu = (e: React.MouseEvent, rowIndex: number, colIndex: number): void => {
        e.preventDefault();
        setContextMenuVisibility(true);
        const target = e.currentTarget.getBoundingClientRect();
        console.log(target);
        const position: Position = {
            x: target.left + (target.width * 1.1),
            y: target.top + (target.height * 0.7),
            row: rowIndex,
            column: colIndex
        };
        console.log('Right click', position);
        setContextMenuNewPosition(position)
    };

    return (
        <div
            className={`playgrid-element ${cell.isPlayed ? 'clicked' : 'clickable'} ${isContextMenuVisible && contextMenuPosition.row === row && contextMenuPosition.column === col ? 'right-clicked' : ''}`}
            onClick={() => handleCardClick(col + row * Board.BOARD_COLS)}
            onContextMenu={(e) => handleContextMenu(e, row, col)}
        >
            {cell.isPlayed ? cell.value : '?'}
            {cell.areCandidatesVisible[0] && <div className='candidates-container top-left'>0</div>}
            {cell.areCandidatesVisible[1] && <div className='candidates-container top-right'>1</div>}
            {cell.areCandidatesVisible[2] && <div className='candidates-container bottom-left'>2</div>}
            {cell.areCandidatesVisible[3] && <div className='candidates-container bottom-right'>3</div>}

        </div>
    );
}

export default CardCell;