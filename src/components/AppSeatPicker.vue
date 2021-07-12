<template>
	<div class="seat-picker-wrpp d-flex flex-column align-center">

		<div class="screen grey mb-3"></div>

		<div>
			<div
				class="hall-row"
				v-for="(row, i) in hall"
				:key="'row-' + i"
			>

				<div 
					v-if="row.row !== null"
					class="d-flex justify-center mt-1"
				>

					<div 
						class="text-caption mr-2"
					>{{ row.row }}</div>

					<div class="d-flex">
						<app-seat-picker-seat
							v-for="(seat, j) in row.seats"
							:key="'seat-' + i + '-' + j"
							:state="seat.state"
							:seat="seat.seat"
							class="ml-1"
							@seatClick=" seatClick($event, row.row, seat.seat) "
						></app-seat-picker-seat>
					</div>
					
					<div 
						class="text-caption ml-3"
					>{{ row.row }}</div>

				</div>

				<div v-else class="mt-5"></div>

			</div>
		</div>
		
	</div>
</template>

<script>
import { mapGetters } from 'vuex'

import AppSeatPickerSeat from './AppSeatPickerSeat.vue'

export default {

	components: {
		AppSeatPickerSeat,
	},

	computed: {
		...mapGetters('data', {
			seanceID: 'getSelectedSeanceID',
			filmID: 'getSelectedFilmID',
			hall: 'getSelectedHall',
		}),
	},

	methods: {
		seatClick (e, row, seat ) {
			this.$store.dispatch('data/seatClick', {
				row: row,
				seat: seat,
			})
		}
	}

}
</script>

<style lang="scss" scoped>

.seat-picker-wrpp {
	width: 500px;

	.screen {
		width: 400px;
		height: 7px;
		border-radius: 20px;
	}
}

</style>