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

      // Create a clone for printing
      const clone = previewElement.cloneNode(true) as HTMLElement
      
      // Style the clone for print
      clone.style.position = 'fixed'
      clone.style.left = '0'
      clone.style.top = '0'
      clone.style.width = '100%'
      clone.style.zIndex = '99999'
      clone.style.background = '#fff'
      clone.style.padding = '10mm'
      clone.style.margin = '0'
      
      // Remove rounded corners from inner content
      const inner = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (inner) {
        inner.style.borderRadius = '0'
        inner.style.margin = '0'
        inner.style.padding = '10mm'
      }

      // Remove v-card overflow styling
      const card = clone.querySelector('.v-card') as HTMLElement
      if (card) {
        card.style.overflow = 'visible'
        card.style.borderRadius = '0'
      }

      // Add clone to page
      document.body.appendChild(clone)

      // Wait a bit for rendering
      await new Promise(resolve => setTimeout(resolve, 300))

      // Use html2pdf
      const html2pdf = (await import('html2pdf.js')).default

      await html2pdf()
        .set({
          margin: 5,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff'
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
