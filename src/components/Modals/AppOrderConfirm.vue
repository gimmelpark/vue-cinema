<template>
	<div v-if="modalState">

		<v-card-title class="headline primary secondary--text d-flex justify-space-between">

			<div class="d-flex align-center">

				<v-btn
					icon
					class="secondary--text"
					@click="backToSeat"
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

		<div class="d-flex justify-center mb-5 mt-0">
			<div class="seats-table">

				<div class="text-subtitle-2 my-3 ml-1">Ваш заказ:</div>

				<div
					v-for=" (seat, i) in seatsBackup "
					:key="'seat-' + i"
				>

					<v-divider></v-divider>

					<div
						class="d-flex justify-space-between align-center"
					>

						<div 
							class="text-body-2 text--primary ml-3"
							:class=" seat.deleted ? 'text--disabled' : '' "
						>{{ i + 1 }}</div>

						<div 
							class="text-body-2 text--primary"
							:class=" seat.deleted ? 'text--disabled' : '' "
						>Ряд {{ seat.row }}</div>

						<div 
							class="text-body-2 text--primary"
							:class=" seat.deleted ? 'text--disabled' : '' "
						>Место {{ seat.seat }}</div>

						<v-btn
							icon
							class="my-1"
							@click=" removeBtnClick(i) "
						>
							<transition name="btn-flip" mode="out-in">
								<v-icon
									:color=" seat.deleted ? 'acept' : 'error' "
									dense
									:key="'seat-' + i + (seat.deleted ? '-0' : '-1')"
								>
									mdi-{{ seat.deleted ? 'plus-box' : 'close-box' }}
								</v-icon>
							</transition>
						</v-btn>

					</div>

				</div>
				
			</div>
		</div>

		<v-divider></v-divider>

		<div class="d-flex justify-space-between align-center">

			<div
				class="ml-5 text-subtitle-2"
			>{{ totalText }}</div>

			<v-btn
				class="my-2 primary secondary--text mr-5"
				:disabled=" total === 0 "
				@click=" openPayment "
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

import t from '@/modules/timeFunctions.js'

export default {

	data: () => ({
		currentTime: undefined,
		timer: null,
		showOverlay: false,
		seatsBackup: [],
	}),

	created() {
		this.seatsBackup = this.selectedSeats.map( el => {
			return {
				...el,
				deleted: false,
			}
		})
	},

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
			selectedSeats: 'getSelectedSeats',
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
		}),

		backToSeat () {
			this.$store.dispatch('data/backToSeat', this.currentTime)
		},

		openPayment () {
			this.$store.dispatch('data/openPayment', this.currentTime)
		},

		removeBtnClick (i) {

			if ( this.seatsBackup[i].deleted ) {

				this.$store.dispatch('data/addSeat', {
					row: this.seatsBackup[i].row,
					seat: this.seatsBackup[i].seat,
				})

			} else {

				this.$store.dispatch('data/removeSeat', {
					row: this.seatsBackup[i].row,
					seat: this.seatsBackup[i].seat,
				})

			}

			this.seatsBackup[i].deleted = !this.seatsBackup[i].deleted

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
			this.$store.dispatch('data/openFilmSeat', {
				seanceID: this.seanceID,
				filmID: this.filmID,
			})
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

.seats-table {
	width: 300px;
}

.btn-flip-leave-active {
	animation: flipOut .3s;
}

.btn-flip-enter-active {
	animation: flipIn .3s;
}

@keyframes flipIn {
	0% {
		transform: scale(0);
	}
	100% {
		transform: scale(1);
	}
}

@keyframes flipOut {
	0% {
		transform: scale(1);
	}
	100% {
		transform: scale(0);
	}
}
</style>