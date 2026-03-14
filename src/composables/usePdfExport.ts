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
      
      // Set styles for PDF-like output
      clone.style.position = 'fixed'
      clone.style.left = '0'
      clone.style.top = '0'
      clone.style.width = '210mm'
      clone.style.zIndex = '9999'
      clone.style.background = '#ffffff'
      clone.style.padding = '0'
      clone.style.margin = '0'
      
      // Find and flatten the inner content
      const innerContent = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (innerContent) {
        innerContent.style.borderRadius = '0'
        innerContent.style.margin = '0'
        innerContent.style.padding = '20mm'
      }

      // Add clone to body
      document.body.appendChild(clone)

      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, 500))

      // Import html2pdf
      const html2pdf = (await import('html2pdf.js')).default

      const opt = {
        margin: 0,
        filename: 'portfolio.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 794
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      }

      await html2pdf().set(opt).from(clone).save()

      // Cleanup
      document.body.removeChild(clone)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Error:', error)
      
      // Fallback: try using browser print
      try {
        showSnackbar('Trying alternative method...', 'warning')
        window.print()
      } catch (printError) {
        showSnackbar('Export failed: ' + (error as Error).message, 'error')
      }
    }
  }

  return { exportPdf }
}
