import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      showSnackbar('Generating PDF...', 'info')

      // Find ALL elements in the page that might be portfolio content
      // We need to find the root element of each template section
      
      // Method: Get the preview card, then get its FIRST child that contains portfolio content
      const previewCard = document.querySelector('.preview-card')
      console.log('PDF Export: previewCard found:', !!previewCard)
      
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // The template is rendered inside - we need to find the actual content div
      // Look for the div with inline styles that define the background/colors
      let templateRoot: HTMLElement | null = null
      
      // Find the first div inside preview-card that's a direct child and has style
      const directChildren = previewCard.children
      for (let i = 0; i < directChildren.length; i++) {
        const child = directChildren[i] as HTMLElement
        // Skip transition elements
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          const style = child.getAttribute('style') || ''
          // Look for elements that have portfolio-like styling
          if (style.includes('min-height') || style.includes('background') || style.includes('gradient')) {
            templateRoot = child
            console.log('PDF Export: Found template root:', child.tagName)
            break
          }
        }
      }
      
      // Fallback: use any substantial child
      if (!templateRoot && directChildren.length > 0) {
        for (let i = 0; i < directChildren.length; i++) {
          const child = directChildren[i] as HTMLElement
          if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            // Check if it has meaningful content (not just empty wrapper)
            if (child.children.length > 0 || child.textContent?.trim()) {
              templateRoot = child
              console.log('PDF Export: Using fallback child:', child.tagName)
              break
            }
          }
        }
      }
      
      if (!templateRoot) {
        showSnackbar('No template content found', 'error')
        return
      }

      // Clone and clean
      const clone = templateRoot.cloneNode(true) as HTMLElement
      
      // Apply minimal clean styles for PDF
      clone.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        background: #ffffff !important;
        box-sizing: border-box;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
        line-height: 1.5;
      `
      
      // Recursively remove ALL classes and clean ALL inline styles
      const cleanElement = (el: Element) => {
        const htmlEl = el as HTMLElement
        // Remove class entirely
        htmlEl.removeAttribute('class')
        // Reset all styles to clean values
        const keepStyles = ['display', 'flex-direction', 'justify-content', 'align-items', 'gap', 
                          'padding', 'margin', 'width', 'max-width', 'text-align',
                          'font-family', 'font-size', 'font-weight', 'color', 
                          'background-color', 'border-radius', 'min-height']
        const computed = window.getComputedStyle(el)
        let cleanStyle = ''
        keepStyles.forEach(prop => {
          try {
            const val = computed.getPropertyValue(prop)
            if (val && val !== '' && val !== '0px' && val !== 'normal') {
              // Skip gradient backgrounds and CSS variable references
              if (!val.includes('gradient') && !val.includes('var(')) {
                cleanStyle += `${prop}: ${val}; `
              }
            }
          } catch (e) {}
        })
        // Force white background
        if (el.tagName === 'DIV' || el.tagName === 'SECTION' || el.tagName === 'MAIN') {
          cleanStyle += 'background-color: #ffffff; '
        }
        htmlEl.style.cssText = cleanStyle
        // Process children
        Array.from(el.children).forEach(child => cleanElement(child))
      }
      
      cleanElement(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added, rendering...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default
      
      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 794
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(clone)
        .save()

      document.body.removeChild(clone)
      console.log('PDF Export: Complete!')
      
      showSnackbar('PDF exported!')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
