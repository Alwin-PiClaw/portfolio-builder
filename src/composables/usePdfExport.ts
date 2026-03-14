import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview card element
      const previewCard = document.querySelector('.preview-card') as HTMLElement
      if (!previewCard) {
        showSnackbar('No preview content found', 'error')
        return
      }

      // Create a clone for export without overflow issues
      const clone = previewCard.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.width = '794px' // A4 width in pixels at 96dpi
      clone.style.maxWidth = 'none'
      clone.style.overflow = 'visible'
      
      // Remove rounded corners and shadows for PDF
      const cloneCard = clone.querySelector('.preview-content, [class*="min-h-screen"]') as HTMLElement
      if (cloneCard) {
        cloneCard.style.borderRadius = '0'
      }
      
      // Remove any overflow hidden
      clone.style.overflow = 'visible'
      
      document.body.appendChild(clone)

      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 500))

      // Import html2pdf dynamically
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default

      const opt = {
        margin: [5, 5, 5, 5], // Top, left, bottom, right in mm
        filename: 'portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          windowWidth: 794,
          scrollY: 0,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      }

      await html2pdf().set(opt).from(clone).save()

      // Clean up
      document.body.removeChild(clone)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF export error:', error)
      showSnackbar('PDF export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
