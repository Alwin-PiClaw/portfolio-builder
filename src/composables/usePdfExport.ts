import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      // Find the preview card
      const previewCard = document.querySelector('.preview-card')
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Get the template content
      const templateContent = previewCard.querySelector('[class*="min-h-screen"]') as HTMLElement
      if (!templateContent) {
        showSnackbar('No template found', 'error')
        return
      }

      // Create a clone for printing
      const clone = templateContent.cloneNode(true) as HTMLElement
      
      // Remove all fixed/absolute positioning for print
      clone.style.position = 'static'
      clone.style.left = 'auto'
      clone.style.top = 'auto'
      
      // Remove classes but keep structure
      const removeClasses = (el: Element) => {
        (el as HTMLElement).removeAttribute('class')
        Array.from(el.children).forEach(removeClasses)
      }
      removeClasses(clone)
      
      // Replace the body with just our content
      const originalBody = document.body.innerHTML
      document.body.innerHTML = ''
      document.body.appendChild(clone)
      
      // Add print styles
      const style = document.createElement('style')
      style.textContent = `
        @media print {
          body { margin: 0; padding: 20mm; }
          @page { margin: 0; size: A4; }
        }
      `
      document.head.appendChild(style)
      
      // Trigger print dialog
      window.print()
      
      // Restore original body after print dialog closes
      setTimeout(() => {
        document.body.innerHTML = originalBody
        style.remove()
      }, 1000)
      
      showSnackbar('Use "Save as PDF" in print dialog!')
    } catch (error) {
      console.error('Print Error:', error)
      showSnackbar('Print failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
