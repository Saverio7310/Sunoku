import { createContext, useState } from "react";
import type { CandidatesContextMenuContextType, Position } from "../types/gameTypes";

export const CandidatesContextMenuContext = createContext<CandidatesContextMenuContextType>({
    isContextMenuVisible: false,
    setContextMenuVisibility: (_isVisible: boolean) => console.warn('Missing Context Menu visibility setting function'),
    contextMenuPosition: { x: 0, y: 0, row: 0, column: 0 },
    setContextMenuNewPosition: (_position: Position) => console.warn('Missing Context Menu position setting function'),
});

type CandidatesContextMenuProviderProps = {
  children: React.ReactNode;
}

export function CandidatesContextMenuProvider({ children }: CandidatesContextMenuProviderProps) {
    const [isContextMenuVisible, setIsContextMenuVisible] = useState<boolean>(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<Position>({ x: 0, y: 0, row: 0, column: 0 });

    const setContextMenuVisibility = (isVisible: boolean): void => {
        setIsContextMenuVisible(isVisible);
    }

    const setContextMenuNewPosition = (position: Position) => {
        setContextMenuPosition(position);
    }

    return (
        <CandidatesContextMenuContext value={{ isContextMenuVisible, setContextMenuVisibility, contextMenuPosition, setContextMenuNewPosition }}>
            {children}
        </CandidatesContextMenuContext>
    );
}