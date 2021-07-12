<template>
	<div>
		<!-- <div class="font-weight-medium  flex-shrink-0">
			{{ title }}
		</div> -->
		<div v-if="!showMoreBtn" class="pl-3 text--secondary">
			{{ contentText }}
		</div>

		<div v-else class="pl-3 text--secondary">
			<span>{{ contentArrayVisible }}</span>

			<span v-show="showAll">{{ contentArrayHidden }}</span>
			
			<a
				@click="showAll = !showAll"
				class="pl-2 orange--text text--darken-4 show-more-btn"
			>{{ showMoreBtnText }}</a>
		</div>
	</div>
</template>

<script>
export default {

	props: {
		// title: {
		// 	type: String,
		// 	required: true,
		// },
		content: {
			type: [String, Array],
			required: true,
		},
	},

	data: () => ({
		showMoreBtn: false,
		showAll: false,

		visibleCnt: 4,
		hiddenCnt: 0,
	}),

	computed: {

		contentArrayVisible () {
			let str = this.content.reduce((str, cur, j) => {
				if (j >= this.visibleCnt) return str
				return j == 0 ? str + cur : str + ', ' + cur
			}, '');

			return str
		},

		contentArrayHidden () {
			let str = this.content.reduce((str, cur, j) => {
				if (j < this.visibleCnt) return str
				return j == 0 ? str + cur : str + ', ' + cur
			}, '');

			return str
		},

		contentText () {
			let content = this.content

			if (typeof(content) === 'string') return content

			if ((typeof(content) === 'object') && Array.isArray(content)) {

				if (content.length <= this.visibleCnt) {
					let str = content.reduce((str, cur, j) => {
						return j == 0 ? str + cur : str + ', ' + cur
					}, '');

					if (str === '') return 'Неизвестно'

					return str
				}

				this.hiddenCnt = content.length - this.visibleCnt
				this.showMoreBtn = true
			}

			return ''
		},

		showMoreBtnText () {
			return this.showAll ? 'скрыть' : 'ещё ' + this.hiddenCnt
		},
	}
}
</script>

<style lang="scss" scoped>

	.show-more-btn:hover {
		text-decoration: underline;
	}

</style>