<template>
  <div class="flex gap-1">
    <i
      class="icofont-star text-primary text-lg"
      v-for="i in stars"
      :key="i"
    ></i>
    <i
      class="icofont-ui-rate-blank text-primary"
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

<!--- style scoped lang="scss">
$active-color: #f3d23e;

.rating {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 22px;
  color: #a7a8a8;
}
.list {
  margin: 0 0 5px 0;
  padding: 0;
  list-style-type: none;
  &:hover {
    .star {
      color: $active-color;
    }
  }
}
.star {
  display: inline-block;
  cursor: pointer;
  &:hover {
    & ~ .star {
      &:not(.active) {
        color: inherit;
      }
    }
  }
}
.active {
  color: $active-color;
}
</style --->
