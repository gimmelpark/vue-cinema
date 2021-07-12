import GET from '@/modules/serverGET.js'

const state = () => ({
	movies: [],
})

const getters = {
	getMovies: (state) => state.movies,
	getMovieByID: (state) => (id) => {

		let movie = GET.getTestMovie (id)

		if ( movie === false ) return undefined

		return {
			title: movie.title,
			titleAlt: movie.title_alternative,
			poster: 'https://st.kp.yandex.net/images/film_big/' + movie.id_kinopoisk + '.jpg',
			age: getAge(movie.age),
			duration: parseInt(String(movie.collapse.duration)),
			genres: movie.genres,
			year: movie.year,
			ratingKP: movie.rating_kinopoisk,
			ratingIMDB: movie.rating_imdb,
			tagline: movie.tagline,
			description: movie.description,
			trailer: movie.trailer,
			actors: movie.actors,
			directors: movie.directors,
			countries: movie.countries,
			premiere: movie.premiere_world,
			premiereRU: movie.premiere_russia,
		}
	},
}

const mutations = {

	setMoviesList (state, movies) {
		state.movies = movies
	},

}

const actions = {

	// вызывается в created в app
	moviesInit ({commit}) {

		let movies = []

		// типо запрос на сервер
		let n = 110
		let movie = GET.getTestMovie(n)
		while (movie !== false) {

			movies.push({
				localID: String(n),
				kpID: movie.id_kinopoisk,
				title: movie.title,
				titleAlt: movie.title_alternative,
				poster: 'https://st.kp.yandex.net/images/film_big/' + movie.id_kinopoisk + '.jpg',
				age: getAge(movie.age),
				duration: parseInt(String(movie.collapse.duration)),
				genres: movie.genres,
				year: movie.year,
				ratingKP: movie.rating_kinopoisk,
				ratingIMDB: movie.rating_imdb,
			})

			n++
			movie = GET.getTestMovie(n)
		}

		commit('setMoviesList', movies)
	},
}

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
}


const getAge = (str) => {
	let num = +/\d+/.exec(str)

	return num
}

