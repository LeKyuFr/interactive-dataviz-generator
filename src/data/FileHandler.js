/**
 * File Handler
 * Processes CSV and JSON file uploads
 */
export class FileHandler {
  static async processFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target.result
          let data
          
          if (file.name.endsWith('.csv')) {
            data = this.parseCSV(content)
          } else if (file.name.endsWith('.json')) {
            data = JSON.parse(content)
          } else {
            throw new Error('Unsupported file format')
          }
          
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  static parseCSV(content) {
    const lines = content.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim())
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const item = {}
      
      headers.forEach((header, index) => {
        const value = values[index]
        item[header] = isNaN(value) ? value : parseFloat(value)
      })
      
      return item
    })

    // Convert to Chart.js format
    return {
      labels: data.map(d => d[headers[0]]),
      datasets: [{
        label: 'Imported Data',
        data: data.map(d => d[headers[1]] || 0),
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 2
      }]
    }
  }
}

/**
 * Real-time Data Simulator
 * Simulates live data updates with WebSocket-like behavior
 */
export class RealTimeSimulator {
  constructor(state, updateCallback) {
    this.state = state
    this.updateCallback = updateCallback
    this.isRunning = false
    this.timer = null
  }

  start() {
    if (this.isRunning) return
    
    this.isRunning = true
    this.scheduleUpdate()
    
    // Import NotificationManager dynamically to avoid circular dependency
    import('../utils/NotificationManager.js').then(({ NotificationManager }) => {
      NotificationManager.show('Real-time updates started', 'info')
    })
  }

  stop() {
    if (!this.isRunning) return
    
    this.isRunning = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    
    // Import NotificationManager dynamically to avoid circular dependency
    import('../utils/NotificationManager.js').then(({ NotificationManager }) => {
      NotificationManager.show('Real-time updates stopped', 'info')
    })
  }

  scheduleUpdate() {
    if (!this.isRunning) return
    
    this.timer = setTimeout(async () => {
      try {
        await this.updateData()
        this.scheduleUpdate()
      } catch (error) {
        console.error('Real-time update failed:', error)
        this.stop()
      }
    }, this.state.settings.updateInterval)
  }

  async updateData() {
    const { DataGenerator } = await import('./DataGenerator.js')
    
    const newData = await DataGenerator.generateData(
      this.state.currentChart,
      this.state.settings.dataPoints
    )
    
    this.updateCallback(newData)
    
    // Update last update time
    document.getElementById('last-update').textContent = 
      `Last updated: ${new Date().toLocaleTimeString()}`
  }
}
