import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      showSnackbar('Generating PDF...', 'info')

      // Find the preview card
      const previewCard = document.querySelector('.preview-card')
      console.log('PDF Export: previewCard found:', !!previewCard)
      
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Find the template content
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (!templateContent) {
        showSnackbar('No template found', 'error')
        return
      }
      
      console.log('PDF Export: template found')

      // Clone and prepare
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Simple styling - just position it offscreen
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      
      // Remove class to use computed styles
      const stripClasses = (el: Element) => {
        (el as HTMLElement).removeAttribute('class')
        Array.from(el.children).forEach(stripClasses)
      }
      stripClasses(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use html2pdf.js
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      console.log('PDF Export: Generating PDF...')
      
      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 1.0 },
          html2canvas: { 
            scale: 1,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(clone)
        .save()

      document.body.removeChild(clone)
      console.log('PDF Export: Complete!')
      
      showSnackbar('PDF exported!')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
