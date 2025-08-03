import { useContext, useState } from 'react';

import type { ThemeContextType } from '../types/gameTypes';

import { ThemeContext } from './ThemeContext';

import '../styles/Header.css'
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

function Header() {
    /**
     * checked === true means the theme is 'dark'
     * checked === false means the theme is 'light'
     */
    const [checked, setChecked] = useState<boolean>(true);

    const { switchTheme } = useContext<ThemeContextType>(ThemeContext);

    const handleSwithToggle = ():void => {
        setChecked(!checked);
        switchTheme();
    }

    return (
        <div className='header'>
            <div className='title-container'>
                <h1 className='title'>Sunoku</h1>
            </div>
            <div className='theme-toggle'>
                <div className='theme-icon-container'>
                    <MdOutlineLightMode className={`theme-icon ${checked ? '' : 'selected'}`}/>
                </div>
                <div 
                    className={`theme-switch-container ${checked ? 'dark-theme' : 'light-theme'}`}
                    onClick={handleSwithToggle}
                >
                    <div className={`theme-toggle-ball ${checked ? 'switch-checked' : ''}`}></div>
                </div>
                <div className='theme-icon-container'>
                    <MdOutlineDarkMode className={`theme-icon ${checked ? 'selected' : ''}`}/>
                </div>
            </div>
        </div>
    );
}

export default Header;