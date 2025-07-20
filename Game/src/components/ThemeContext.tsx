import { createContext, useState } from "react";

import { type ThemeContextType, type Theme } from "../types/gameTypes";

export const ThemeContext = createContext<ThemeContextType>({
    theme: 'dark',
    switchTheme: () => {
        console.warn('Missing Theme switch function');
    }
});

type ThemeProviderProps = {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>('dark');

    const switchTheme = () => {
        setTheme(previous => previous === 'dark' ? 'light' : 'dark');
    }

    return (
        <ThemeContext value={{ theme, switchTheme }}>
            {children}
        </ThemeContext>
    );
}