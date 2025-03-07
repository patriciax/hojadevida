<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from '#app'
import { useI18n } from '#imports'

import { useScriptLoader } from '@/composables/useScriptLoader'

const emit = defineEmits(['close'])
// const config = useRuntimeConfig()

const { loadScript } = useScriptLoader()
const successPayment = ref(false)
const errorPayment = ref(false)
const isLoadingPaypal = ref(false)
const _clientId = 'AVAZmjDIgZJmy994sXkIlU6mySapEEvHrKT9dJ-SohCjrZe0XknVuZkQ-AS1X-LKKxnXN7_RP36hTOjP'

function initiatePayPalPayment() {
  paypal
    .Buttons({
      fundingSource: paypal.FUNDING.PAYPAL,
      style: {
        layout: 'horizontal',
        color: 'white',
        label: 'paypal',
        height: 55,
        with: '100%',
      },
      createOrder(data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: 20,
              },
            },
          ],
        })
      },
      onApprove(data, actions) {
        return actions.order.capture().then(async (response) => {
          const transaction = response

          transaction.purchase_units[0].payments.captures[0].status === 'COMPLETED'
            ? (successPayment.value = true)
            : (errorPayment.value = true)

          //   await storePayment.registerPayment({
          //     uuid: router.currentRoute.value.params.uuid,
          //     type: 'paypal',
          //     transaction,
          //   })

          //   if (storePayment.isError) {
          //     pushNotification({
          //       id: '',
          //       title: t('PAYMENT_METHODS.ERROR'),
          //       type: 'error',
          //     })
          //   }
          emit('close')
          isLoadingPaypal.value = false
        })
      },
      onError(err) {
        if (!import.meta.env.PROD)
          console.error(err)

        isLoadingPaypal.value = false
        emit('close')
      },
    })

    .render('#paypal-button-container')
}

async function loadScripts(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = resolve
    document.head.appendChild(script)
  })
}

// En tu componente Paypal.vue
onMounted(async () => {
  await loadScripts(`https://www.paypal.com/sdk/js?client-id=${_clientId}`)
  initiatePayPalPayment()
})
</script>

<template>
  <div>
    <button
      :disabled="isLoadingPaypal"
      class="group relative h-12 w-full mb-4 rounded bg-blue-600 px-5 py-2 text-center text-sm font-medium text-white shadow-md  "
    >
      <div v-if="isLoadingPaypal" class="flex justify-center">
        load
      </div>
      <template v-else>
        <div id="paypal-button-container" class="absolute -mt-2 w-full opacity-0" />
        Elegir plan
      </template>
    </button>
  </div>
</template>
