import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const _clientId: string = 'AVAZmjDIgZJmy994sXkIlU6mySapEEvHrKT9dJ-SohCjrZe0XknVuZkQ-AS1X-LKKxnXN7_RP36hTOjP'

  return new Promise<void>((resolve, reject) => {
    if ((window as any).paypal) {
      console.log('✅ PayPal SDK ya estaba cargado')
      return resolve()
    }

    const script: HTMLScriptElement = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${_clientId}`
    script.async = true
    script.onload = () => {
      console.log('✅ PayPal SDK cargado correctamente')
      resolve()
    }
    script.onerror = (error) => {
      console.error('❌ Error cargando PayPal SDK', error)
      reject(error)
    }

    document.head.appendChild(script)
  })
})
