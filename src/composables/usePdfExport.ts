import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      // Find ONLY the preview section (right side of the screen)
      // The preview is in the second v-col, we need to find just the preview content
      const previewArea = document.querySelector('.preview-card')
      console.log('PDF Export: previewArea found:', !!previewArea)
      
      if (!previewArea) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Get the actual portfolio template content - skip the wrapper v-card
      // Look for elements that are part of the portfolio itself
      const templateContent = previewArea.querySelector('div[class*="min-h-screen"]') as HTMLElement
      
      if (!templateContent) {
        // Fallback: use first div that's a direct child
        const children = previewArea.querySelectorAll(':scope > *')
        for (const child of children) {
          const el = child as HTMLElement
          // Skip if it's a transition or wrapper
          if (el.tagName !== 'SCRIPT' && el.style.position !== 'fixed') {
            console.log('PDF Export: Using fallback element:', el.tagName)
            return generatePdf(el as HTMLElement, showSnackbar)
          }
        }
        showSnackbar('No template content found', 'error')
        return
      }
      
      console.log('PDF Export: templateContent found:', !!templateContent)
      
      await generatePdf(templateContent, showSnackbar)
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  const generatePdf = async (element: HTMLElement, showSnackbar: (text: string, color?: string) => void) => {
    try {
      showSnackbar('Generating PDF...', 'info')
      console.log('PDF Export: Creating clean clone...')

      // Clone the element
      const clone = element.cloneNode(true) as HTMLElement
      
      // Set clean A4 styles
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        background: white;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #333333;
        line-height: 1.6;
      `
      
      // Remove ALL class attributes
      const stripClasses = (el: Element) => {
        (el as HTMLElement).removeAttribute('class')
        Array.from(el.children).forEach(child => stripClasses(child))
      }
      stripClasses(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: 'avoid-all' }
        })
        .from(clone)
        .save()

      document.body.removeChild(clone)
      console.log('PDF Export: Complete!')
      
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('Generate PDF Error:', error)
      throw error
    }
  }

  return { exportPdf }
}
