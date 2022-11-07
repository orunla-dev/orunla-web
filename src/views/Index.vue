<template>
  <div id="app">
    <mobile-wrapper v-if="breakpoints.smAndDown" />
    <desktop-wrapper v-else />
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
export default {
  name: "app",
  data() {
    return {
      breakpoints,
    };
  },
  components: {
    MobileWrapper: () => import("@/layouts/Mobile.vue"),
    DesktopWrapper: () => import("@/layouts/Desktop.vue"),
  },
};
</script>
