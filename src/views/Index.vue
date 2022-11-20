<template>
  <div id="app">
    <mobile-wrapper v-if="breakpoints.smAndDown" />
    <desktop-wrapper v-else />
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";

export default {
  name: "appEntry",
  data() {
    return {
      breakpoints,
      submitting: false,
    };
  },
  components: {
    MobileWrapper: () => import("@/layouts/Mobile.vue"),
    DesktopWrapper: () => import("@/layouts/Desktop.vue"),
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
};
</script>
