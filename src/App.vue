<template>
	<v-app>

		<v-app-bar app dense color="background2">
			<v-tabs color="primary darken-2">

				<v-tab
					exact
					v-for="(route, i) in routes"
					:key="'route-' + i"
					:to="{ name: route.routeName }"
				>
					<v-icon small class="mr-2"> mdi-{{ route.iconName }} </v-icon>
					{{ route.title }}
				</v-tab>

			</v-tabs>
		</v-app-bar>

		<v-main class="background0">

			<v-container 
				:style="'width:' + pageWidth + 'px;'"
				class="background1 pa-0 content-container"
			>
				<router-view></router-view>
			</v-container>

		</v-main>

		<v-footer padless color="background2 darken-1" elevation="15">
			<v-col cols="12" class="text-center grey--text text--darken-2 my-5">

				<a href="mailto:dmitriy_kochetov@list.ru" class="grey--text text--darken-2 footer-ref">Dmitriy Kochetov</a>

				<span> | 2021 | Vue.js</span>
				
			</v-col>
		</v-footer>

	</v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'App',

	components: {

	},

	created () {
		this.$store.dispatch('seances/seancesInit')
		this.$store.dispatch('movies/moviesInit')
	},

	data: () => ({
		routes: [
			{
				title: 'афиша',
				routeName: 'home',
				iconName: 'movie-open',
			},
			{
				title: 'сеансы',
				routeName: 'seances',
				iconName: 'video-vintage',
			},
			{
				title: 'кинотеатр',
				routeName: 'about',
				iconName: 'theater',
			},
		],

		footerRefs: [
			{
				icon: ''
			}
		],
	}),

	computed: {
		...mapGetters('seances', {
			maxDate: 'getMaxDate',
			allowedDates: 'getAllowedDates',
		}),
		pageWidth () {
			switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 320
        case 'sm': return 600
        case 'md': return 900
        case 'lg': return 1100
        case 'xl': return 1400
			}
    },

	},

};
</script>

<style lang="scss">
.content-container {
	min-height: calc(100vh - 48px);
}

.footer-ref {
	text-decoration: none;
}

.footer-ref:hover {
	text-decoration: underline;
}
</style>
