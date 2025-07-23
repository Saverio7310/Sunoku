import type { CandidatesContextMenuContextType, Card, Cell } from "../types/gameTypes";
import '../styles/contextMenu.css'
import { useContext } from "react";
import { CandidatesContextMenuContext } from "./CandidatesContextMenuContext";

type CandidatesContextMenuProps = {
    ref: React.RefObject<HTMLDivElement | null>,
    showCandidateOnTheBoard: (rowIndex: number, colIndex: number, candidateIndex: number) => void,
    board: Cell[][],
}

function CandidatesContextMenu({
        ref,
        showCandidateOnTheBoard, 
        board,
    }: CandidatesContextMenuProps) {
        const { setContextMenuVisibility, contextMenuPosition } = useContext<CandidatesContextMenuContextType>(CandidatesContextMenuContext);

    const candidates: number[] = [0,1,2,3];
    const candidatesToggled = (board[contextMenuPosition.row][contextMenuPosition.column] as Card).areCandidatesVisible;

    const handleCandidateClick = (candidate: number): void => {
        showCandidateOnTheBoard(contextMenuPosition.row, contextMenuPosition.column, candidate);
    }
    
    const closeContextMenu = () => {
        setContextMenuVisibility(false);
    }
    
    return (
        <div
            ref={ref}
            style={{top: contextMenuPosition.y, left: contextMenuPosition.x}}
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