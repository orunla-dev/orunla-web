<template>
  <div class="flex gap-1" :title="`Rated ${stars} stars`">
    <i class="icofont-star text-primary" v-for="i in stars" :key="i"></i>
    <i
      class="icofont-star text-primary opacity-40"
      v-for="i in 5 - stars"
      :key="`open-${i}`"
    ></i>
  </div>
</template>

<script>
export default {
  props: {
    grade: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      stars: ~~this.grade, // Removes the decimal point
    };
  },
  methods: {
    rate(star) {
      if (typeof star === "number" && star <= 5 && star >= 0)
        this.stars = this.stars === star ? star - 1 : star;
    },
  },
};
</script>
