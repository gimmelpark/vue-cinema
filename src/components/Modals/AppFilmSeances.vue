<template>
	<div v-if="modalState">

		<v-card-title class="headline primary secondary--text d-flex justify-space-between">

			<div>{{ movie.title }}</div>

			<v-btn
				icon
				class="secondary--text"
				@click="closeModal"
			>
				<v-icon>
					mdi-close-circle-outline
				</v-icon>
			</v-btn>

		</v-card-title>

		<app-select-date
			class="py-3 ml-4"
			targetDate="data"
		></app-select-date>

		<v-divider></v-divider>

		<div class="text-subtitle-2 grey--text text--darken-2 mt-2 ml-4">
			Сеансы на {{ dateText }}:
		</div>

		<div 
			v-if="seances.length > 0"
			class="d-flex flex-wrap ml-3 mb-3"
		>

			<v-hover 
				v-slot="{ hover }"
				v-for="(seance, i) in seances"
				:key=" 'block-' + i "
				close-delay="50"
			>
				<div 
					:class=" hover ? 'primary grey--text' : 'primary--text text--darken-2' "
					class="seance-block ma-2" 
					@click="blockClick( $event, seance.id )"
				>

					<div 
						:class=" hover ? 'secondary--text' : 'grey--text text--darken-1' "
						class="seance-block-title"		
					>
						{{ ('0' + String(seance.time.h)).slice(-2) + ':' + ('0' + String(seance.time.m)).slice(-2) }}
					</div>

					<v-divider :class=" hover ? 'secondary darken-1' : '' "></v-divider>

					<div 
						:class=" hover ? 'secondary--text' : 'grey--text' "
						class="d-flex justify-space-between"
					>
						<div class="ml-3">
							{{ seance.price }}р
						</div>
						<div class="mr-4">
							{{ seance.type }}
						</div>
					</div>

				</div>
			</v-hover>

		</div>

		<div v-else class="text-overline text-center mb-3 no-seances">
			<div>сеансов нет</div>
			<div>посмотрите другую дату</div>
		</div>

	</div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

import AppSelectDate from '@/components/AppSelectDate.vue'

import t from '@/modules/timeFunctions.js'

export default {
	components: {
		AppSelectDate,
	},

	computed: {
		...mapGetters('data', {
			filmID: 'getSelectedFilmID',
			modalState: 'getModalState',
			selectedDate: 'getSelectedFilmDate',
			seances: 'getFilmSeances',
		}),

		movie () {
			if (this.modalState) return this.$store.getters['movies/getMovieByID'](this.filmID)
			return undefined
		},

		dateText () {
			let day = new Date(this.selectedDate)
			return day.getDate() + ' ' + t.monthStr(day.getMonth())
		},

	},

	methods: {
		...mapActions('data', {
			closeModal: 'closeModal'
		}),

		blockClick(e, id) {
			this.$store.dispatch('data/openFilmSeat', {
				filmID: this.filmID,
				seanceID: id,
			})
		},

	}
}
</script>

<style lang="scss" scoped>

.seance-block {
	border: 2px solid;
	border-radius: 5px;
	width: 100px;
	height: 55px;
	cursor: pointer;

	.seance-block-title {
		text-align: center;
		font-size: 18px;
		font-family: monospace;
	}
}

.no-seances {
	height: 71px;
}
</style>