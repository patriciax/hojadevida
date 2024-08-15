import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | 'readyPass' | null
  _error: any | null
  _data: any | null
  _formSettings: any | null
  _profile: any | null

}

export default defineStore({
  id: 'resumen',
  state: (): State => ({
    _status: null,
    _error: null,
    _data: null,
    _formSettings: null,
    _profile: null,

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isReady: state => state._status === 'ready',
    isError: state => state._status === 'error',
    isReadyPass: state => state._status === 'readyPass',
    error: state => state._error,
    data: state => state._data,
    userId: state => state._data.id,
    codeUrl: state => state._data.code_url,
    profile: state => state._profile,
    formSettings: state => state._formSettings,

  },
  actions: {
    async getPerson() {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.get(`api/v1/user/`, {
          headers: {
            'Authorization': `Token ${sessionStorage.getItem('access')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._data = response.data
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

    async getDataUser() {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.get(`api/v1/people/${this.userId}/`, {
          headers: {
            'Authorization': `Token ${sessionStorage.getItem('access')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._profile = response.data
          this._formSettings = response.data[0].formSettings
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
    async addPasswordCV(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.put(`api/v1/set-password/${this.userId}`, body, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('access')}`,
          },
        })
        if (response.status === 200)
          this.changeStatus('readyPass')

        else
          this.changeStatus('error', response)

        this.changeStatus('readyPass')
      }
      catch (error) {
        this.changeStatus('error', error)
      }
    },
    async addCvSettings(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.put(`api/v1/people/${this.userId}/`, body, {
          headers: {
            Authorization: `Token ${sessionStorage.getItem('access')}`,
          },
        })
        if (response.status === 200)

          this.changeStatus('ready')

        else
          this.changeStatus('error', response)

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