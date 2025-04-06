import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | null
  _error: any | null
  _data: any | null

}

export default defineStore({
  id: 'payment',
  state: (): State => ({
    _status: null,
    _error: null,
    _data: null,

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isReady: state => state._status === 'ready',
    isError: state => state._status === 'error',
    error: state => state._error,
    data: state => state._data,

  },
  actions: {

    async registerPayment(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post(`api/v1/payment`, body, {
          headers: {
            'Authorization': `Token ${sessionStorage.getItem('access')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._data = response.data

          this.changeStatus('ready')
          useNuxtApp().$toast.success('¡Pago exitoso!')
        }
        else {
          this.changeStatus('error', response)
        }

        this.changeStatus('ready')
      }
      catch (error) {
        this.changeStatus('error', error)
        useNuxtApp().$toast.error('Error al realizar el pago')
      }
    },
    changeStatus(status: 'loading' | 'ready' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
