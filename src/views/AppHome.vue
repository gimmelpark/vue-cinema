<template>
	<div>
		<div class="d-flex justify-space-between pt-2">

			<div 
				class="pl-7 pt-3 text-h6"
			>Сейчас в нашем кинотеатре:</div>

			<div>
				<v-text-field
					class="search-field pt-1 pr-8"
					label="Поиск"
					hide-details
					clearable
					color="primary darken-1"
					v-model="search"
					@input="searchInput"
				></v-text-field>
			</div>

		</div>

		<v-divider class="ma-3 mt-4"></v-divider>

		<div v-if="movies.length > 0" class="movies-cards-layout mt-4 d-flex flex-column align-center">
			<div class="movies-cards">

				<app-movie-card
					v-for="(movie, i) in movies"
					:key="'movie-card-' + i"
					:movie="movie"
					@modal="filmSeancesBtn ($event, movie.localID)"
				></app-movie-card>

			</div>
		</div>
		
		<div v-else>
			<v-alert
				border="right"
				colored-border
				color="primary lightn-1"
				class="alert"
			>

				<v-icon
					dense
					color="primary darken-1"
				>
					mdi-movie-open-remove
				</v-icon>

				<span class="pl-3">
					{{alertText}}
				</span>

				<div></div>
				
			</v-alert>
		</div>

		<v-dialog
			@input="filmSeancesBtn"
			:value="modalState"
			:width="modalWidth"
		>

			<app-modal></app-modal>
			
		</v-dialog>
		
	</div>
</template>

<script>
import {mapGetters } from 'vuex'

import AppMovieCard from '@/components/AppMovieCard.vue'
import AppModal from '@/components/AppModal.vue'

export default {
	components: {
		AppMovieCard,
		AppModal,
	},

	data: () => ({
		search: '',
		searchResult: [],
	}),

	computed: {
		...mapGetters('movies', {
			allMovies: 'getMovies'
		}),
		...mapGetters ('data', {
			modalState: 'getModalState',
		}),

		modalWidth () {
			return 800
		},

		movies () {
			return this.search === '' ? this.allMovies : this.searchResult
		},

		alertText () {
			if (this.allMovies.length > 0 && this.movies.length == 0) return 'Ничего не найдено'
			if (this.allMovies.length == 0) return 'Сейчас сеансов нет'
		},
	},

	methods: {

		searchInput () {

			if (this.search === null) this.search = ''
			
			let str = this.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

			let re = new RegExp(str, 'i')

			let newMovies = this.allMovies.filter(mov => {
				return re.test(mov.title) || re.test(mov.titleAlt)
			})

			this.searchResult = newMovies
		},

		filmSeancesBtn (e, filmID) {
			if (!this.modalState) {
				this.$store.dispatch('data/openFilmSeances', filmID)
			} else {
				this.$store.dispatch('data/closeModal')
			}
		},
	}
}
</script>

<style lang="scss">

	.search-field {
		width: 300px;
	}

	.movies-cards {
		width: 600px;
	}
	
	.alert {
		width: 320px;
		margin: 0 auto;
	}

</style>