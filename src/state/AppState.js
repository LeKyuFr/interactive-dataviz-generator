/**
 * Application State Management
 * Centralized state using modern JavaScript patterns
 */
export class AppState {
  constructor() {
    this.currentChart = 'bar'
    this.data = []
    this.isRealTime = false
    this.theme = 'light'
    this.settings = {
      animationSpeed: 800,
      dataPoints: 20,
      updateInterval: 1500
    }
    this.chart = null
    this.updateTimer = null
    
    // Event system for reactive updates
    this.listeners = new Map()
  }

  /**
   * Subscribe to state changes
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  /**
   * Emit state change events
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data))
    }
  }

  /**
   * Update state and emit changes
   * @param {object} updates - State updates
   */
  setState(updates) {
    const oldState = { ...this }
    Object.assign(this, updates)
    
    Object.keys(updates).forEach(key => {
      this.emit(`${key}Changed`, { oldValue: oldState[key], newValue: this[key] })
    })
    
    this.emit('stateChanged', this)
  }
}
