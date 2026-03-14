import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview card
      const previewCard = document.querySelector('.preview-card') as HTMLElement
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      showSnackbar('Preparing PDF...', 'info')

      // Clone and clean the element for printing
      const clone = previewCard.cloneNode(true) as HTMLElement
      
      // Apply print-friendly styles inline
      const applyPrintStyles = (el: Element) => {
        const htmlEl = el as HTMLElement
        // Get computed styles
        const computed = window.getComputedStyle(el)
        
        // Copy essential styles only
        const essentialStyles = [
          'font-family', 'font-size', 'font-weight', 'color', 
          'background', 'background-color',
          'padding', 'margin', 'text-align', 'display', 'flex',
          'border', 'border-radius', 'width', 'height'
        ]
        
        essentialStyles.forEach(prop => {
          try {
            const val = computed.getPropertyValue(prop)
            if (val && val !== '' && !val.includes('var(') && !val.includes('color(')) {
              htmlEl.style.setProperty(prop, val)
            }
          } catch (e) {}
        })
        
        // Remove classes
        htmlEl.removeAttribute('class')
        
        // Apply to children
        Array.from(el.children).forEach(child => applyPrintStyles(child))
      }
      
      applyPrintStyles(clone)
      
      // Set container styles
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        background: #fff;
        padding: 15mm;
        font-family: Arial, Helvetica, sans-serif;
        color: #333;
      `
      
      // Add to DOM
      document.body.appendChild(clone)
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Use html2pdf.js
      const html2pdf = (await import('html2pdf.js')).default
      
      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (clonedDoc: Document) => {
              // Remove all style tags and external stylesheets from cloned doc
              clonedDoc.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove())
              
              // Also remove style attributes that might cause issues
              clonedDoc.querySelectorAll('[style*="color("]').forEach(el => {
                (el as HTMLElement).style.color = '#333333'
              })
              clonedDoc.querySelectorAll('[style*="background"]').forEach(el => {
                const htmlEl = el as HTMLElement
                const bg = htmlEl.style.background
                if (bg && (bg.includes('var(') || bg.includes('color('))) {
                  htmlEl.style.background = '#ffffff'
                }
              })
            }
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
      
      // Fallback: use window.print()
      showSnackbar('Trying browser print...', 'warning')
      
      // Open print dialog
      window.print()
      
      showSnackbar('Use browser "Save as PDF" option', 'info')
    }
  }

  return { exportPdf }
}
