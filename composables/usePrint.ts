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

  async function waitForImagesToLoad(container: HTMLElement): Promise<void> {
    const images = container.querySelectorAll('img')
    const promises = Array.from(images).map((img) => {
      if (img.complete && img.naturalWidth !== 0)
        return Promise.resolve()

      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error(`Error loading image: ${img.src}`))
      })
    })
    await Promise.all(promises)
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
        el.style.fontFamily = 'Arial, sans-serif'
        if (selector !== '.font-selected')
          el.style.display = 'none'
      })
    })

    const element = document.getElementById('elemento-a-exportar')
    if (!element) {
      console.error('El elemento no existe en el DOM')
      return
    }
    await waitForImagesToLoad(element)

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
      })

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const marginLeft = 10 // Margen izquierdo en mm
      const marginRight = 10 // Margen derecho en mm
      const marginTop = 10 // Margen superior en mm (para la primera página)
      const marginBottom = 10 // Margen inferior en mm

      const imgWidth = pdfWidth - (marginLeft + marginRight) // Ajusta el ancho de la imagen
      const imgHeight = (canvas.height * imgWidth) / canvas.width // Ajusta el alto de la imagen

      // Calcula cuántas páginas necesitas
      const pagesNeeded = Math.ceil(imgHeight / (pdfHeight - (marginTop + marginBottom)))

      // Itera sobre las páginas necesarias
      for (let i = 0; i < pagesNeeded; i++) {
        // Añade una página si no es la primera
        if (i > 0)
          pdf.addPage()

        // Calcula el alto de la sección actual
        const sectionHeight = Math.min(pdfHeight - (marginTop + marginBottom), imgHeight - (i * (pdfHeight - (marginTop + marginBottom))))

        // Crea un nuevo canvas para la sección actual
        const sectionCanvas = document.createElement('canvas')
        sectionCanvas.width = canvas.width
        sectionCanvas.height = sectionHeight * (canvas.width / imgWidth) // Ajusta el alto del canvas de la sección

        const ctx = sectionCanvas.getContext('2d')
        ctx.drawImage(canvas, 0, i * (pdfHeight - (marginTop + marginBottom)) * (canvas.width / imgWidth), canvas.width, sectionHeight * (canvas.width / imgWidth), 0, 0, sectionCanvas.width, sectionCanvas.height)

        // Convierte el canvas de la sección a una imagen
        const sectionImgData = sectionCanvas.toDataURL('image/jpeg', 0.7)

        // Añade la imagen de la sección al PDF
        pdf.addImage(sectionImgData, 'JPEG', marginLeft, marginTop, imgWidth, sectionHeight)
      }

      pdf.save(`HOJA_DE_VIDA_${formSettings.value.name}_${formSettings.value.lastName}_${i18n.locale.value}`)
    }
    catch (error) {
      console.error('Error al generar PDF:', error)
    }
    finally {
      // Restaurar la visibilidad de los elementos
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
