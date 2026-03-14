import { usePortfolioStore } from '../stores/portfolio'

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    
    try {
      showSnackbar('Generating PDF...', 'info')

      const previewCard = document.querySelector('.preview-card')
      console.log('PDF Export: previewCard found:', !!previewCard)
      
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      // Find the template root
      let templateRoot: HTMLElement | null = null
      const directChildren = previewCard.children
      for (let i = 0; i < directChildren.length; i++) {
        const child = directChildren[i] as HTMLElement
        if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
          const style = child.getAttribute('style') || ''
          if (style.includes('min-height') || style.includes('background') || style.includes('gradient')) {
            templateRoot = child
            console.log('PDF Export: Found template root:', child.tagName)
            break
          }
        }
      }
      
      if (!templateRoot && directChildren.length > 0) {
        for (let i = 0; i < directChildren.length; i++) {
          const child = directChildren[i] as HTMLElement
          if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
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

      const clone = templateRoot.cloneNode(true) as HTMLElement
      
      // Clean styles for PDF
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
      
      const cleanElement = (el: Element) => {
        const htmlEl = el as HTMLElement
        htmlEl.removeAttribute('class')
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
              if (!val.includes('gradient') && !val.includes('var(')) {
                cleanStyle += `${prop}: ${val}; `
              }
            }
          } catch (e) {}
        })
        if (el.tagName === 'DIV' || el.tagName === 'SECTION' || el.tagName === 'MAIN') {
          cleanStyle += 'background-color: #ffffff; '
        }
        htmlEl.style.cssText = cleanStyle
        Array.from(el.children).forEach(child => cleanElement(child))
      }
      
      cleanElement(clone)
      
      document.body.appendChild(clone)
      console.log('PDF Export: Clone added, rendering...')
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Import jspdf directly to save with custom method
      const { jsPDF } = await import('jspdf')
      const html2canvasModule = await import('html2canvas')
      const html2canvas = html2canvasModule.default
      
      // Create canvas from clone
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 794
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)
      
      // Save to server-accessible location
      const pdfBlob = pdf.output('blob')
      
      // Create a download link - this will trigger browser download
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'portfolio.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      document.body.removeChild(clone)
      console.log('PDF Export: Complete!')
      
      showSnackbar('PDF exported to Downloads folder!')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
