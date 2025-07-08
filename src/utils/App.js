import { AppState } from '../state/AppState.js'
import { ChartRenderer } from '../charts/ChartRenderer.js'
import { RealTimeSimulator } from '../data/FileHandler.js'
import { UIController } from '../ui/UIController.js'
import { NotificationManager } from '../utils/NotificationManager.js'

/**
 * Application Initialization
 * Bootstrap the entire application with proper error handling
 */
export class App {
  constructor() {
    this.state = new AppState()
    this.renderer = null
    this.simulator = null
    this.controller = null
  }

  async initialize() {
    try {
      // Initialize canvas and renderer
      const canvas = document.getElementById('main-chart')
      if (!canvas) {
        throw new Error('Main chart canvas not found')
      }
      
      this.renderer = new ChartRenderer(canvas, this.state)
      
      // Initialize real-time simulator
      this.simulator = new RealTimeSimulator(this.state, (data) => {
        this.state.setState({ data })
        if (this.state.currentChart === 'heatmap') {
          this.renderer.renderHeatmap(data)
        } else {
          this.renderer.render(data, this.state.currentChart).then(chart => {
            this.state.setState({ chart })
          })
        }
      })
      
      // Initialize UI controller
      this.controller = new UIController(this.state, this.renderer, this.simulator)
      
      // Generate initial data
      await this.controller.generateNewData()
      
      // Setup error handling
      this.setupErrorHandling()
      
      // Show welcome message
      NotificationManager.show('DataViz Generator initialized successfully!', 'success')
      
      console.log('🎉 Interactive Data Visualization Generator loaded successfully!')
      console.log('Features: Multiple chart types, real-time updates, export functionality, and more!')
      
    } catch (error) {
      console.error('Application initialization failed:', error)
      NotificationManager.show(`Failed to initialize application: ${error.message}`, 'error')
    }
  }

  setupErrorHandling() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
      NotificationManager.show('An unexpected error occurred', 'error')
    })

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      NotificationManager.show('An unexpected error occurred', 'error')
    })
  }
}
