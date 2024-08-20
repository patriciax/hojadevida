import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useNuxtApp } from '#app'

interface State {
  _status: 'loading' | 'ready' | 'error' | null
  _error: any | null
  _fonts: any | null
  _currentFont: any | null
}

export default defineStore({
  id: 'fonts',
  state: (): State => ({
    _status: null,
    _error: null,
    _fonts: [
      'Abril Fatface',
      'Barlow',
      'Bebas Neue',
      'Cabin',
      'Caveat',
      'Cinzel',
      'Dancing Script',
      'Fjalla One',
      'Inconsolata',
      'Indie Flower',
      'Karla',
      'Lato',
      'Merriweather',
      'Montserrat',
      'Nunito',
      'Open Sans',
      'Oswald',
      'Poppins',
      'PT Sans',
      'Quicksand',
      'Raleway',
      'Roboto',
      'Roboto Slab',
      'Slabo 27px',
      'Source Sans Pro',
      'Titillium Web',
      'Ubuntu',
      'Work Sans',
      'Zilla Slab',
      'Playfair Display',
      'Lobster',
      'Pacifico',
      'Righteous',
      'Satisfy',
      'Varela Round',
      'Montserrat Alternates',
      'Pangolin',
      'Spectral',
      'Noto Sans',
      'Zilla Slab Highlight',
    ],
    _currentFont: null,

  }),
  getters: {
    isLoading: state => state._status === 'loading',
    isReady: state => state._status === 'ready',
    isError: state => state._status === 'error',
    error: state => state._error,
    fonts: state => state._fonts,
    currentFont: state => state._currentFont,

  },
  actions: {

    getFont(font: any) {
      this._currentFont = font
    },
    changeStatus(status: 'loading' | 'ready' | 'error', error: any = null) {
      this._status = status
      if (status === 'error')
        this._error = error
    },
  },
})
