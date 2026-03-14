import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview content - the actual template inside preview-card
      const previewCard = document.querySelector('.preview-card')
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Get the template content (first child of preview-card)
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (!templateContent) {
        showSnackbar('No template content found', 'error')
        return
      }

      showSnackbar('Generating PDF...', 'info')

      // Create a clean clone for PDF generation
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Strip all classes and apply clean inline styles
      const cleanElement = (el: Element) => {
        const htmlEl = el as HTMLElement
        
        // Get computed styles
        const computed = window.getComputedStyle(el)
        
        // Build clean inline style
        const styles: string[] = []
        
        // Essential layout styles
        if (computed.display) styles.push(`display: ${computed.display}`)
        if (computed.flexDirection) styles.push(`flex-direction: ${computed.flexDirection}`)
        if (computed.justifyContent) styles.push(`justify-content: ${computed.justifyContent}`)
        if (computed.alignItems) styles.push(`align-items: ${computed.alignItems}`)
        if (computed.gap) styles.push(`gap: ${computed.gap}`)
        if (computed.padding) styles.push(`padding: ${computed.padding}`)
        if (computed.margin) styles.push(`margin: ${computed.margin}`)
        if (computed.width) styles.push(`width: ${computed.width}`)
        if (computed.maxWidth) styles.push(`max-width: ${computed.maxWidth}`)
        if (computed.textAlign) styles.push(`text-align: ${computed.textAlign}`)
        
        // Typography - convert to solid colors
        if (computed.color && !computed.color.includes('var(')) {
          styles.push(`color: ${computed.color}`)
        }
        if (computed.fontSize) styles.push(`font-size: ${computed.fontSize}`)
        if (computed.fontWeight) styles.push(`font-weight: ${computed.fontWeight}`)
        if (computed.fontFamily) styles.push(`font-family: ${computed.fontFamily}`)
        if (computed.lineHeight) styles.push(`line-height: ${computed.lineHeight}`)
        
        // Background - convert to solid
        if (computed.backgroundColor && !computed.backgroundColor.includes('var(') && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          styles.push(`background-color: ${computed.backgroundColor}`)
        }
        
        // Border
        if (computed.borderRadius && computed.borderRadius !== '0px') {
          styles.push(`border-radius: ${computed.borderRadius}`)
        }
        
        // Apply clean styles
        htmlEl.style.cssText = styles.join('; ')
        
        // Remove class attribute entirely
        htmlEl.removeAttribute('class')
        
        // Process children
        Array.from(el.children).forEach(child => cleanElement(child))
      }
      
      cleanElement(clone)
      
      // Create a wrapper with A4 dimensions
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        background: white;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Use html2pdf
      const html2pdf = (await import('html2pdf.js')).default
      
      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all', before: 'h1, h2, h3, h4, h5, h6' }
        })
        .from(clone)
        .save()

      // Cleanup
      document.body.removeChild(wrapper)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
