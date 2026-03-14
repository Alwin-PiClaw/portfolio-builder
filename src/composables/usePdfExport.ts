import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      const previewElement = document.querySelector('.preview-card') as HTMLElement
      if (!previewElement) {
        showSnackbar('No preview found', 'error')
        return
      }

      showSnackbar('Preparing PDF...', 'info')

      // Clone the element
      const clone = previewElement.cloneNode(true) as HTMLElement
      
      // Remove all style attributes and classes that might cause issues
      clone.querySelectorAll('*').forEach((el: Element) => {
        const htmlEl = el as HTMLElement
        
        // Get computed styles and apply as inline styles
        const originalEl = previewElement.querySelector(`[data-id="${htmlEl.getAttribute('data-id')}"]`) || 
                          Array.from(previewElement.querySelectorAll('*')).find(e => e === el)
        if (originalEl) {
          const computed = window.getComputedStyle(originalEl as Element)
          
          // Apply solid colors instead of CSS variables
          const props = ['color', 'backgroundColor', 'background', 'borderColor']
          props.forEach(prop => {
            const value = computed.getPropertyValue(prop)
            if (value && !value.includes('var(') && !value.includes('rgb(a)?')) {
              try {
                htmlEl.style.setProperty(prop, value)
              } catch (e) {}
            }
          })
        }
        
        // Remove problematic CSS
        htmlEl.removeAttribute('class')
        htmlEl.style.cssText = `
          font-family: Arial, sans-serif;
          color: #333333;
          background: #ffffff;
        `
      })

      // Set basic styles on clone
      clone.style.cssText = `
        position: fixed;
        left: 0;
        top: 0;
        width: 210mm;
        background: #ffffff;
        padding: 10mm;
        font-family: Arial, sans-serif;
      `
      
      const inner = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (inner) {
        inner.style.cssText = `
          min-height: auto;
          padding: 10mm;
          background: #ffffff;
          color: #333333;
        `
      }

      // Add to body
      document.body.appendChild(clone)

      // Wait
      await new Promise(resolve => setTimeout(resolve, 300))

      // Use html2pdf with simpler options
      const html2pdf = (await import('html2pdf.js')).default

      await html2pdf()
        .set({
          margin: 10,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(clone)
        .save()

      // Cleanup
      document.body.removeChild(clone)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
