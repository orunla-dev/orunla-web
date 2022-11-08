<template>
  <div class="bg-gray-50 min-h-screen">
    <Header />
    <router-view class="my-16" />
    <Footer />
  </div>
</template>

<script>
export default {
  name: "MobileWrapper",
  components: {
    Footer: () => import("@/components/Mobile/Footer.vue"),
    Header: () => import("@/components/Mobile/Header.vue"),
  },
};
</script>
