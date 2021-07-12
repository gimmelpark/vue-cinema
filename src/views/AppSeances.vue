<template>
	<div>
		<div>

			<app-select-date class="py-5 ml-4"></app-select-date>
			
		</div>

		<v-divider></v-divider>

		<div>
			<v-list color="background1 pa-0" v-if="!showAlert">
				
				<app-seance
					v-for="(seance, i) in seances"
					:key="'seance-' + i"

					:hour="seance.time.h"
					:minute="seance.time.m"
					:hall="seance.hall"
					:price="seance.price"
					:type="seance.type"
					:filmID="seance.filmID"
					
					@seanceOnClick="openSeatModal( $event, seance.filmID, seance.id)"
				></app-seance>
				
			</v-list>

			
			<v-alert
				border="right"
				colored-border
				color="primary lighten-1"
				class="alert mt-8"
				v-else
			>
				<v-icon
					dense
					color="primary darken-1"
				>
					mdi-movie-open-remove
				</v-icon>
				<span class="pl-3">
					{{ alertText }}
				</span>
			</v-alert>

		
		</div>

		<v-dialog
			@input="openSeatModal"
			:value="modalState"
			:width="modalWidth"
		>

			<app-modal></app-modal>
			
		</v-dialog>

	</div>
</template>

<script>
import t from '@/modules/timeFunctions.js'

import { mapGetters } from 'vuex'

import AppSeance from '@/components/AppSeance.vue'
import AppSelectDate from '@/components/AppSelectDate.vue'
import AppModal from '@/components/AppModal.vue'

export default {

	components: {
		AppSeance,
		AppSelectDate,
		AppModal,
	},

	computed: {
		...mapGetters('seances', {
			selectedDate: 'getSelectedDate',
			seances: 'getSeancesList',
		}),
		...mapGetters ('data', {
			modalState: 'getModalState',
		}),

		showAlert () {
			if (this.seances.length == 0) return true
			if (this.selectedDate == 'no-dates') return true
			return false
		},

		todayStr () {
			return t.toISO(new Date())
		},

		alertText () {
			if (this.seances.length == 0 && this.selectedDate != 'no-dates') {
				if (this.selectedDate == this.todayStr) return 'Сегодня сеансов нет'
				return 'В этот день сеансов нет'
			}
			if (this.selectedDate == 'no-dates') return 'Кинотеатр не работает'
		},

		modalWidth () {
			return 800
		},
	},

	methods: {
		openSeatModal (e, filmID, seanceID) {
			if (!this.modalState) {
				this.$store.dispatch('data/openFilmSeat', {
					filmID: filmID,
					seanceID: seanceID,
				})
			} else {
				this.$store.dispatch('data/closeModal')
			}
		}
	},

}
</script>

<style lang="scss" scoped>
	.btn-disabled {
		opacity: .5;
	}
</style>