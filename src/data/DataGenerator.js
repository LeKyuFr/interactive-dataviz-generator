/**
 * Advanced Data Generator
 * Creates sophisticated datasets with various patterns and correlations
 */
export class DataGenerator {
  /**
   * Generate sample data based on type and parameters
   * @param {string} type - Chart type
   * @param {number} count - Number of data points
   * @returns {Array} Generated data
   */
  static async generateData(type, count = 20) {
    const categories = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Energy', 'Transportation']
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16']
    
    // Simulate async data processing
    await this.delay(Math.random() * 500 + 200)
    
    switch (type) {
      case 'bar':
        return this.generateBarData(categories, colors, count)
      case 'line':
        return this.generateLineData(count)
      case 'pie':
        return this.generatePieData(categories, colors)
      case 'scatter':
        return this.generateScatterData(count)
      case 'heatmap':
        return this.generateHeatmapData()
      default:
        return this.generateBarData(categories, colors, count)
    }
  }

  /**
   * Generate bar chart data with realistic business metrics
   */
  static generateBarData(categories, colors, count) {
    const data = categories.slice(0, Math.min(count, categories.length)).map((category, index) => {
      // Simulate realistic business data with seasonal patterns
      const baseValue = Math.random() * 80 + 20
      const seasonality = Math.sin((index / categories.length) * Math.PI * 2) * 15
      const trend = index * 2
      const noise = (Math.random() - 0.5) * 10
      
      return {
        label: category,
        value: Math.max(0, Math.round(baseValue + seasonality + trend + noise)),
        color: colors[index % colors.length],
        trend: Math.random() > 0.5 ? 'up' : 'down',
        percentage: Math.random() * 20 - 10
      }
    })

    return {
      labels: data.map(d => d.label),
      datasets: [{
        label: 'Revenue (in millions)',
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderColor: data.map(d => d.color),
        borderWidth: 2,
        borderRadius: 4,
        tension: 0.4
      }],
      metadata: data
    }
  }

  /**
   * Generate line chart data with time series patterns
   */
  static generateLineData(count) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const currentMonth = new Date().getMonth()
    
    // Generate multiple series with different patterns
    const series = [
      { name: 'Sales', color: '#3b82f6', pattern: 'growth' },
      { name: 'Expenses', color: '#ef4444', pattern: 'volatile' },
      { name: 'Profit', color: '#10b981', pattern: 'seasonal' }
    ]

    const datasets = series.map(s => {
      const data = months.slice(0, count).map((month, index) => {
        let value = 50
        
        switch (s.pattern) {
          case 'growth':
            value = 30 + index * 5 + Math.sin(index * 0.5) * 10 + Math.random() * 15
            break
          case 'volatile':
            value = 40 + Math.sin(index * 0.8) * 20 + Math.random() * 25
            break
          case 'seasonal':
            value = 35 + Math.sin((index + currentMonth) * 0.5) * 15 + Math.random() * 10
            break
        }
        
        return Math.max(0, Math.round(value))
      })

      return {
        label: s.name,
        data: data,
        borderColor: s.color,
        backgroundColor: s.color + '20',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: s.color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }
    })

    return {
      labels: months.slice(0, count),
      datasets: datasets
    }
  }

  /**
   * Generate pie chart data with market share simulation
   */
  static generatePieData(categories, colors) {
    // Simulate market share data
    let total = 100
    const data = categories.slice(0, 6).map((category, index, arr) => {
      const isLast = index === arr.length - 1
      const value = isLast ? total : Math.random() * (total / (arr.length - index)) * 1.5
      total -= value
      
      return {
        label: category,
        value: Math.round(Math.max(value, 1)),
        color: colors[index % colors.length]
      }
    })

    return {
      labels: data.map(d => d.label),
      datasets: [{
        data: data.map(d => d.value),
        backgroundColor: data.map(d => d.color),
        borderColor: '#fff',
        borderWidth: 2,
        hoverBorderWidth: 4
      }],
      metadata: data
    }
  }

  /**
   * Generate scatter plot data with correlation patterns
   */
  static generateScatterData(count) {
    const data = Array.from({ length: count }, (_, i) => {
      // Create correlation between x and y with some noise
      const x = Math.random() * 100
      const y = x * 0.7 + Math.random() * 30 + 10 // Positive correlation with noise
      const size = Math.random() * 15 + 5
      
      return {
        x: Math.round(x),
        y: Math.round(y),
        r: size,
        label: `Point ${i + 1}`,
        category: ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
      }
    })

    const categories = ['A', 'B', 'C']
    const categoryColors = ['#3b82f6', '#ef4444', '#10b981']
    
    const datasets = categories.map((cat, index) => ({
      label: `Category ${cat}`,
      data: data.filter(d => d.category === cat),
      backgroundColor: categoryColors[index] + '80',
      borderColor: categoryColors[index],
      borderWidth: 2
    }))

    return {
      datasets: datasets,
      metadata: data
    }
  }

  /**
   * Generate heatmap data matrix
   */
  static generateHeatmapData() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    
    const data = days.map((day, dayIndex) => 
      hours.map((hour, hourIndex) => {
        // Simulate activity patterns (higher during work hours, weekdays vs weekends)
        let intensity = 0.1
        
        if (dayIndex < 5) { // Weekdays
          if (hourIndex >= 9 && hourIndex <= 17) {
            intensity = 0.7 + Math.random() * 0.3
          } else if (hourIndex >= 18 && hourIndex <= 22) {
            intensity = 0.4 + Math.random() * 0.3
          }
        } else { // Weekends
          if (hourIndex >= 10 && hourIndex <= 14) {
            intensity = 0.5 + Math.random() * 0.3
          }
        }
        
        return {
          x: hourIndex,
          y: dayIndex,
          v: intensity,
          day: day,
          hour: hour,
          value: Math.round(intensity * 100)
        }
      })
    ).flat()

    return {
      labels: { days, hours },
      data: data,
      metadata: { days, hours }
    }
  }

  /**
   * Utility function for async delays
   */
  static delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
