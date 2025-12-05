'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      <span className="toggle-icon">
        {isDark ? '🌙' : '☀️'}
      </span>

      <style jsx>{`
        .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          font-size: 20px;
          transition: transform 0.2s ease;
        }
        
        .theme-toggle:hover {
          transform: scale(1.1);
        }
        
        .toggle-icon {
          display: block;
        }
      `}</style>
    </button>
  );
}