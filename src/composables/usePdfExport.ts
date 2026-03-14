import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      showSnackbar('Preparing PDF...', 'info')

      // Use browser's PDF export via CDP
      // We'll trigger print and user can save as PDF
      // But first, let's prepare the page properly
      
      // Find the preview content (inside the preview card, the actual template content)
      const previewContent = document.querySelector('.preview-card > div') as HTMLElement
      
      if (!previewContent) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Create a clean print version
      const printContent = previewContent.cloneNode(true) as HTMLElement
      
      // Apply clean styles
      printContent.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        background: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #333;
        line-height: 1.6;
      `
      
      // Remove any overflow or hidden styles
      printContent.querySelectorAll('*').forEach((el) => {
        const htmlEl = el as HTMLElement
        const style = htmlEl.style
        if (style.overflow === 'hidden' || style.overflow === 'auto') {
          style.overflow = 'visible'
        }
        if (style.display === 'none') {
          style.display = ''
        }
      })

      document.body.appendChild(printContent)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Use window.print() - this will show the print dialog
      window.print()
      
      // Cleanup
      setTimeout(() => {
        try {
          document.body.removeChild(printContent)
        } catch (e) {}
      }, 1000)
      
      showSnackbar('Save as PDF from print dialog!')
    } catch (error) {
      console.error('Print Error:', error)
      showSnackbar('Print failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
