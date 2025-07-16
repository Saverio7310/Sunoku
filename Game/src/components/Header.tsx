import { useContext, useState } from 'react';
import '../styles/Header.css'
import { ThemeContext } from './ThemeContext';
import type { ThemeContextType } from '../types/gameTypes';

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
                <h1 className='title'>Title</h1>
            </div>
            <div className='theme-toggle'>
                <label className="theme-switch">
                    <input 
                        className='theme-input' 
                        type="checkbox" 
                        checked={checked} 
                        onChange={handleSwithToggle}
                    />
                    <span className="theme-slider"></span>
                </label>
            </div>
        </div>
    );
}

export default Header;