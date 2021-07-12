<template>
	<div>
		<v-list-item 
			link
			@click="openSeatModal"
		>
			<v-alert
				color="primary"
				class="secondary--text ma-0"
				dense
			>
				{{timeText}}
			</v-alert>
			<div class="ml-8 pb-2 pt-1">

				<div>
					<router-link
						:to="{ name: 'filmInf', params: {filmID: filmID} }"
						class="grey--text text--darken-2 text-h6 film-title"
					>
						{{movie.title}}
					</router-link>
				</div>
				
				<div class="text-subtitle-2 mt-1 mb-1">
					{{price}}р
				</div>

				<div class="d-flex grey--text text--darken-2 text-caption">
					<div>
						{{movie.age}}+
					</div>
					<div class="ml-2">
						{{type}}
					</div>
					<div class="ml-2">
						Зал{{hall}}
					</div>
				</div>

			</div>
		</v-list-item>
		<v-divider></v-divider>
	</div>
	
</template>

<script>


export default {
	
	
	props: {
		hour: {
			type: Number,
			required: true,
		},
		minute: {
			type: Number,
			required: true,
		},
		hall: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		filmID: {
			type: String,
			required: true,
		},
	},

	computed: {
		movie () {
			return this.$store.getters['movies/getMovieByID'](this.filmID)
		},

		timeText () {
			let m = this.minute >= 10 ? String(this.minute) : '0' + String(this.minute)
			return String(this.hour) + ':' + m
		},

	},

	methods: {
		openSeatModal () {
			this.$emit('seanceOnClick')
		}
	}


}
</script>

<style lang="scss" scoped>
.film-title {
	text-decoration: none;
}

.film-title:hover {
	text-decoration: underline;
}
</style>