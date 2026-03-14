import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting with jsPDF...')
    
    try {
      showSnackbar('Generating PDF...', 'info')

      // Find the preview content
      const previewCard = document.querySelector('.preview-card')
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Get template content
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (!templateContent) {
        showSnackbar('No template found', 'error')
        return
      }

      console.log('PDF Export: Found template')

      // Import libraries
      const html2canvasModule = await import('html2canvas')
      const jspdfModule = await import('jspdf')
      
      const html2canvas = html2canvasModule.default
      const { jsPDF } = jspdfModule

      // Create canvas with high quality
      const canvas = await html2canvas(templateContent, {
        scale: 3,  // Higher scale = better quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794
      })

      console.log('PDF Export: Canvas created')

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0)
      
      // If content fits on one page
      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        // Multi-page
        let heightLeft = imgHeight
        let position = 0
        
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        
        while (heightLeft > 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }
      }

      console.log('PDF Export: Saving...')

      // Save
      pdf.save('portfolio.pdf')
      
      console.log('PDF Export: Complete!')
      showSnackbar('PDF exported!')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
