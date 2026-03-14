import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      // Find the preview content - the actual template inside preview-card
      const previewCard = document.querySelector('.preview-card')
      console.log('PDF Export: previewCard found:', !!previewCard)
      
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Get the template content (first child of preview-card)
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      console.log('PDF Export: templateContent found:', !!templateContent)
      
      if (!templateContent) {
        showSnackbar('No template content found', 'error')
        return
      }

      showSnackbar('Generating PDF...', 'info')
      console.log('PDF Export: Creating clone...')

      // Create a clean clone for PDF generation
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Set basic styles
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `
      
      // Remove all class attributes
      const removeClasses = (el: Element) => {
        (el as HTMLElement).removeAttribute('class')
        Array.from(el.children).forEach(child => removeClasses(child))
      }
      removeClasses(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added to DOM')
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500))
      console.log('PDF Export: Rendering html2pdf...')
      
      // Use html2pdf
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      console.log('PDF Export: html2pdf loaded')
      
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
          pagebreak: { mode: 'avoid-all' }
        })
        .from(clone)
        .save()

      console.log('PDF Export: Save complete')
      
      // Cleanup
      document.body.removeChild(clone)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
