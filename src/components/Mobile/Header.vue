<template>
  <header
    class="bg-secondary flex justify-between items-center p-5 fixed top-0 right-0 left-0 z-40"
  >
    <button @click="showSideNav = true">
      <hamburger-icon />
    </button>
    <img src="@/assets/Logo.png" class="w-24" />
    <router-link to="/search">
      <i class="el-icon-search text-2xl text-primary"></i>
    </router-link>
    <side-nav v-if="showSideNav" @close="showSideNav = false" />
  </header>
</template>

<script>
export default {
  name: "Header",
  components: {
    HamburgerIcon: () => import("@/assets/icons/HamburgerIcon.vue"),
    SideNav: () => import("@/components/Mobile/SideNav.vue"),
  },
  data() {
    return {
      showSideNav: false,
    };
  },
  watch: {
    $route() {
      this.showSideNav = false;
    },
  },
};
</script>
