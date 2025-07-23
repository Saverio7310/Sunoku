import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/colors.css'
import './styles/index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeContext.tsx'
import { CandidatesContextMenuProvider } from './components/CandidatesContextMenuContext.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider>
            <CandidatesContextMenuProvider>
                <App />
            </CandidatesContextMenuProvider>
        </ThemeProvider>
    </StrictMode>,
)
