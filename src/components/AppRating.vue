<template>
  <div>
    <v-icon
      v-for="(star, i) in stars"
      :key="'star-' + i"
      color="yellow darken-1"
      small
    >
      mdi-{{starsIcons[star]}}
    </v-icon>
  </div>
</template>

<script>
export default {

  data: () => ({
    starsIcons: {
      '1': 'star',
      '0.5': 'star-half-full',
      '0': 'star-outline',
    }
  }),

  props: {
    length: {
      type: Number,
      default: 5,
    },
    value: {
      type: Number,
      required: true,
    },
    maxValue: {
      type: Number,
      default: 10,
    }
  },

  computed: {
    stars () {
      let stars = Array(this.length).fill(0)

      let starsCount = this.value / this.maxValue * this.length

      stars.forEach((star, i) => {

        stars[i] = i + 1 <= starsCount + 0.25 ? 1 : 0

        if (i > starsCount - 0.76 && i <= starsCount - 0.25) stars[i] = 0.5

      });

      return stars
    }
  },

}
</script>