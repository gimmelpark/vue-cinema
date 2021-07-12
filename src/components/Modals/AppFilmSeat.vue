<template>
	<div v-if="modalState">

		<v-card-title class="headline primary secondary--text d-flex justify-space-between">

			<div class="d-flex align-center">

				<v-btn
					icon
					class="secondary--text"
					@click="backToSeances"
				>
					<v-icon>
						mdi-chevron-left
					</v-icon>
				</v-btn>

				<span class="ml-2">{{ titleDateText }}, {{ titleTimeText }} -</span>
				<span class="font-weight-thin ml-2">{{ movie.title }}</span>

			</div>

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

		<div class="d-flex justify-space-between">

			<div class="mt-3 ml-5 mb-2">
				<span class="">{{ seance.price }}р</span>
				<span class="ml-3 text--secondary">Зал {{ seance.hall }}</span>
				<span class="ml-3 text--secondary">{{ seance.type }}</span>
			</div>

			<div class="timer mt-2 mr-4">
				{{ timerText }}
			</div>

		</div>

		<v-divider></v-divider>

		<div class="d-flex justify-center my-5">
			<app-seat-picker></app-seat-picker>
		</div>

		<v-divider></v-divider>

		<div class="d-flex justify-space-between align-center">

			<div
				class="ml-5 text-subtitle-2"
			>{{ totalText }}</div>

			<v-btn
				class="my-2 primary secondary--text mr-5"
				:disabled=" total === 0 "
				@click=" paymentBtn "
			>оплатить</v-btn>

		</div>

		<v-overlay
			absolute
			:opacity=".75"
			:value=" showOverlay "
		>
			<div class="d-flex flex-column align-center">

				<div class="text-h6">
					Время на покупку истекло
				</div>

				<div class="mt-3">
					<v-btn
						@click=" restart() "
						outlined
					>
						начать заново
					</v-btn>
				</div>

				<div class="mt-5">
					<v-btn
						@click=" closeModal() "
						outlined
					>
						закрыть
					</v-btn>
				</div>

			</div>	
		</v-overlay>

	</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import AppSeatPicker from '@/components/AppSeatPicker.vue'

import t from '@/modules/timeFunctions.js'

export default {

	components: {
		AppSeatPicker,
	},

	data: () => ({
		currentTime: undefined,
		timer: null,
		showOverlay: false,
	}),

	mounted() {
		this.startTimer()
	},

	destroyed() {
		this.stopTimer()
	},

	computed: {
		...mapGetters('data', {
			filmID: 'getSelectedFilmID',
			modalState: 'getModalState',
			selectedDate: 'getSelectedFilmDate',
			seanceID: 'getSelectedSeanceID',
			total: 'getTotalPrice',
		}),
		movie () {
			if (this.modalState) return this.$store.getters['movies/getMovieByID'](this.filmID)
			return undefined
		},
		seance () {
			if (this.modalState) return this.$store.getters['data/getSeanceByID'](this.seanceID)
			return undefined
		},

		titleDateText () {
			if ( this.selectedDate === t.toISO(new Date())) return 'Сегодня'
			if ( this.selectedDate === t.toISO(new Date(new Date().getTime() + 86400000))) return 'Завтра'

			let day = new Date(this.selectedDate)
			return day.getDate() + ' ' + t.monthStr(day.getMonth())
		},

		titleTimeText () {
			return ('0' + String(this.seance.time.h)).slice(-2) + ':' + ('0' + String(this.seance.time.m)).slice(-2)
		},

		timerText () {
			return String(parseInt(this.currentTime / 60)) + ':' + ('0' + String(this.currentTime % 60)).slice(-2)
		},

		totalText () {
			return this.total === 0 ? 'Заказ пуст' : 'Всего: ' + this.total + 'р'
		},

	},

	methods: {
		...mapActions('data', {
			closeModal: 'closeModal',
			backToSeances: 'backToSeances',
		}),

		paymentBtn () {
			this.$store.dispatch('data/openOrderConfirm', this.currentTime)
		},

		startTimer () {
			this.currentTime = this.$store.getters['data/getCurrentTime']

			this.timer = setInterval(() => {
				this.currentTime--
			}, 1000)
		},

		stopTimer () {
			clearTimeout(this.timer)
		},

		stopSession () {
			this.showOverlay = true
			this.$store.dispatch('data/hallInit', {
				seanceID: this.seanceID,
				filmID: this.filmID,
			})
		},

		restart () {
			this.showOverlay = false
			
			this.startTimer()
		},

	},

	watch: {
		currentTime(time) {
			if (time === 0) {
				this.stopTimer()
				this.stopSession()
			}
		},
	},
	
}
</script>

<style lang="scss" scoped>
.timer {
	font-size: 20px;
	font-family: monospace;
}
</style>
