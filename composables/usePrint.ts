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

  async function downloadPdfDirectly(): void {
    changeDocTitle()
    const movilShareElements = document.querySelectorAll('.movil-share')
    movilShareElements.forEach((el) => {
      el.style.display = 'none'
    })

    const element = document.getElementById('elemento-a-exportar')
    if (!element)
      return

    // Usar html2canvas con CORS habilitado
    html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const imgWidth = pdfWidth * 0.9 // Ajusta según sea necesario
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // Calcular las posiciones iniciales
      let position = 0
      let heightLeft = imgHeight // Altura restante de la imagen

      // Añadir la primera página con la imagen
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdf.internal.pageSize.getHeight() // Restar la altura de la página

      // Si la imagen es más alta que la página, añade nuevas páginas
      while (heightLeft > 0) {
        position = heightLeft - imgHeight // Nueva posición para la siguiente página
        pdf.addPage() // Añadir nueva página
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight) // Añadir imagen en la nueva página
        heightLeft -= pdf.internal.pageSize.getHeight() // Restar altura de la página
      }

      // Guardar el PDF
      pdf.save(`HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`)
    }).catch((error) => {
      console.error('Error al capturar el elemento:', error)
    })
  }

  function changeDocTitle() {
    document.title = `HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`
  }

  return {
    downloadPdf,
    downloadPdfDirectly,
  }
}
