import t from '@/modules/timeFunctions.js'
import GET from '@/modules/serverGET.js'

const state = () => ({

	// открыта ли модалка
	modalState: false,

	// контент модалки - 'film-seances' - сеансы фильма, 'film-seat' - выбор места в зале, 'order-confirm' - подтверждение заказа
	modalContent: '',

	// выбранный фильм
	selectedFilmID: '',

	// дата модлки
	selectedFilmDate: '',

	// сеансы выбранного фильма
	filmSeances: [],

	// id выбранного сеанса
	selectedSeanceID: '',

	// зал выбранного сеаса
	selectedHall: [],

	// массив выбранных мест
	selectedSeats: [],

	maxOrderTime: 600,

	currentTime: undefined,

})

const getters = {

	// возвращает сеанс по его id
	getSeanceByID: (state) => (seanceID) => {
		return state.filmSeances.find( el => el.id == seanceID )
	},

	getModalState: (state) => state.modalState,
	getModalContent: (state) => state.modalContent,
	getSelectedFilmID: (state) => state.selectedFilmID,
	getSelectedFilmDate: (state) => state.selectedFilmDate,
	getFilmSeances: (state) => state.filmSeances,
	getSelectedSeanceID: (state) => state.selectedSeanceID,
	getSelectedHall: (state) => state.selectedHall,
	getSelectedSeats: (state) => state.selectedSeats,

	// возвращает стоимость заказа
	getTotalPrice: (state, getters) => {
		return getters.getSeanceByID(state.selectedSeanceID).price * state.selectedSeats.length
	},

	getCurrentTime: (state) => state.currentTime,
	
}

const mutations = {
	setModalState (state, modalState) {
		state.modalState = modalState
	},
	setModalContent (state, modalContent) {
		state.modalContent = modalContent
	},
	setSelectedFilmID (state, id) {
		state.selectedFilmID = id
	},
	setSelectedFilmDate (state, date) {
		state.selectedFilmDate = date
	},
	setFilmSeances (state, seances) {
		state.filmSeances = seances
	},
	setSelectedSeanceID (state, id) {
		state.selectedSeanceID = id
	},
	setSelectedHall (state, hall) {
		state.selectedHall = hall
	},
	setSeatState (state, { row, seat, newState }) {
		state.selectedHall.find( el => el.row == row )
		.seats.find( el => el.seat == seat ).state = newState
	},
	setSelectedSeats (state, seats) {
		state.selectedSeats = seats
	},
	setCurrentTime (state, time) {
		state.currentTime = time
	},
}

const actions = {

	// открывает модалку с сеансами выбранного фильма
	openFilmSeances ({ commit, rootGetters, dispatch }, filmID) {

		// тип модалки
		commit('setModalContent', 'film-seances')
		// фильм
		commit('setSelectedFilmID', filmID)
		// дата - всегда первая доступная
		dispatch('setDate', rootGetters['seances/getFirstAllowedDate'])
		// открытие модалки
		commit('setModalState', true)

	},

	// возвращение к модалке с сеансами от модалки с местами
	backToSeances ({ commit }) {
		// меняем модалку
		commit('setModalContent', 'film-seances')
		// сбрасываем id сеанса
		commit('setSelectedSeanceID', '')
		// сбрасываем инфу о зале
		commit ('setSelectedHall', [])
	},

	// модалка выбора мест в зале
	openFilmSeat ({ commit, state, rootGetters, dispatch }, { filmID, seanceID }) {

		// фильм
		commit('setSelectedFilmID', filmID)
		// сеанс
		commit('setSelectedSeanceID', seanceID)
		// зал
		dispatch('hallInit', {
			filmID: filmID,
			seanceID: seanceID,
		})
		// время заказа
		commit('setCurrentTime', state.maxOrderTime)
		
		// если открывается не из предыдущей модалки
		if ( state.selectedFilmDate === '' ) {
			dispatch('setDate', rootGetters['seances/getSelectedDate'])
		}

		// тип модалки
		commit('setModalContent', 'film-seat')
		// открытие модалки
		commit('setModalState', true)

	},

	// возврат к выбору мест из окна подтверждения
	backToSeat ({ commit }, currentTime) {
		// устанавливаем время
		commit('setCurrentTime', currentTime > 0 ? currentTime - 1 : currentTime)
		// тип модалки
		commit('setModalContent', 'film-seat')
	},

	// открытие модалки подтверждения заказа
	openOrderConfirm ({ commit }, currentTime) {
		// устанавливаем время
		commit('setCurrentTime', currentTime > 0 ? currentTime - 1 : currentTime)
		// тип модалки
		commit('setModalContent', 'order-confirm')
	},

	// открывает модалку с оплатой
	openPayment ({ commit }, currentTime) {
		// устанавливаем время
		commit('setCurrentTime', currentTime > 0 ? currentTime - 1 : currentTime)
		// тип модалки
		commit('setModalContent', 'payment')
	},

	// закрывает и обнуляет модалку
	closeModal ({ commit }) {

		// закрываем модалку
		commit('setModalState', false)
		// сбрасываем контент
		commit('setModalContent', '')
		// сбрасываем фильм
		commit('setSelectedFilmID', '')
		// сбрасываем дату
		commit('setSelectedFilmDate', '')
		// сбрасываем id сеанса
		commit('setSelectedSeanceID', '')
		// сбрасываем инфу о зале
		commit ('setSelectedHall', [])

	},

	// сеансы фильма
	setFilmSeances ({ commit }, { filmID, date }) {

		// если нет дат
		if ( date == 'no-dates' && filmID == '' ) {
			commit('setFilmSeances', [])
		}

		// запрос на сервер
		let seances = GET.getTestSeances(date).films.find( el => el.filmID == filmID ).seances

		// если сегодня
		let today = new Date()

		if (date == t.toISO(today)) {
			
			seances = seances.filter( seance => {
				let time = seance.time
				return ( time.h * 60 + time.m ) > ( today.getHours() * 60 + today.getMinutes() )
			})
	
		}

		commit('setFilmSeances', seances)
	},

	// меняет дату внутри модалки
	setDate ({ commit, dispatch, state }, date) {
		commit('setSelectedFilmDate', date)
		dispatch('setFilmSeances', {
			filmID: state.selectedFilmID,
			date: date,
		})
	},

	// получение информации о зале сеанса с сервера
	hallInit ({ commit }, { seanceID, filmID }) {
		// инфа о зале
		let hall = GET.getHall( filmID, seanceID )
		commit ('setSelectedHall', hall)

		// выбранные места
		commit('setSelectedSeats', [])
	},

	// выбор места в зале (клик)
	seatClick ({ commit, state, dispatch }, { row, seat }) {

		let seatState = state.selectedHall.find( el => el.row == row )
		.seats.find( el => el.seat == seat).state

		if ( seatState != 'null' && seatState != 'booked' ) {
			
			// добавляем или удаляем место
			if ( seatState == 'free' ) {

				dispatch('addSeat', {
					row: row,
					seat: seat,
				})

			} else {

				dispatch('removeSeat', {
					row: row,
					seat: seat,
				})
				
			}

		}
	},

	// добавить место в заказ
	addSeat ({ commit, state }, { row, seat }) {

		// тут надо запрос на сервер

		let newSelectedSeats = state.selectedSeats.slice()

		newSelectedSeats.push({
			row: row,
			seat: seat,
		})

		newSelectedSeats = newSelectedSeats.sort( (a, b) => ( a.row * 100 + a.seat ) - ( b.row * 100 + b.seat ) )

		commit('setSelectedSeats', newSelectedSeats)

		commit ('setSeatState', {
			row: row,
			seat: seat,
			newState: 'selected',
		})
	},

	// удалить место из заказа
	removeSeat ({ commit, state }, { row, seat }) {

		// тут надо запрос на сервер

		let newSelectedSeats = state.selectedSeats.slice()

		newSelectedSeats.splice( 
			newSelectedSeats.findIndex( el => ( el.row === row && el.seat === seat ) )
		, 1)

		commit ('setSelectedSeats', newSelectedSeats)

		commit ('setSeatState', {
			row: row,
			seat: seat,
			newState: 'free',
		})
	},


}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}