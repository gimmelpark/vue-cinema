import Vue from 'vue'
import Vuex from 'vuex'

import movies from './modules/movies.js'
import seances from './modules/seances.js'
import data from './modules/data.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    movies,
    seances,
    data,
  }
})
