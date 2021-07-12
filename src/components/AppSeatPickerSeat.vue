<template>
	<div class="seat-wrpp-0 d-flex justify-center align-center">
		<v-hover v-slot="{ hover }">
			<div 
				class="seat-wrpp-1" 
				:class=" hover && ( state == 'free' || state == 'selected' ) ? 'hover' : '' "
			>
				<transition name="seat-scale" mode="out-in">
					<div
						class="seat d-flex justify-center align-center"
						:class=" seatClass "
						@click=" seatClick "
						:key=" state "
					>
						<div 
							v-show=" hover && ( state == 'free' || state == 'selected' )"
							class="secondary--text text-caption seat-num"
						>{{ seat }}</div>
					</div>
				</transition>
			</div>
		</v-hover>
	</div>
</template>

<script>

export default {
	props: {
		state: {
			type: String,
			required: true,
		},
		seat: {
			required: true,
		}
	},

	computed: {

		seatClass () {
			if (this.state == 'free') return 'seat-free grey'
			if (this.state == 'booked') return 'seat-booked grey'
			if (this.state == 'selected') return 'seat-selected primary'
			
			return 'seat-null'
		},

	},

	methods: {
		seatClick () {
			if ( this.state != 'null' && this.state != 'booked' ) {
				this.$emit('seatClick')
			}
		}
	}
};

</script>

<style lang="scss" scoped>
.seat-wrpp-0 {
	height: 20px;
	width: 20px;

	.seat-wrpp-1 {
		height: 90%;
		width: 90%;

		.seat {
			height: 100%;
			width: 100%;
			border-radius: 3px;

			.seat-num {
				padding-top: 2px;
			}
		}

		.seat.seat-free {
			cursor: pointer;
		}

		.seat.seat-booked {
			opacity: .5;
		}

		.seat.seat-selected {
			cursor: pointer;
		}

		.seat.seat-null {
			opacity: 0;
		}
	}

	.seat-wrpp-1.hover {
		height: 100%;
		width: 100%;
	}
}

.seat-scale-enter-active {
	animation: scale-in .2s;
}

.seat-scale-leave-active {
	animation: scale-out .2s;
}

@keyframes scale-in {
	0% {
		transform: scale(0);
	}

	100% {
		transform: scale(1);
	}
}

@keyframes scale-out {
	0% {
		transform: scale(1);
	}

	100% {
		transform: scale(0);
	}
}
</style>
