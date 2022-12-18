<template>
  <div class="flex gap-1 text-3xl md:text-5xl">
    <i
      class="icofont-star text-primary cursor-pointer"
      :class="stars >= i ? '' : 'opacity-40'"
      v-for="i in 5"
      :key="`open-${i}`"
      @mouseover="stars = i"
      @click="rate(i)"
    ></i>
  </div>
</template>

<script>
export default {
  name: "StarRater",
  data() {
    return {
      stars: 0,
    };
  },
  methods: {
    rate(star) {
      this.$emit("rated", star);
    },
  },
};
</script>
