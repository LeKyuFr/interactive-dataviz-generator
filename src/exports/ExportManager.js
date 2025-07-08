import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'
import { NotificationManager } from '../utils/NotificationManager.js'

/**
 * Export Manager
 * Handles data and chart exports in multiple formats
 */
export class ExportManager {
  static async exportPNG(chartInstance) {
    try {
      NotificationManager.show('Generating PNG export...', 'info')
      
      const canvas = await html2canvas(document.querySelector('.chart-container'), {
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color'),
        scale: 2
      })
      
      canvas.toBlob(blob => {
        saveAs(blob, `chart-${Date.now()}.png`)
        NotificationManager.show('PNG exported successfully!', 'success')
      })
    } catch (error) {
      NotificationManager.show('Failed to export PNG', 'error')
    }
  }

  static async exportSVG(data) {
    try {
      const svg = this.generateSVG(data)
      const blob = new Blob([svg], { type: 'image/svg+xml' })
      saveAs(blob, `chart-${Date.now()}.svg`)
      NotificationManager.show('SVG exported successfully!', 'success')
    } catch (error) {
      NotificationManager.show('Failed to export SVG', 'error')
    }
  }

  static async exportJSON(data) {
    try {
      const jsonData = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonData], { type: 'application/json' })
      saveAs(blob, `data-${Date.now()}.json`)
      NotificationManager.show('JSON exported successfully!', 'success')
    } catch (error) {
      NotificationManager.show('Failed to export JSON', 'error')
    }
  }

  static generateSVG(data) {
    // Simplified SVG generation for demonstration
    return `
      <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <text x="400" y="50" text-anchor="middle" style="font-size:20px;font-weight:bold">
          Chart Export (${new Date().toLocaleDateString()})
        </text>
        <text x="400" y="200" text-anchor="middle" style="font-size:14px">
          Data points: ${data.labels?.length || data.datasets?.[0]?.data?.length || 0}
        </text>
      </svg>
    `
  }
}
