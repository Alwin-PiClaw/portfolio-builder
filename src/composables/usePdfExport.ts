import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview card
      const previewCard = document.querySelector('.preview-card') as HTMLElement
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      showSnackbar('Opening print dialog...', 'info')

      // Clone the preview content
      const clone = previewCard.cloneNode(true) as HTMLElement
      
      // Apply print-specific styles
      clone.style.position = 'fixed'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.width = '210mm'
      clone.style.background = '#fff'
      clone.style.padding = '20mm'
      
      // Make inner content full width
      const inner = clone.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (inner) {
        inner.style.minHeight = 'auto'
        inner.style.padding = '0'
        inner.style.borderRadius = '0'
      }

      // Remove card styling
      const vCard = clone.querySelector('.v-card') as HTMLElement
      if (vCard) {
        vCard.style.borderRadius = '0'
        vCard.style.boxShadow = 'none'
      }

      // Add to page
      document.body.appendChild(clone)

      // Wait a moment for rendering
      await new Promise(resolve => setTimeout(resolve, 200))

      // Trigger print dialog
      window.print()

      // Cleanup after print dialog closes (or immediately)
      setTimeout(() => {
        try {
          document.body.removeChild(clone)
        } catch (e) {}
      }, 1000)
      
      showSnackbar('Use "Save as PDF" in print dialog!')
    } catch (error) {
      console.error('Print Error:', error)
      showSnackbar('Print failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
