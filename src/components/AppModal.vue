<template>
	<div class="d-flex justify-center">
		<v-card width="800" min-height="200">

			<template v-if=" modalContent === 'film-seances' ">
				<app-film-seances></app-film-seances>
			</template>

			<template v-else-if=" modalContent === 'film-seat' ">
				<app-film-seat></app-film-seat>
			</template>

			<template v-else-if=" modalContent === 'order-confirm' ">
				<app-order-confirm></app-order-confirm>
			</template>

			<template v-else-if=" modalContent === 'payment' ">
				<app-payment></app-payment>
			</template>

		</v-card>
	</div>
	
</template>

<script>
import { mapGetters } from 'vuex'

import AppFilmSeances from './Modals/AppFilmSeances.vue'
import AppFilmSeat from './Modals/AppFilmSeat.vue'
import AppOrderConfirm from './Modals/AppOrderConfirm.vue'
import AppPayment from './Modals/AppPayment.vue'

export default {

	components: {
		AppFilmSeances,
		AppFilmSeat,
		AppOrderConfirm,
		AppPayment,
	},

	computed: {
		...mapGetters ('data', {
			modalContent: 'getModalContent',
		}),
	}

}
</script>