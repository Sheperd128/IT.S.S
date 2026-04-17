import { createContext, useEffect } from 'react';
import axios from 'axios';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  
  // Hex to RGB converter for Tailwind opacity compatibility
  const hexToRgb = (hex) => {
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(' ');
  };

  const applyThemeToDOM = (colors) => {
    const root = document.documentElement;
    Object.keys(colors).forEach(key => {
      if (colors[key] && colors[key].startsWith('#')) {
        root.style.setProperty(`--color-${key}`, hexToRgb(colors[key]));
      }
    });
  };

  const fetchAndApplyTheme = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/content');
      if (data?.themeConfig?.colors) {
        applyThemeToDOM(data.themeConfig.colors);
      }
    } catch (error) { console.error('Failed to apply theme', error); }
  };

  useEffect(() => {
    fetchAndApplyTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ applyThemeToDOM, fetchAndApplyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};