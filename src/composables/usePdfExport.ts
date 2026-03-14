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

      // Get the template content - the actual portfolio
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      
      if (!templateContent) {
        showSnackbar('No template content found', 'error')
        return
      }
      
      console.log('PDF Export: templateContent found')

      // Clone the element
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Just set position, let original CSS work
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      
      // Only remove classes from root, keep children classes
      clone.removeAttribute('class')
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use html2pdf
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      await html2pdf()
        .set({
          margin: 10,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 1,  // Use scale 1 for better accuracy
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
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
