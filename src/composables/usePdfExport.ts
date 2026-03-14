import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      showSnackbar('Generating PDF...', 'info')

      const previewCard = document.querySelector('.preview-card')
      console.log('PDF Export: previewCard found:', !!previewCard)
      
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Find the template content (the div with min-h-screen class)
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      
      if (!templateContent) {
        showSnackbar('No template content found', 'error')
        return
      }
      
      console.log('PDF Export: templateContent found:', !!templateContent)

      // Clone and apply minimal styles
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Clean, minimal styles for PDF
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: auto;
        padding: 20mm;
        background: #ffffff;
        box-sizing: border-box;
      `
      
      // Remove ALL classes
      const stripClasses = (el: Element) => {
        (el as HTMLElement).removeAttribute('class')
        Array.from(el.children).forEach(child => stripClasses(child))
      }
      stripClasses(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate PDF
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
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

      document.body.removeChild(clone)
      console.log('PDF Export: Complete!')
      
      showSnackbar('PDF exported! Check downloads folder.')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
