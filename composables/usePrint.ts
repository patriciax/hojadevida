import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import html2pdf from 'html2pdf.js'
import { useCvState } from '~/data/useCvState'

export default function usePrint() {
  const { formSettings } = useCvState()
  const i18n = useI18n()
  const docTitle = ref<string>()

  onMounted(() => {
    const printMargin = cssPagedMedia('margin', '1.6in')
    docTitle.value = document.title

    addEventListener('beforeprint', () => {
      formSettings.value.layout === 'one-column' ? printMargin('0.45in') : printMargin('0in')
    })

    addEventListener('afterprint', () => {
      if (typeof docTitle.value === 'string')
        document.title = docTitle.value
    })

    addEventListener('keydown', (e) => {
      if (e.metaKey && e.key === 'p') {
        e.preventDefault()
        downloadPdf()
      }
    })
  })

  // function cssPagedMedia(property: string) {
  //   const style = document.createElement('style')
  //   document.head.appendChild(style)
  //   return function (value: string) {
  //     style.innerHTML = `@page {${property}: ${value}}`
  //   }
  // }

  function cssPagedMedia(property: string, bottomMargin: string, topMargin = '0.55in') {
    const style = document.createElement('style')
    document.head.appendChild(style)
    return function (value: string) {
      style.innerHTML = `@page {${property}: ${value}; margin-bottom: ${bottomMargin}; margin-top: ${topMargin}}`
    }
  }

  function downloadPdf(): void {
    changeDocTitle()
    window.print()
  }

  async function downloadPdfDirectly() {
    const element = document.getElementById('elemento-a-exportar')

    if (!element)
      return

    // Captura el elemento como imagen usando html2canvas
    html2canvas(element, {
      useCORS: true,
      scale: 2,
    }).then((canvas) => {
      const imgData = canvas.toDataURL(formSettings.value.profileImageDataUri)
      const pdf = new jsPDF('p', 'mm', 'a4')

      // Añade la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, pdf.internal.pageSize.getWidth() - 20, (canvas.height * (pdf.internal.pageSize.getWidth() - 20)) / canvas.width)

      // Guarda el PDF
      pdf.save(`CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}.pdf`)
    })
  }
  function changeDocTitle() {
    document.title = `CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`
  }

  return {
    downloadPdf,
    downloadPdfDirectly,
  }
}
