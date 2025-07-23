import { Board } from "../model/Board";
import type { Card, Position } from "../types/gameTypes";

type CardCellProps = {
    cell: Card,
    row: number,
    col: number,
    isContextMenuVisible: boolean,
    contextMenuPosition: Position,
    handleCardClick: (index: number) => void,
    handleContextMenu: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void
}

function CardCell({
        cell,
        row,
        col,
        isContextMenuVisible,
        contextMenuPosition,
        handleCardClick,
        handleContextMenu
    }: CardCellProps) {
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