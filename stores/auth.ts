import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | 'readydni' | 'errordni' | null
  _error: any | null
  _token: string | null
  _authenticated: boolean

}

export default defineStore({
  id: 'oauth',
  state: (): State => ({
    _status: null,
    _error: null,
    _token: null,
    _authenticated: false,

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isReady: state => state._status === 'ready',
    isReadyDni: state => state._status === 'readydni',
    isError: state => state._status === 'error',
    isErrorDni: state => state._status === 'errordni',
    error: state => state._error,
    token: state => state._token,
    authenticated: state => state._authenticated,

  },
  actions: {
    hydrate() {
      const token = sessionStorage.getItem('access')
      const expiration = sessionStorage.getItem('access_expiration')

      // Verificar si el token ha expirado
      if (token && expiration && Date.now() < Number(expiration)) {
        this._token = token
        this._authenticated = true
      }
      else {
        // El token ha expirado
        this._token = null
        this._authenticated = false
        sessionStorage.removeItem('access')
        sessionStorage.removeItem('access_expiration')
      }
    },

    async login(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post('signin/', body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._token = response.data.token
          this._authenticated = true
          const expiration = Date.now() + (30 * 60 * 1000)
          sessionStorage.setItem('access', response.data.token)
          sessionStorage.setItem('access_expiration', expiration.toString())
          this.changeStatus('ready')
        }
        else {
          this.changeStatus('error', response)
        }

        this.changeStatus('ready')
      }
      catch (error: any) {
        this.changeStatus('error', error.response.data)
      }
    },
    async loginTest(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post('signin/', body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._token = response.data.token
          this._authenticated = true
          const expiration = Date.now() + (30 * 60 * 1000)
          sessionStorage.setItem('access', response.data.token)
          sessionStorage.setItem('access_expiration', expiration.toString())
          this.changeStatus('ready')
        }
        else {
          this.changeStatus('error', response)
        }

        this.changeStatus('ready')
      }
      catch (error: any) {
        this.changeStatus('error', error.response.data)
      }
    },

    async register(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post('signup/', body)
        if (response.status === 200 || response.status === 201)
          this.changeStatus('ready')

        else
          this.changeStatus('error')

        this.changeStatus('ready')
      }
      catch (error: any) {
        this.changeStatus('error', error.response.data.messages.errors)
      }
    },
    async validationDNI(body: any) {
      this.changeStatus('loading') // Cambia a loading al inicio

      try {
        const { $axios } = useNuxtApp()

        const response = await $axios.post('validation/dni', {
          dni: body,
        })
        console.log(response)

        if (response.status === 200 || response.status === 201)
          this.changeStatus('readydni') // Cambia a readydni si la validación es exitosa
        else if (response.status === 409)
          this.changeStatus('errordni') // Cambia a errordni si hay un conflicto
        else
          this.changeStatus('errordni') // Manejo por defecto
      }
      catch (error: any) {
        this.changeStatus('errordni', error.response.data.messages.errors) // Cambia a errordni en caso de error
      }
    },
    reset() {
      this._token = null
      this._authenticated = false
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('access_expiration')
      navigateTo('/login')
    },
    changeStatus(status: 'loading' | 'ready' | 'readydni' | 'errordni' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
