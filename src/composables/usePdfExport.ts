import { usePortfolioStore } from '../stores/portfolio'

/** html2canvas cannot parse CSS Color 4 `color()`. Resolve to rgb/#hex via canvas. */
function safeColorForCanvas(cssColor: string): string {
  if (!cssColor || cssColor === 'transparent' || cssColor === 'none') return cssColor || 'transparent'
  try {
    const c = document.createElement('canvas').getContext('2d')
    if (!c) return '#000000'
    c.fillStyle = '#000'
    c.fillStyle = cssColor
    const out = c.fillStyle as string
    if (out.startsWith('#') || out.startsWith('rgb')) return out
    return '#000000'
  } catch {
    return '#000000'
  }
}

function sanitizeCloneForHtml2Canvas(clonedRoot: HTMLElement) {
  const win = clonedRoot.ownerDocument.defaultView || window
  const nodes: HTMLElement[] = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>('*'))]
  const kebab = (camel: string) =>
    camel.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
  for (const el of nodes) {
    const cs = win.getComputedStyle(el)
    const set = (prop: string, val: string) => {
      if (!val || val === 'none') return
      let v = val
      if (/color\(|lab\(|oklch\(|lch\(/i.test(v)) v = safeColorForCanvas(v)
      try {
        el.style.setProperty(kebab(prop), v, 'important')
      } catch {
        /* ignore */
      }
    }
    set('color', cs.color)
    set('backgroundColor', cs.backgroundColor)
    set('borderTopColor', cs.borderTopColor)
    set('borderRightColor', cs.borderRightColor)
    set('borderBottomColor', cs.borderBottomColor)
    set('borderLeftColor', cs.borderLeftColor)
    set('outlineColor', cs.outlineColor)
    set('textDecorationColor', cs.textDecorationColor)
    set('columnRuleColor', cs.columnRuleColor)
    set('caretColor', cs.caretColor)
    // box-shadow / backgrounds can embed color(); html2canvas throws on parse
    if (cs.boxShadow && cs.boxShadow !== 'none') {
      try {
        el.style.setProperty('box-shadow', 'none', 'important')
      } catch {
        /* ignore */
      }
    }
    const bgImg = cs.backgroundImage
    if (bgImg && bgImg !== 'none' && /gradient|url|color\(/i.test(bgImg)) {
      try {
        el.style.setProperty('background-image', 'none', 'important')
        el.style.setProperty('background-color', safeColorForCanvas(cs.backgroundColor), 'important')
      } catch {
        /* ignore */
      }
    }
  }
}

export function usePdfExport(
  _store: ReturnType<typeof usePortfolioStore>,
  showSnackbar: (text: string, color?: string) => void
) {
  const exportPdf = async () => {
    console.log('PDF Export: Starting...')
    // #region agent log
    const _dbg = (hypothesisId: string, message: string, data: Record<string, unknown>) => {
      fetch('http://localhost:7876/ingest/29bc1ef0-2f7c-4a49-9ce3-c9a403b799af', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '68036d' },
        body: JSON.stringify({
          sessionId: '68036d',
          location: 'usePdfExport.ts',
          message,
          data,
          timestamp: Date.now(),
          hypothesisId,
        }),
      }).catch(() => {})
    }
    // #endregion

    try {
      showSnackbar('Generating PDF...', 'info')

      const previewCard = document.querySelector('.preview-card')
      if (!previewCard) {
        showSnackbar('No preview found', 'error')
        return
      }

      const templateContent = (previewCard.querySelector('[class*="min-h-screen"]') ||
        previewCard.querySelector('.preview-content')) as HTMLElement | null
      if (!templateContent) {
        showSnackbar('No template found', 'error')
        return
      }

      // Capture in-place: visible DOM keeps Vuetify/Tailwind classes + layout.
      // Offscreen clone + stripClasses caused blank PDF (html2canvas + stripped layout).
      templateContent.scrollIntoView({ block: 'start', behavior: 'auto' })
      const r = templateContent.getBoundingClientRect()
      // #region agent log
      _dbg('H6', 'capture_source_in_place', {
        runId: 'empty-pdf-fix',
        w: Math.round(r.width),
        h: Math.round(r.height),
        textLen: (templateContent.innerText || '').length,
      })
      // #endregion

      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))

      const html2pdfModule = await import('html2pdf.js')
      const html2pdf = html2pdfModule.default

      await html2pdf()
        .set({
          margin: 0,
          filename: 'portfolio.pdf',
          image: { type: 'jpeg', quality: 0.92 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            onclone: (_clonedDoc: Document, clonedEl: HTMLElement) => {
              sanitizeCloneForHtml2Canvas(clonedEl)
            },
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(templateContent)
        .save()

      // #region agent log
      _dbg('H4', 'pdf_save_success', { runId: 'empty-pdf-fix', ok: true })
      // #endregion

      showSnackbar('PDF exported!')
    } catch (error) {
      console.error('PDF Export Error:', error)
      // #region agent log
      _dbg('H5', 'pdf_catch', {
        errName: (error as Error)?.name,
        errMessage: String((error as Error)?.message || error).slice(0, 200),
      })
      // #endregion
      showSnackbar('Export failed: ' + (error as Error).message, 'error')
    }
  }

  return { exportPdf }
}
