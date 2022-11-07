<template>
  <div class="min-h-screen bg-secondary bg-opacity-10 overflow-hidden">
    <Header />
    <div class="flex gap-5 mt-16 py-2 px-20 overflow-hidden">
      <side-nav class="w-2/12" />
      <router-view class="overflow-auto w-10/12" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DesktopWrapper",
  components: {
    Header: () => import("@/components/Desktop/Header.vue"),
    SideNav: () => import("@/components/Desktop/SideNav.vue"),
  },
};
</script>
