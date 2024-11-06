import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
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

  function downloadPdfDirectly(): void {
    changeDocTitle()

    const element = document.getElementById('elemento-a-exportar')

    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const imgWidth = pdfWidth * 0.9 // Ajusta según sea necesario
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const xOffset = (pdfWidth - imgWidth) / 2
      const yOffset = (pdf.internal.pageSize.getHeight() - imgHeight) / 2

      pdf.addImage(imgData, 'PNG', xOffset, yOffset, imgWidth, imgHeight)
      pdf.save(`CV_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`)
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
