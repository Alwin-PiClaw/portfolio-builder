import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview content
      const previewContent = document.querySelector('.preview-card') as HTMLElement
      if (!previewContent) {
        showSnackbar('No preview content found', 'error')
        return
      }

      // Clone the element for export
      const clone = previewContent.cloneNode(true) as HTMLElement
      
      // Apply inline styles for clean PDF output
      clone.style.position = 'fixed'
      clone.style.left = '0'
      clone.style.top = '0'
      clone.style.width = '210mm'
      clone.style.zIndex = '-1'
      clone.style.background = '#ffffff'
      
      // Find the inner content and ensure it fills the page
      const innerContent = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (innerContent) {
        innerContent.style.minHeight = '297mm'
        innerContent.style.borderRadius = '0'
      }
      
      // Add to DOM temporarily
      document.body.appendChild(clone)
      
      // Wait for DOM to render
      await new Promise(resolve => setTimeout(resolve, 300))

      // Dynamic import html2pdf
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default

      const options = {
        margin: 0,
        filename: 'portfolio.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          windowWidth: 794
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { mode: 'css', before: '.page-break' }
      }

      await html2pdf().set(options).from(clone).save()
      
      // Clean up
      document.body.removeChild(clone)
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF export error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
