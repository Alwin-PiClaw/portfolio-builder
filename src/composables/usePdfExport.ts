import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting with dom-to-image...')
    
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

      // Import dom-to-image-more and jspdf
      const domToImage = await import('dom-to-image-more')
      const jspdfModule = await import('jspdf')
      const { jsPDF } = jspdfModule

      // Generate image from DOM
      console.log('PDF Export: Generating image...')
      const dataUrl = await domToImage.toJpeg(templateContent, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      })

      console.log('PDF Export: Image generated, creating PDF...')

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // Calculate dimensions
      const pageWidth = 210
      const pageHeight = 297
      
      // Add image to PDF
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pageWidth, pageHeight)

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
