import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | 'readyPass' | 'loadingIA' | null
  _error: any | null
  _data: any | null
  _formSettings: any | null
  _profile: any | null
  _isPassword: boolean
  _codeUrl: string | null
  _textIA: string | null

}

export default defineStore({
  id: 'resumen',
  state: (): State => ({
    _status: null,
    _error: null,
    _data: null,
    _formSettings: null,
    _profile: null,
    _isPassword: false,
    _codeUrl: null,
    _textIA: '',

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isLoadingIA: state => state._status === 'loadingIA',
    isReady: state => state._status === 'ready',
    isError: state => state._status === 'error',
    isReadyPass: state => state._status === 'readyPass',
    error: state => state._error,
    data: state => state._data,
    userId: state => state._data.id,
    profile: state => state._profile,
    formSettings: state => state._formSettings,
    isPassword: state => state._isPassword,
    codeUrl: state => state._codeUrl,
    textIA: state => state._textIA,

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
          this._isPassword = response.data[0].profiles[0].is_password
          console.log(this._isPassword)

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
    async getDataUserExternal(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post(`/resume/`, body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._profile = response.data
          this._formSettings = response.data[0].formSettings
          this._codeUrl = response.data[0].code_url
          this._isPassword = response.data[0].profiles[0].is_password

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
    async getCvPassword(body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.post(`/share-resume/`, body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._isPassword = false
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
    async setPassword(id: any, body: any) {
      try {
        this.changeStatus('loading')

        const { $axios } = useNuxtApp()

        const response = await $axios.put(`api/v1/set-password/${id}`, body, {
          headers: {
            'Authorization': `Token ${sessionStorage.getItem('access')}`,
            'Content-Type': 'application/json',
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
    async getTextIA(body: any) {
      try {
        this.changeStatus('loadingIA')

        const { $axios } = useNuxtApp()

        const response = await $axios.post(`api/v1/edit-text`, body, {
          headers: {
            'Authorization': `Token ${sessionStorage.getItem('access')}`,
            'Content-Type': 'multipart/form-data',
          },
        })
        if (response.status === 200) {
          this._textIA = response.data.message

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
    changeStatus(status: 'loading' | 'ready' | 'readyPass' | 'loadingIA' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
