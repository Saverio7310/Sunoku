import { useContext, useState } from 'react';

import type { ThemeContextType } from '../types/gameTypes';

import { ThemeContext } from './ThemeContext';

import '../styles/Header.css'
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';

function Header() {
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
                <label className="theme-switch">
                    <input 
                        className='theme-input' 
                        type="checkbox" 
                        checked={checked} 
                        onChange={handleSwithToggle}
                    />
                    <span className="theme-slider"></span>
                </label>
                <div className='theme-icon-container'>
                    <MdOutlineDarkMode className={`theme-icon ${checked ? 'selected' : ''}`}/>
                </div>
            </div>
        </div>
    );
}

export default Header;