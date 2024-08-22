import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | null
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
    isError: state => state._status === 'error',
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
    reset() {
      this._token = null
      this._authenticated = false
      sessionStorage.removeItem('access')
      sessionStorage.removeItem('access_expiration')
      navigateTo('/login')
    },
    changeStatus(status: 'loading' | 'ready' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
