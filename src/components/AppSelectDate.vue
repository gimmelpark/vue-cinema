<template>
	<div class="d-flex">
		<v-btn
			:class="todayBtnClass"
			outlined
			@click="dayBtnClick(todayStr)"
			:disabled="!allowedDates(todayStr)"
		>
			сегодня
		</v-btn>

		<v-btn
			class="ml-3"
			:class="tomorrowBtnClass"
			outlined
			@click="dayBtnClick(tomorrowStr)"
			:disabled="!allowedDates(tomorrowStr)"
		>
			завтра
		</v-btn>

		<v-menu offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					width="200"
					class="ml-3"
					outlined
					:class="selectBtnClass"
					v-bind="attrs"
					v-on="on"
					:disabled="selectedDate == 'no-dates'"
				>
					<v-icon small class="mr-2">
						mdi-calendar
					</v-icon>
					{{ selectBtnText }}
				</v-btn>
			</template>

			<v-date-picker
				:value="selectedDate"
				@change="dayBtnClick"
				first-day-of-week="1"
				:min="todayStr"
				:max="maxDate"
				:allowed-dates="allowedDates"
			></v-date-picker>

		</v-menu>
		
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import t from '@/modules/timeFunctions.js'

export default {
	props: {
		targetDate: {
			type: String,
			default: 'seances',
		},
	},

	computed: {
		...mapGetters('seances', {
			maxDate: 'getMaxDate',
			allowedDates: 'getAllowedDates',
		}),

		selectedDate () {
			return this.targetDate == 'seances' ? 
				this.$store.getters['seances/getSelectedDate'] :
				this.$store.getters['data/getSelectedFilmDate']
		},

		todayStr () {
			return t.toISO(new Date())
		},

		tomorrowStr () {
			return t.toISO(new Date(new Date().getTime() + 86400000))
		},

		todayBtnClass () {
			return {
				'primary secondary--text': this.selectedDate == this.todayStr,
				'primary--text text--darken-2': this.selectedDate != this.todayStr,
				'btn-disabled': !this.allowedDates(this.todayStr)
			}
		},

		tomorrowBtnClass () {
			return {
				'primary secondary--text': this.selectedDate == this.tomorrowStr,
				'primary--text text--darken-2': this.selectedDate != this.tomorrowStr,
				'btn-disabled': !this.allowedDates(this.tomorrowStr)
			}
		},

		selectBtnClass () {
			if (this.selectedDate == 'no-dates') return 'primary--text text--darken-2 btn-disabled'

			return this.selectedDate != this.tomorrowStr && this.selectedDate != this.todayStr ?
				'primary secondary--text' : 
				'primary--text text--darken-2'
		},

		selectBtnText () {

			let day = new Date(this.selectedDate)

			if (this.selectedDate == 'no-dates') return 'выбрать дату'

			return this.selectedDate != this.tomorrowStr && this.selectedDate != this.todayStr ?
				t.weekDayStr(day.getDay()) + ', ' + day.getDate() + ' ' + t.monthStr(day.getMonth()) : 
				'выбрать дату'
		},

	},

	methods: {

		dayBtnClick (date) {
			if (this.targetDate == 'seances') {
				this.$store.dispatch('seances/setDate', date)
			} else {
				this.$store.dispatch('data/setDate', date)
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