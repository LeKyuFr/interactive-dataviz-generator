/**
 * Theme Manager
 * Handles theme persistence and switching
 */
export class ThemeManager {
  static THEME_KEY = 'dataviz-theme';
  static THEMES = {
    LIGHT: 'light',
    DARK: 'dark'
  };

  static init() {
    // Load saved theme or default to light
    const savedTheme = this.getSavedTheme();
    this.applyTheme(savedTheme);
    
    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.hasManualThemeSet()) {
          this.applyTheme(e.matches ? this.THEMES.DARK : this.THEMES.LIGHT);
        }
      });
    }
  }

  static getSavedTheme() {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved && Object.values(this.THEMES).includes(saved)) {
      return saved;
    }
    
    // Default to system preference or light
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return this.THEMES.DARK;
    }
    
    return this.THEMES.LIGHT;
  }

  static saveTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
    localStorage.setItem(this.THEME_KEY + '-manual', 'true');
  }

  static hasManualThemeSet() {
    return localStorage.getItem(this.THEME_KEY + '-manual') === 'true';
  }

  static applyTheme(theme) {
    const html = document.documentElement;
    
    if (theme === this.THEMES.DARK) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    // Update theme toggle button
    this.updateThemeButton(theme);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
      detail: { theme } 
    }));
  }

  static toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.THEMES.DARK ? this.THEMES.LIGHT : this.THEMES.DARK;
    
    this.saveTheme(newTheme);
    this.applyTheme(newTheme);
    
    return newTheme;
  }

  static getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? this.THEMES.DARK : this.THEMES.LIGHT;
  }

  static updateThemeButton(theme) {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.textContent = theme === this.THEMES.DARK ? '☀️' : '🌙';
      themeBtn.title = `Switch to ${theme === this.THEMES.DARK ? 'light' : 'dark'} mode`;
    }
  }

  static addThemeAnimation() {
    // Add a subtle animation when switching themes
    const body = document.body;
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Remove transition after animation to avoid interference with other styles
    setTimeout(() => {
      body.style.transition = '';
    }, 300);
  }
}
