import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | 'readyPass' | null
  _error: any | null
  _country: any | null
  _city: any | null

}

export default defineStore({
  id: 'address',
  state: (): State => ({
    _status: null,
    _error: null,
    _country: null,
    _city: null,

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isReady: state => state._status === 'ready',
    isError: state => state._status === 'error',
    isReadyPass: state => state._status === 'readyPass',
    error: state => state._error,
    country: state => state._country,
    city: state => state._city,

  },
  actions: {

    async getCountry() {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.get(`/country/`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._country = response.data
          this.changeStatus('ready')
        }
        else {
          this.changeStatus('error', response)
        }

        this.changeStatus('ready')
      }
      catch (error) {
        this.changeStatus('error', error)
      }
    },
    async getCity(_id: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.get(`/city/?field=country_id&value=${_id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._city = response.data
          this.changeStatus('ready')
        }
        else {
          this.changeStatus('error', response)
        }

        this.changeStatus('ready')
      }
      catch (error) {
        this.changeStatus('error', error)
      }
    },
    changeStatus(status: 'loading' | 'ready' | 'readyPass' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
