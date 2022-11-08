<template>
  <header
    class="bg-white flex justify-between items-center p-5 fixed top-0 right-0 left-0 z-40"
  >
    <img src="@/assets/Logo.png" class="w-28" />
    <div class="flex gap-5">
      <router-link to="/search">
        <i class="icofont-search text-2xl text-primary"></i>
      </router-link>
      <button @click="showSideNav = true">
        <hamburger-icon />
      </button>
    </div>
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
