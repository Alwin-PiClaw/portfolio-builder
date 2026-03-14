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

      // Show loading
      showSnackbar('Generating PDF...', 'info')

      // Import libraries
      const html2canvasModule = await import('html2canvas')
      const jspdfModule = await import('jspdf')
      
      const html2canvas = html2canvasModule.default
      const { jsPDF } = jspdfModule

      // Create a clone for export
      const clone = previewElement.cloneNode(true) as HTMLElement
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.width = '794px' // A4 width at 96 DPI
      clone.style.background = '#ffffff'
      
      // Remove rounded corners
      const content = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (content) {
        content.style.borderRadius = '0'
      }
      
      document.body.appendChild(clone)

      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 200))

      // Generate canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        logging: false
      })

      // Clean up clone
      document.body.removeChild(clone)

      // Create PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210 // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      pdf.save('portfolio.pdf')

      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
