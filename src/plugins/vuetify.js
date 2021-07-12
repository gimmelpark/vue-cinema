import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

import ru from 'vuetify/es5/locale/ru'

import colors from 'vuetify/lib/util/colors'

export default new Vuetify({
	lang: {
		locales: { ru },
		current: 'ru',
	},
	theme: {
		themes: {
			light: {
				primary: {
					base: colors.orange.darken1,
					darken1: colors.orange.darken2,
					darken2: colors.orange.darken3,
					lighten1: colors.orange.base,
				},
				secondary: '#ffffff',
				background0: colors.grey.lighten1,
				background1: colors.grey.lighten5,
				background2: colors.grey.lighten4,
				accent: colors.orange.darken3,
				error: colors.red.accent3,
				acept: colors.green.darken1,
			},
		},
	},
});
