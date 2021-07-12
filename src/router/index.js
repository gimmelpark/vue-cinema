import Vue from 'vue'
import VueRouter from 'vue-router'

import AppHome from '@/views/AppHome.vue'
import AppSeances from '@/views/AppSeances.vue'
import AppAbout from '@/views/AppAbout.vue'
import AppFilmInf from '@/views/AppFilmInf.vue'
import App404Page from '@/views/App404Page.vue'

Vue.use(VueRouter)

const routes = [
	
	{
		path: '/',
		name: 'home',
		component: AppHome,
	},
	{
		path: '/seances',
		name: 'seances',
		component: AppSeances,
	},
	{
		path: '/about',
		name: 'about',
		component: AppAbout,
	},
	{
		path: '/film/:filmID',
		name: 'filmInf',
		component: AppFilmInf,
	},

	
	{
		path: '*',
		name: '404Page',
		component: App404Page,
	},
	
]

const router = new VueRouter({
	// mode: 'history',
	routes
})

export default router
