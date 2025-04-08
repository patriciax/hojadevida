<script setup>
import { onMounted, ref } from 'vue'
import UsePaypalStore from '@/stores/paypal'

const emit = defineEmits(['success', 'error', 'loading', 'close'])
const usePaypalStore = UsePaypalStore()
const clientId = 'AVAZmjDIgZJmy994sXkIlU6mySapEEvHrKT9dJ-SohCjrZe0XknVuZkQ-AS1X-LKKxnXN7_RP36hTOjP'

const isLoading = ref(true)
const buttonContainerId = 'paypal-button-container'

// Cargar el SDK de PayPal
function loadPayPalScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`))
      return resolve()

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = resolve
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Inicializar el botón de PayPal
function initPayPalButton() {
  const paypal = window.paypal
  if (!paypal) {
    console.error('PayPal SDK no está disponible.')
    emit('error', new Error('PayPal SDK no está disponible'))
    return
  }

  paypal.Buttons({
    fundingSource: paypal.FUNDING.PAYPAL,
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'pill',
      label: 'paypal',
      height: 45,
    },
    createOrder(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: '20.00' },
        }],
      })
    },
    onApprove(data, actions) {
      return actions.order.capture().then(async (response) => {
        // emit('success', details)
        const transaction = response
        const plan = {
          plan: 3,
          person: 4,
          amount: 20,
          currency: 1,
          status: 'approved',
          response_payment: { ...transaction },
        }

        if (transaction.purchase_units[0].payments.captures[0].status === 'COMPLETED') {
          // successPayment.value = true
          console.log('✅ Pago exitoso:', transaction)
          await usePaypalStore.registerPayment(plan)
          // useNuxtApp().$toast.success('¡Pago exitoso!')
          emit('success')
        }
        else {
          // errorPayment.value = true
          console.log('❌ Pago fallido:', transaction)
          // useNuxtApp().$toast.error('Error al realizar el pago, intenta de nuevo')
          emit('error')
        }
      })
    },
    onError(err) {
      console.error('Error en PayPal:', err)
      emit('error')
    },
  }).render(`#${buttonContainerId}`)
}

onMounted(async () => {
  emit('loading', true)
  try {
    await loadPayPalScript(`https://www.paypal.com/sdk/js?client-id=${clientId}`)
    initPayPalButton()
  }
  catch (err) {
    emit('error', err)
  }
  finally {
    isLoading.value = false
    emit('loading', false)
  }
})
</script>

<template>
  <div class="w-full">
    <div v-if="isLoading" class="text-center py-4">
      Cargando PayPal...
    </div>
    <div v-show="!isLoading" :id="buttonContainerId" />
    <!--
    <button
      :disabled="isLoadingPaypal"
      class="group relative h-12 w-full mb-4 rounded bg-blue-600 px-5 py-2 text-center text-sm font-medium text-white shadow-md  "
    >
      <div v-if="isLoading" class="flex justify-center">
        Cargando PayPal...
      </div>
      <template v-else>
        <div :id="buttonContainerId" class="absolute -mt-2 w-full opacity-0" />
        Elegir plan
      </template>
    </button> -->
  </div>
</template>
