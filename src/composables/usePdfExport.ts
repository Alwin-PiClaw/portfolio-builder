import type { usePortfolioStore } from '../stores/portfolio'

function applyComputedStylesToClone(original: HTMLElement, clone: HTMLElement) {
  if (original.nodeType !== 1 || clone.nodeType !== 1) return
  const computed = window.getComputedStyle(original)
  const style = (clone as HTMLElement).style
  const props = [
    'color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor',
    'outlineColor', 'fill', 'stroke', 'width', 'height', 'minHeight', 'maxWidth', 'padding', 'paddingTop', 'paddingRight',
    'paddingBottom', 'paddingLeft', 'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'boxSizing',
    'fontSize', 'fontWeight', 'fontFamily', 'lineHeight', 'textAlign', 'borderWidth', 'borderStyle', 'borderRadius',
    'boxShadow', 'display', 'flexDirection', 'alignItems', 'justifyContent', 'gap', 'flexWrap'
  ]
  props.forEach(prop => {
    const k = prop.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '')
    const value = computed.getPropertyValue(k)
    if (value) (style as any)[prop] = value
  })
  const origChildren = Array.from(original.children) as HTMLElement[]
  const cloneChildren = Array.from(clone.children) as HTMLElement[]
  origChildren.forEach((origChild, i) => {
    if (cloneChildren[i]) applyComputedStylesToClone(origChild, cloneChildren[i])
  })
}

export function usePdfExport(
  store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    try {
      const previewCard = document.querySelector('.preview-card') as HTMLElement
      if (!previewCard) {
        showSnackbar('No preview content found', 'error')
        return
      }

      const content = previewCard.cloneNode(true) as HTMLElement
      applyComputedStylesToClone(previewCard, content)
      content.style.width = '210mm'
      content.style.maxWidth = '210mm'
      content.style.margin = '0'
      content.style.padding = '20mm'

      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: 10,
        filename: 'portfolio.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          onclone: (_clonedDoc: Document) => {
            const head = _clonedDoc.head
            if (head) head.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove())
          }
        },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }

      await html2pdf().set(opt).from(content).save()
      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF export error:', error)
      showSnackbar('PDF export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
