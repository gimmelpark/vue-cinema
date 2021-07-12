<template>
	<v-card
		class="mb-10 card secondary"
	>

		<v-row no-gutters>
			<v-col
				cols="4"
			>
				<div class="pa-2 secondary">
					<v-img
						:src="movie.poster"
					></v-img>
				</div>
			</v-col
			>
			<v-col
				cols="8"
			>
				<div class="card-inf-col d-flex flex-column justify-space-between">
					
					<div>
						<v-card-title class="pt-1 d-flex align-end">
							<span>
								{{movie.title}}
							</span>
							<span 
								class="card-age subtitle-2 pl-2 text--secondary"
								v-if="movie.age > 0"
							>
								{{movie.age}}+
							</span>
						</v-card-title>

						<v-card-subtitle class="pb-0">
							{{movie.titleAlt}} ({{movie.year}})
						</v-card-subtitle>

						<app-rating
							:value="movie.ratingIMDB"
							class="pl-4"
							:title="'IMDb: ' + movie.ratingIMDB"
						></app-rating>
					</div>
					
					<div>
						<v-divider class="ma-2 mt-0"></v-divider>

						<v-card-text class="card-text pt-0">
							Жанры: {{movieGenres}}
						</v-card-text>

						<v-card-text class="card-text d-flex pt-0">
							<v-icon dense>
								mdi-clock-outline
							</v-icon>
							<span class="pl-2">
								{{movieDur}}
							</span>
						</v-card-text>
					</div>
					
					<div>
						<v-divider class="ma-2 mt-0"></v-divider>

						<v-card-actions 
							class="mb-2"
						>

							<v-btn
								color="primary"
								class="secondary--text ml-3"
								@click="filmSeancesBtn"
							>
								Купить билеты
							</v-btn>

							<v-btn
								text
								color="primary darken-2"
								class="ml-4"
								:to="{ name: 'filmInf', params: {filmID: movie.localID} }"
							>
								Подробнее
							</v-btn>
						</v-card-actions>
					</div>

				</div>
			</v-col>
		</v-row>

	</v-card>
</template>

<script>
import AppRating from '@/components/AppRating.vue'

export default {
	components: {
		AppRating,
	},

	props: {
		movie: {
			type: Object,
			required: true,
		}
	},

	computed: {

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
	},

	methods: {
		filmSeancesBtn () {
			this.$emit('modal')
		}
	},
}
</script>

<style lang="scss">
.card {
	overflow: hidden;

	.card-inf-col {
		height: 100%;
	}

	.card-age {
		line-height: 30px;
	}
	.card-text {
		white-space: nowrap;
		text-overflow: ellipsis;
		max-width: 100%;
		overflow: hidden;
	}

}
</style>