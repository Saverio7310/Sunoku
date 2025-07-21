import type { Card, Cell, Position } from "../types/gameTypes";
import '../styles/contextMenu.css'

type CandidatesContextMenuProps = {
    ref: React.RefObject<HTMLDivElement | null>,
    setIsContextMenuVisible: React.Dispatch<React.SetStateAction<boolean>>,
    position: Position,
    showCandidateOnTheBoard: (rowIndex: number, colIndex: number, candidateIndex: number) => void,
    board: Cell[][],
}

function CandidatesContextMenu({
        ref,
        setIsContextMenuVisible, 
        position, 
        showCandidateOnTheBoard, 
        board,
    }: CandidatesContextMenuProps) {

    const candidates: number[] = [0,1,2,3];
    const candidatesToggled = (board[position.row][position.column] as Card).areCandidatesVisible;

    const handleCandidateClick = (candidate: number): void => {
        showCandidateOnTheBoard(position.row, position.column, candidate);
    }
    
    const closeContextMenu = () => {
        setIsContextMenuVisible(false);
    }
    
    return (
        <div
            ref={ref}
            style={{top: position.y, left: position.x}}
            className="context-menu-container"
        >
            <div>
                <p className="context-menu-title">Candidates</p>
            </div>
            <ul className="context-menu">
                {candidates.map(candidate => 
                    <li 
                        key={candidate} 
                        className={`context-menu-candidate ${candidatesToggled[candidate] ? 'toggled' : ''}`}
                        onClick={() => handleCandidateClick(candidate)}
                    >
                        {candidate}
                    </li>
                )}
                <li
                    key={'x'}
                    className="context-menu-close-button"
                    onClick={closeContextMenu}
                >
                    X
                </li>
            </ul>
        </div>
    );
}

export default CandidatesContextMenu;