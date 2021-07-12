<template>

	<div v-if=" movie !== undefined ">
		<v-row no-gutters>

			<v-col
				cols="6"
				class="pt-3 pl-6"
			>
				<h3 class="text-heading-3">
					<span>{{ movie.title }} </span>
					<span class="text--secondary font-weight-regular">/ {{ movie.titleAlt }}
				</span></h3>

				<h4 class="text-subtitle-2 text--secondary pl-1 pb-1">
					<span>{{ movieGenres }}</span>
					<span class="pl-3">{{ movie.age }}+</span>
				</h4>
			</v-col>

			<v-col
				cols="6"
				class="pr-6 d-flex justify-end align-center"
			>
				<v-dialog
					@input="filmSeancesBtn"
					:value="modalState"
					:width="modalWidth"
				>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							color="primary"
							class="secondary--text"
							v-bind="attrs"
							v-on="on"
							@click="filmSeancesBtn"
						>
							Купить билеты
						</v-btn>
					</template>

					<app-modal></app-modal>

				</v-dialog>
				
				<v-btn
					text
					color="primary darken-2"
					class="ml-4"
					:to="{ name: 'home'}"
					exact
				>
					К списку фильмов
				</v-btn>
			</v-col>
		</v-row>
		<v-divider class="mx-3"></v-divider>
		<div class="mt-5 d-flex">
			<div>
				<v-img
					:src="movie.poster"
					max-width="300"
					class="mr-3 ml-5"
				></v-img>
			</div>

			<div class="inf-layout d-flex flex-column justify-space-between mr-4">

				<v-simple-table class="inf-table background1">
					<template v-slot:default>
						<tbody>
							<tr
								v-for="(field, i) in infFields"
								:key="'inf-field-' + i"
							>
								<th class="table-title">{{ field.title }}</th>
								<th>
									<app-film-inf-field
										:content="field.content"
									></app-film-inf-field>
								</th>
							</tr>
						</tbody>
					</template>
				</v-simple-table>

				<div class="d-flex justify-center">

					<v-alert
						border="bottom"
						class="mb-0 orange lighten-5"
						colored-border
						:color="ratingColor(movie.ratingIMDB)"
					>
						IMDb: {{ movie.ratingIMDB }}
					</v-alert>

					<v-alert
						border="bottom"
						class="mb-0 ml-6 orange lighten-5"
						colored-border
						:color="ratingColor(movie.ratingKP)"
					>
						Кинопоиск: {{ movie.ratingKP }}
					</v-alert>

				</div>
			</div>
		</div>

		<v-divider class="mx-3 mt-6"></v-divider>

		<v-row justify="center" no-gutters class="mt-5 mb-2">

			<v-expansion-panels class="player-panel">
				<v-expansion-panel>

					<v-expansion-panel-header>Смотреть трейлер</v-expansion-panel-header>

					<v-expansion-panel-content>
						<v-col cols="12" class="px-0 d-flex justify-center">
							<iframe 
								width="420" 
								height="250" 
								:src="movie.trailer" 
								title="YouTube video player" 
								frameborder="0" 
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
								allowfullscreen
							></iframe>
						</v-col>
					</v-expansion-panel-content>

				</v-expansion-panel>
			</v-expansion-panels>
			
		</v-row>

		<div class="pt-3 pb-7 px-6">
			{{movie.description}}
		</div>
		
	</div>

	<div v-else>
		<app-404></app-404>
	</div>

</template>

<script>
import AppFilmInfField from '@/components/AppFilmInfField.vue'
import AppModal from '@/components/AppModal.vue'
import App404 from '@/components/App404.vue'

import { mapGetters } from 'vuex'

export default {

	components: {
		AppFilmInfField,
		AppModal,
		App404,
	},

	computed: {

		...mapGetters ('data', {
			modalState: 'getModalState',
		}),

		modalWidth () {
			return 800
		},

		movie () {
			return this.$store.getters['movies/getMovieByID'](this.$route.params.filmID)
		},

		movieGenres () {
			let str = this.movie.genres.reduce((str, genre, j) => {
				return j == 0 ? str + genre : str + ', ' + genre
			}, '');

			if (str === '') return 'Неизвестно'
			return str
		},

		movieDur () {
			let dur = this.movie.duration
			let h = parseInt(dur / 60)
			let m = dur % 60
			return h > 0 ? h + ' ч ' + m + ' мин' : m + ' мин'
		},

		infFields () {
			return [
				{
					title: 'Режисер: ',
					content: this.movie.directors,
				},
				{
					title: 'В ролях: ',
					content: this.movie.actors,
				},
				{
					title: 'Производство: ',
					content: this.movie.countries,
				},
				{
					title: 'Продолжительность: ',
					content: this.movieDur,
				},
				{
					title: 'Премьера в мире: ',
					content: this.movie.premiere,
				},
				{
					title: 'Премьера в РФ: ',
					content: this.movie.premiereRU,
				},
				
			]
		},
		
	},

	methods: {
		
		ratingColor (rate) {
			if (rate >= 7.0) return 'green darken-1'
			if (rate >= 5.0) return 'yellow lighten-1'
			return 'red darken-1'
		},

		filmSeancesBtn () {
			if (!this.modalState) {
				this.$store.dispatch('data/openFilmSeances', this.$route.params.filmID)
			} else {
				this.$store.dispatch('data/closeModal')
			}
		},
	},
}
</script>

<style lang="scss" scoped>
	.inf-layout {
		width: 552px;

		.inf-table {
			width: 100%;

			.table-title {
				width: 80px;
			}
		}
	}
	
	.player-panel {
		width: 600px;
	}
</style>