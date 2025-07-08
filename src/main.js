/**
 * Interactive Data Visualization Generator
 * A sophisticated JavaScript application showcasing modern web development techniques
 * 
 * Features:
 * - Multiple chart types with Canvas and SVG rendering
 * - Real-time data processing and updates
 * - Advanced ES6+ patterns and async operations
 * - Modular architecture with clean separation of concerns
 * - Responsive design and accessibility features
 * - Export functionality for multiple formats
 */

import './style.css'
import { App } from './utils/App.js'
import { AppState } from './state/AppState.js'
import { DataGenerator } from './data/DataGenerator.js'
import { ChartRenderer } from './charts/ChartRenderer.js'
import { NotificationManager } from './utils/NotificationManager.js'
import { ExportManager } from './exports/ExportManager.js'
import { ThemeManager } from './utils/ThemeManager.js'

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App()
  app.initialize()
})

// Export for potential use in other modules
export { App, AppState, DataGenerator, ChartRenderer, NotificationManager, ExportManager, ThemeManager }
