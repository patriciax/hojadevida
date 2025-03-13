import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useCvState } from '~/data/useCvState'
import 'jspdf-autotable'

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

  // async function downloadPdfDirectly(): void {
  //   changeDocTitle()
  //   const movilShareElements = document.querySelectorAll('.movil-share')
  //   movilShareElements.forEach((el) => {
  //     el.style.display = 'none'
  //   })

  //   const element = document.getElementById('elemento-a-exportar')
  //   if (!element)
  //     return

  //   // Usar html2canvas con CORS habilitado
  //   html2canvas(element, { useCORS: true, scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png')

  //     const pdf = new jsPDF({
  //       orientation: 'portrait',
  //       unit: 'mm',
  //       format: 'a4',
  //     })

  //     const pdfWidth = pdf.internal.pageSize.getWidth()
  //     const imgWidth = pdfWidth * 0.9 // Ajusta según sea necesario
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width

  //     // Calcular las posiciones iniciales
  //     let position = 0
  //     let heightLeft = imgHeight // Altura restante de la imagen

  //     // Añadir la primera página con la imagen
  //     pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  //     heightLeft -= pdf.internal.pageSize.getHeight() // Restar la altura de la página

  //     // Si la imagen es más alta que la página, añade nuevas páginas
  //     while (heightLeft > 0) {
  //       position = heightLeft - imgHeight // Nueva posición para la siguiente página
  //       pdf.addPage() // Añadir nueva página
  //       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight) // Añadir imagen en la nueva página
  //       heightLeft -= pdf.internal.pageSize.getHeight() // Restar altura de la página
  //     }

  //     // Guardar el PDF
  //     pdf.save(`HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`)
  //   }).catch((error) => {
  //     console.error('Error al capturar el elemento:', error)
  //   })
  // }

  function changeDocTitle() {
    document.title = `HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`
  }

  async function downloadPdfDirectly(): Promise<void> {
    // Cambiar el título del documento
    changeDocTitle()

    // Ocultar elementos no deseados durante la exportación
    const movilShareElements = document.querySelectorAll('.movil-share')
    movilShareElements.forEach((el) => {
      el.style.display = 'none'
    })
    const stylesToHide = [
      '.cv__section-title .bg-change',
      '.cv__icon-wrapper a:nth-child(1)',
      '.cv__icon',
      '.cv__event svg',
      '.font-selected',
    ]

    stylesToHide.forEach((selector) => {
      const elements = document.querySelectorAll(`#elemento-a-exportar ${selector}`)
      elements.forEach((el) => {
        // Cambiar el estilo de la fuente a Arial
        el.style.fontFamily = 'Arial, sans-serif'
        // Si deseas ocultar otros elementos, puedes hacerlo aquí
        if (selector !== '.font-selected')
          el.style.display = 'none' // Oculta otros elementos, excepto aquellos con .font-selected
      })
    })

    const element = document.getElementById('elemento-a-exportar')
    if (!element) {
      console.error('El elemento no existe en el DOM')
      return
    }

    try {
      // Capturar el contenido del elemento con html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Aumenta la escala para mejor calidad
        useCORS: true, // Habilitar CORS si hay recursos externos
        logging: true, // Habilitar logs para depuración
      })

      // Convertir la captura a una imagen en base64
      const imgData = canvas.toDataURL('image/png')

      // Crear un nuevo documento PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // Medidas del PDF
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      // Dimensiones de la imagen capturada
      const imgWidth = pdfWidth // Ajustar al ancho del PDF
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let position = 0
      let heightLeft = imgHeight

      // Añadir la primera página con la imagen capturada
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight

      // Si la imagen es más alta que el tamaño de una página, añadir nuevas páginas
      while (heightLeft > 0) {
        position -= pdfHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight
      }

      // Guardar el archivo PDF
      pdf.save(`HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`)
    }
    catch (error) {
      console.error('Error al generar PDF:', error)
    }
    finally {
      // Restaurar los estilos originales después de generar el PDF
      movilShareElements.forEach((el) => {
        el.style.display = ''
      })

      stylesToHide.forEach((selector) => {
        const elements = document.querySelectorAll(`#elemento-a-exportar ${selector}`)
        elements.forEach((el) => {
          el.style.display = ''
        })
      })
    }
  }
  return {
    downloadPdf,
    downloadPdfDirectly,
  }
}
