import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  BarController,
  LineController,
  PieController,
  ScatterController,
  Filler
} from 'chart.js'
import confetti from 'canvas-confetti'
import { DataGenerator } from '../data/DataGenerator.js'

// Register all Chart.js components
Chart.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  LineElement, 
  PointElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  BarController,
  LineController,
  PieController,
  ScatterController,
  Filler
)

/**
 * Advanced Chart Renderer
 * Handles multiple chart types with sophisticated configurations
 */
export class ChartRenderer {
  constructor(canvas, state) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.state = state
    this.chart = null
  }

  /**
   * Render chart based on current state
   * @param {object} data - Chart data
   * @param {string} type - Chart type
   */
  async render(data, type = 'bar') {
    try {
      // Destroy existing chart and wait for cleanup
      if (this.chart) {
        this.chart.destroy()
        this.chart = null
        // Wait for canvas to be fully released
        await DataGenerator.delay(50)
      }

      // Show loading state
      this.showLoading()

      // Apply chart-specific styling to container
      this.updateContainerStyling(type)

      // Handle heatmap separately as it's not a Chart.js type
      if (type === 'heatmap') {
        await DataGenerator.delay(200)
        this.renderHeatmap(data)
        this.hideLoading()
        return null
      }

      // Create chart configuration
      const config = this.getChartConfig(data, type)
      
      // Simulate processing time for complex visualizations
      await DataGenerator.delay(200)

      // Create new chart
      this.chart = new Chart(this.ctx, config)

      // Hide loading and show chart
      this.hideLoading()

      // Add custom interactions
      this.addCustomInteractions(type)

      return this.chart

    } catch (error) {
      console.error('Chart rendering error:', error)
      this.showError('Failed to render chart')
    }
  }

  /**
   * Get chart configuration based on type
   */
  getChartConfig(data, type) {
    const baseConfig = {
      type: type,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: this.state.settings.animationSpeed,
          easing: 'easeInOutQuart'
        },
        plugins: {
          title: {
            display: true,
            text: this.getChartTitle(type),
            font: { size: 18, weight: 'bold' },
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
          },
          legend: {
            display: type !== 'heatmap',
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              color: getComputedStyle(document.documentElement).getPropertyValue('--text-color')
            }
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            borderWidth: 2,
            cornerRadius: 8,
            displayColors: true,
            callbacks: this.getTooltipCallbacks(type)
          }
        },
        scales: this.getScaleConfig(type),
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    }

    // Type-specific configurations
    switch (type) {
      case 'line':
        baseConfig.options.elements = {
          point: { radius: 4, hoverRadius: 8 },
          line: { tension: 0.4 }
        }
        break
      case 'pie':
        baseConfig.type = 'pie'
        baseConfig.options.plugins.legend.position = 'right'
        baseConfig.options.scales = {}
        break
      case 'scatter':
        baseConfig.type = 'scatter'
        baseConfig.options.scales.x.type = 'linear'
        baseConfig.options.scales.y.type = 'linear'
        break
      case 'bar':
        baseConfig.type = 'bar'
        break
      case 'heatmap':
        // Heatmap is handled separately in render method
        throw new Error('Heatmap should be handled by renderHeatmap method')
    }

    return baseConfig
  }

  /**
   * Get scale configuration for chart types
   */
  getScaleConfig(type) {
    if (type === 'pie') return {}

    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color')
    const gridColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color')

    const baseScale = {
      x: {
        grid: { color: gridColor, borderColor: gridColor },
        ticks: { color: textColor },
        title: {
          display: true,
          text: this.getAxisLabel(type, 'x'),
          color: textColor,
          font: { weight: 'bold' }
        }
      },
      y: {
        grid: { color: gridColor, borderColor: gridColor },
        ticks: { color: textColor },
        title: {
          display: true,
          text: this.getAxisLabel(type, 'y'),
          color: textColor,
          font: { weight: 'bold' }
        },
        beginAtZero: true
      }
    }

    // Scatter plots need linear scales
    if (type === 'scatter') {
      baseScale.x.type = 'linear'
      baseScale.y.type = 'linear'
    }

    return baseScale
  }

  /**
   * Get tooltip callbacks for different chart types
   */
  getTooltipCallbacks(type) {
    return {
      title: (context) => {
        switch (type) {
          case 'scatter':
            return `Point ${context[0].dataIndex + 1}`
          default:
            return context[0].label
        }
      },
      label: (context) => {
        switch (type) {
          case 'pie':
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((context.raw / total) * 100).toFixed(1)
            return `${context.label}: ${context.raw} (${percentage}%)`
          case 'scatter':
            return `X: ${context.raw.x}, Y: ${context.raw.y}`
          default:
            return `${context.dataset.label}: ${context.raw}`
        }
      }
    }
  }

  /**
   * Get chart title based on type
   */
  getChartTitle(type) {
    const titles = {
      bar: 'Revenue by Industry Sector',
      line: 'Financial Performance Over Time',
      pie: 'Market Share Distribution',
      scatter: 'Performance Correlation Analysis',
      heatmap: 'Activity Heatmap'
    }
    return titles[type] || 'Data Visualization'
  }

  /**
   * Get axis labels based on chart type
   */
  getAxisLabel(type, axis) {
    const labels = {
      bar: { x: 'Industry Sectors', y: 'Revenue (Millions $)' },
      line: { x: 'Time Period', y: 'Value' },
      scatter: { x: 'Input Variable', y: 'Output Variable' },
      heatmap: { x: 'Hours', y: 'Days' }
    }
    return labels[type]?.[axis] || (axis === 'x' ? 'Categories' : 'Values')
  }

  /**
   * Update container styling based on chart type
   */
  updateContainerStyling(type) {
    const container = document.querySelector('.chart-container')
    container.className = `chart-container ${type}-chart fade-in`
  }

  /**
   * Add custom interactions for enhanced UX
   */
  addCustomInteractions(type) {
    if (!this.chart) return

    // Add click celebrations for achievements
    this.chart.options.onClick = (event, activeElements) => {
      if (activeElements.length > 0 && Math.random() > 0.7) {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { x: 0.5, y: 0.8 }
        })
      }
    }

    // Add hover effects
    this.chart.options.onHover = (event, activeElements) => {
      event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default'
    }

    this.chart.update('none')
  }

  /**
   * Show loading state
   */
  showLoading() {
    document.getElementById('loading').classList.add('visible')
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    document.getElementById('loading').classList.remove('visible')
  }

  /**
   * Show error message
   */
  showError(message) {
    this.hideLoading()
    
    // Import NotificationManager dynamically to avoid circular dependency
    import('../utils/NotificationManager.js').then(({ NotificationManager }) => {
      NotificationManager.show(message, 'error')
    })
  }

  /**
   * Handle heatmap rendering (custom implementation)
   */
  renderHeatmap(data) {
    try {
      // Clear canvas and set size
      this.canvas.width = this.canvas.offsetWidth || 800
      this.canvas.height = this.canvas.offsetHeight || 600
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      
      if (!data || !data.metadata || !data.data) {
        throw new Error('Invalid heatmap data structure')
      }
      
      const { days, hours } = data.metadata
      const cellWidth = (this.canvas.width - 80) / hours.length  // Reserve space for labels
      const cellHeight = (this.canvas.height - 60) / days.length // Reserve space for labels
      const offsetX = 60
      const offsetY = 20
      
      // Draw heatmap cells
      data.data.forEach(point => {
        const x = offsetX + point.x * cellWidth
        const y = offsetY + point.y * cellHeight
        const intensity = Math.max(0, Math.min(1, point.v)) // Clamp intensity between 0 and 1
        
        // Color based on intensity
        const color = this.getHeatmapColor(intensity)
        this.ctx.fillStyle = color
        this.ctx.fillRect(x, y, cellWidth - 1, cellHeight - 1)
        
        // Add text if cell is large enough
        if (cellWidth > 30 && cellHeight > 20) {
          this.ctx.fillStyle = intensity > 0.5 ? '#fff' : '#000'
          this.ctx.font = '10px Arial'
          this.ctx.textAlign = 'center'
          this.ctx.textBaseline = 'middle'
          this.ctx.fillText(
            point.value.toString(),
            x + cellWidth / 2,
            y + cellHeight / 2
          )
        }
      })
      
      // Draw labels
      this.drawHeatmapLabels(days, hours, cellWidth, cellHeight, offsetX, offsetY)
      
    } catch (error) {
      console.error('Heatmap rendering error:', error)
      this.showError('Failed to render heatmap')
    }
  }

  /**
   * Get color for heatmap intensity
   */
  getHeatmapColor(intensity) {
    // Use a more sophisticated color gradient
    const colors = [
      { r: 239, g: 246, b: 255 }, // Light blue
      { r: 191, g: 219, b: 254 }, 
      { r: 147, g: 197, b: 253 }, 
      { r: 96, g: 165, b: 250 },
      { r: 59, g: 130, b: 246 },
      { r: 37, g: 99, b: 235 }    // Dark blue
    ]
    
    const index = intensity * (colors.length - 1)
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.ceil(index)
    const ratio = index - lowerIndex
    
    if (lowerIndex === upperIndex) {
      const color = colors[lowerIndex]
      return `rgb(${color.r}, ${color.g}, ${color.b})`
    }
    
    const lower = colors[lowerIndex]
    const upper = colors[upperIndex]
    
    const r = Math.round(lower.r + (upper.r - lower.r) * ratio)
    const g = Math.round(lower.g + (upper.g - lower.g) * ratio)
    const b = Math.round(lower.b + (upper.b - lower.b) * ratio)
    
    return `rgb(${r}, ${g}, ${b})`
  }

  /**
   * Draw heatmap labels
   */
  drawHeatmapLabels(days, hours, cellWidth, cellHeight, offsetX, offsetY) {
    try {
      this.ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#374151'
      this.ctx.font = '11px Arial'
      this.ctx.textBaseline = 'middle'
      
      // Draw day labels
      this.ctx.textAlign = 'right'
      days.forEach((day, index) => {
        this.ctx.fillText(
          day.substring(0, 3),
          offsetX - 10,
          offsetY + index * cellHeight + cellHeight / 2
        )
      })
      
      // Draw hour labels (every 2 hours for better readability)
      this.ctx.textAlign = 'center'
      this.ctx.textBaseline = 'top'
      hours.forEach((hour, index) => {
        if (index % 2 === 0 || hours.length <= 12) {
          this.ctx.fillText(
            hour.replace(':00', ''),
            offsetX + index * cellWidth + cellWidth / 2,
            offsetY + days.length * cellHeight + 5
          )
        }
      })
    } catch (error) {
      console.error('Error drawing heatmap labels:', error)
    }
  }

  /**
   * Destroy chart and cleanup resources
   */
  destroy() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * Reset canvas for new rendering
   */
  resetCanvas() {
    this.canvas.width = this.canvas.offsetWidth
    this.canvas.height = this.canvas.offsetHeight
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}
