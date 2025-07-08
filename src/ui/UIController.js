import { DataGenerator } from '../data/DataGenerator.js'
import { FileHandler } from '../data/FileHandler.js'
import { ExportManager } from '../exports/ExportManager.js'
import { NotificationManager } from '../utils/NotificationManager.js'
import { ThemeManager } from '../utils/ThemeManager.js'

/**
 * UI Controller
 * Manages user interface interactions and state updates
 */
export class UIController {
  constructor(state, renderer, simulator) {
    this.state = state
    this.renderer = renderer
    this.simulator = simulator
    
    this.initializeEventListeners()
    this.setupStateSubscriptions()
    this.initializeTheme()
  }

  initializeTheme() {
    // Initialize theme manager
    ThemeManager.init()
    
    // Set initial theme in state
    const currentTheme = ThemeManager.getCurrentTheme()
    this.state.setState({ theme: currentTheme })
  }

  initializeTheme() {
    // Initialize theme manager
    ThemeManager.init()
    
    // Listen for theme changes
    window.addEventListener('themeChanged', (e) => {
      this.onThemeChanged(e.detail.theme)
    })
  }

  initializeEventListeners() {
    // Chart type selection with improved animations
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.closest('.chart-type-btn').dataset.type
        this.selectChartType(type)
      })
    })

    // Data controls
    document.getElementById('generate-data').addEventListener('click', () => this.generateNewData())
    document.getElementById('upload-data').addEventListener('click', () => this.triggerFileUpload())
    document.getElementById('clear-data').addEventListener('click', () => this.clearData())
    document.getElementById('file-input').addEventListener('change', (e) => this.handleFileUpload(e))

    // Export controls with loading feedback
    document.getElementById('export-png').addEventListener('click', () => this.handleExport('png'))
    document.getElementById('export-svg').addEventListener('click', () => this.handleExport('svg'))
    document.getElementById('export-json').addEventListener('click', () => this.handleExport('json'))

    // Real-time toggle with enhanced UI feedback
    document.getElementById('realtime-toggle').addEventListener('click', () => this.toggleRealTime())

    // Theme toggle using ThemeManager
    document.getElementById('theme-toggle').addEventListener('click', () => {
      ThemeManager.addThemeAnimation()
      const newTheme = ThemeManager.toggleTheme()
      NotificationManager.show(`Switched to ${newTheme} mode`, 'info', 2000)
    })

    // Settings with debounced updates
    this.setupSettingsListeners()

    // Add keyboard shortcuts
    this.setupKeyboardShortcuts()
  }

  setupSettingsListeners() {
    const debounce = (func, wait) => {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    }

    document.getElementById('animation-speed').addEventListener('input', debounce((e) => {
      this.state.setState({ settings: { ...this.state.settings, animationSpeed: parseInt(e.target.value) } })
      NotificationManager.show(`Animation speed: ${e.target.value}ms`, 'info', 1500)
    }, 300))
    
    document.getElementById('data-points').addEventListener('input', debounce((e) => {
      this.state.setState({ settings: { ...this.state.settings, dataPoints: parseInt(e.target.value) } })
      NotificationManager.show(`Data points: ${e.target.value}`, 'info', 1500)
    }, 300))
    
    document.getElementById('update-interval').addEventListener('input', debounce((e) => {
      this.state.setState({ settings: { ...this.state.settings, updateInterval: parseInt(e.target.value) } })
      NotificationManager.show(`Update interval: ${e.target.value}ms`, 'info', 1500)
    }, 300))
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Only handle shortcuts when not typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      switch (e.key) {
        case 'g':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            this.generateNewData()
          }
          break
        case 't':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            ThemeManager.toggleTheme()
          }
          break
        case 'r':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            this.toggleRealTime()
          }
          break
        case 'c':
          if (e.ctrlKey || e.metaKey && e.shiftKey) {
            e.preventDefault()
            this.clearData()
          }
          break
      }
    })
  }

  setupStateSubscriptions() {
    this.state.subscribe('dataChanged', (data) => this.updateDataPreview(data.newValue))
    this.state.subscribe('currentChartChanged', (data) => this.updateChartTitle(data.newValue))
  }

  async selectChartType(type) {
    // Update UI with smooth transitions
    document.querySelectorAll('.chart-type-btn').forEach(btn => {
      const isActive = btn.dataset.type === type
      
      if (isActive) {
        btn.classList.remove('bg-gray-50', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-200')
        btn.classList.add('bg-primary-500', 'text-white')
      } else {
        btn.classList.remove('bg-primary-500', 'text-white')
        btn.classList.add('bg-gray-50', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-200')
      }
    })

    // Update state and generate new data
    this.state.setState({ currentChart: type })
    await this.generateNewData()
  }

  async generateNewData() {
    try {
      // Add loading state to generate button
      const generateBtn = document.getElementById('generate-data')
      const originalText = generateBtn.textContent
      generateBtn.disabled = true
      generateBtn.textContent = 'Generating...'
      generateBtn.classList.add('opacity-50')

      const data = await DataGenerator.generateData(
        this.state.currentChart,
        this.state.settings.dataPoints
      )
      
      this.state.setState({ data })
      
      // Use the updated render method which handles heatmap internally
      const chart = await this.renderer.render(data, this.state.currentChart)
      this.state.setState({ chart })
      
      NotificationManager.show('New data generated successfully!', 'success')
      
      // Restore button state
      generateBtn.disabled = false
      generateBtn.textContent = originalText
      generateBtn.classList.remove('opacity-50')
      
    } catch (error) {
      NotificationManager.show('Failed to generate data', 'error')
      
      // Restore button state on error
      const generateBtn = document.getElementById('generate-data')
      generateBtn.disabled = false
      generateBtn.textContent = 'Generate Sample Data'
      generateBtn.classList.remove('opacity-50')
    }
  }

  async handleExport(type) {
    const exportBtn = document.getElementById(`export-${type}`)
    const originalText = exportBtn.textContent
    
    try {
      exportBtn.disabled = true
      exportBtn.textContent = 'Exporting...'
      exportBtn.classList.add('opacity-50')

      switch (type) {
        case 'png':
          await ExportManager.exportPNG(this.state.chart)
          break
        case 'svg':
          await ExportManager.exportSVG(this.state.data)
          break
        case 'json':
          await ExportManager.exportJSON(this.state.data)
          break
      }
    } finally {
      exportBtn.disabled = false
      exportBtn.textContent = originalText
      exportBtn.classList.remove('opacity-50')
    }
  }

  triggerFileUpload() {
    document.getElementById('file-input').click()
  }

  async handleFileUpload(event) {
    const file = event.target.files[0]
    if (!file) return

    try {
      NotificationManager.show('Processing uploaded file...', 'info')
      const data = await FileHandler.processFile(file)
      
      this.state.setState({ data })
      const chart = await this.renderer.render(data, this.state.currentChart)
      this.state.setState({ chart })
      
      NotificationManager.show('File uploaded and processed successfully!', 'success')
    } catch (error) {
      NotificationManager.show(`Failed to process file: ${error.message}`, 'error')
    }
  }

  clearData() {
    this.state.setState({ data: [] })
    if (this.state.chart) {
      this.state.chart.destroy()
      this.state.setState({ chart: null })
    }
    // Also clear the canvas using renderer's destroy method
    this.renderer.destroy()
    this.updateDataPreview([])
    NotificationManager.show('Data cleared', 'info')
  }

  toggleRealTime() {
    const btn = document.getElementById('realtime-toggle')
    const toggleIcon = btn.querySelector('.toggle-icon')
    const toggleText = btn.querySelector('span:not(.toggle-icon)')
    
    if (this.state.isRealTime) {
      this.simulator.stop()
      btn.classList.remove('bg-green-500', 'text-white', 'border-green-500')
      btn.classList.add('bg-white', 'dark:bg-gray-800', 'border-gray-300', 'dark:border-gray-600')
      toggleIcon.textContent = '🔴'
      if (toggleText) toggleText.textContent = 'Real-time: OFF'
      this.state.setState({ isRealTime: false })
    } else {
      this.simulator.start()
      btn.classList.add('bg-green-500', 'text-white', 'border-green-500')
      btn.classList.remove('bg-white', 'dark:bg-gray-800', 'border-gray-300', 'dark:border-gray-600')
      toggleIcon.textContent = '🟢'
      if (toggleText) toggleText.textContent = 'Real-time: ON'
      this.state.setState({ isRealTime: true })
    }
  }

  onThemeChanged(theme) {
    // Refresh chart with new theme colors if needed
    if (this.state.chart && this.state.data) {
      setTimeout(() => {
        this.renderer.render(this.state.data, this.state.currentChart)
      }, 150) // Small delay to allow theme transition
    }
  }

  updateDataPreview(data) {
    const tableHeader = document.getElementById('table-header')
    const tableBody = document.getElementById('table-body')
    const dataCount = document.getElementById('data-count')
    const countDot = dataCount.querySelector('.w-2.h-2')
    
    // Clear existing content
    tableHeader.innerHTML = ''
    tableBody.innerHTML = ''
    
    if (!data || !data.labels || data.labels.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="100%" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No data available</td></tr>'
      dataCount.innerHTML = '<span class="w-2 h-2 bg-gray-400 rounded-full"></span><span>0 data points</span>'
      return
    }

    // Create headers with Tailwind classes
    const headers = ['Label', 'Value']
    headers.forEach(header => {
      const th = document.createElement('th')
      th.className = 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
      th.textContent = header
      tableHeader.appendChild(th)
    })

    // Create rows with Tailwind classes
    const maxRows = Math.min(10, data.labels.length)
    for (let i = 0; i < maxRows; i++) {
      const row = document.createElement('tr')
      row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150'
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">${data.labels[i]}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${data.datasets[0]?.data[i] || 'N/A'}</td>
      `
      tableBody.appendChild(row)
    }

    if (data.labels.length > maxRows) {
      const row = document.createElement('tr')
      row.innerHTML = `<td colspan="2" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">... and ${data.labels.length - maxRows} more rows</td>`
      tableBody.appendChild(row)
    }

    // Update data count with animation
    if (countDot) {
      countDot.className = 'w-2 h-2 bg-green-500 rounded-full pulse-slow'
    }
    dataCount.innerHTML = `<span class="w-2 h-2 bg-green-500 rounded-full pulse-slow"></span><span>${data.labels.length} data points</span>`
  }

  updateChartTitle(type) {
    const titles = {
      bar: 'Interactive Bar Chart',
      line: 'Dynamic Line Chart',
      pie: 'Market Share Pie Chart',
      scatter: 'Correlation Scatter Plot',
      heatmap: 'Activity Heatmap'
    }
    
    const titleElement = document.getElementById('chart-title')
    titleElement.textContent = titles[type] || 'Data Visualization'
    
    // Add a subtle animation when title changes
    titleElement.classList.add('animate-pulse')
    setTimeout(() => {
      titleElement.classList.remove('animate-pulse')
    }, 1000)
  }
}
