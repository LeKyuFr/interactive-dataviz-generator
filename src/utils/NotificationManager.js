/**
 * Notification Manager
 * Handles user feedback and notifications
 */
export class NotificationManager {
  static show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container')
    const notification = document.createElement('div')
    
    notification.className = `notification ${type}`
    notification.innerHTML = `
      <span class="notification-icon">${this.getIcon(type)}</span>
      <span class="notification-message">${message}</span>
    `
    
    container.appendChild(notification)
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10)
    
    // Auto remove
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => container.removeChild(notification), 300)
    }, duration)
  }

  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ'
    }
    return icons[type] || icons.info
  }
}
