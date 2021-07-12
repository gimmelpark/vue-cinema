import t from '@/modules/timeFunctions.js'

import GET from '@/modules/serverGET.js'

const state = () => ({

	// сеансы в выбраный день
	seances: {},

	// выбранный день yyyy-mm-dd
	selectedDate: '',

	// максимальная доступная дата
	maxDate: '',

	// доступные даты
	allowedDates: undefined,

	// близжайшая доступная дата
	firstAllowedDate: '',
})

const getters = {
	// возвращает массив сеансов
	getSeancesList: (state) => {

		// нет дат с сеансами
		if (state.selectedDate == 'no-dates') return []

		let seancesList = []

		// добавляем сеансы всех фильмов в один массив
		state.seances.films.forEach(film => {
			film.seances.forEach( el => {
				seancesList.push({
					filmID: film.filmID,
					...el,
				})
			})
		})

		// создаем карту
		let mapped = seancesList.map(( el, i ) => {
			return { ind: i, time: el.time.h * 60 + el.time.m }
		})

		// сортируем
		mapped.sort((a, b) => a.time - b.time)

		return mapped.map( (el) => seancesList[el.ind] )
	},

	// возвращаеет сеансы по фильму
	getSeancesByFilm: (state) => (filmID) => {
		return state.seances.films.find( el => el.filmID == filmID ).seances
	},

	// возвращает сеанс по его id и id фильма
	getSeanceByID: (state) => ({ seanceID, filmID }) => {

		return state.seances.films.find( el => el.filmID == filmID )
		.seances.find( el => el.id == seanceID )

	},

	getSelectedDate: (state) => state.selectedDate,
	getMaxDate: (state) => state.maxDate,
	getAllowedDates: (state) => state.allowedDates,
	getFirstAllowedDate: (state) => state.firstAllowedDate,

}

const mutations = {

	setMaxDate (state, date) {
		state.maxDate = date
	},

	setAllowedDates (state, dates) {
		state.allowedDates = dates
	},

	setFirstAllowedDate (state, date) {
		state.firstAllowedDate = date
	},
	
	setSeances (state, seances) {
		state.seances = seances
	},

	setSelectedDate (state, date) {
		state.selectedDate = date
	},

}

const actions = {
	// вызывается в created в app
	seancesInit ({ commit, state, dispatch }) {

		// устанавливаем доступные даты
		commit('setMaxDate', GET.maxDate())
		commit('setAllowedDates', GET.allowedDates)

		// сегодня
		let date = new Date()

		// поиск близжайшей доступной даты
		let nextDay = 0

		while (!state.allowedDates(t.toISO(date))) {
			nextDay++
			date = new Date(new Date().getTime() + 86400000 * nextDay)

			if (date.getTime() > new Date(state.maxDate)) {
				commit('setFirstAllowedDate', 'no-dates')
				nextDay = -1
				break;
			}
		}

		// устанавливаем близжайшую дату
		if (nextDay != -1) {
			commit('setFirstAllowedDate', t.toISO(date))
		}

		// выбираем ее
		dispatch('setDate', state.firstAllowedDate)

	},

	// сеансы выбранного дня
	setSeancesByDay ({ commit }, date) {

		// если доступных дней нет
		if (date == 'no-dates') {
			commit('setSeances', {
				date: date,
				films: [],
			})
			return 0
		}
		
		let today = new Date()

		// типо запрос на сервер
		let seances = GET.getTestSeances (date)

		// если сегодня откидываем уже прошедшие сеансы
		if (date == t.toISO(today)) {

			seances.films.forEach(film => {
				film.seances = film.seances.filter(seance => {
					let time = seance.time
					return ( time.h * 60 + time.m ) > ( today.getHours() * 60 + today.getMinutes() )
				})
			})

		}
		
		// коммит)))
		commit('setSeances', seances)

	},

	// устанавливаем дату
	setDate ({ commit, dispatch }, date) {
		commit('setSelectedDate', date)
		dispatch('setSeancesByDay', date)
	},
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}
