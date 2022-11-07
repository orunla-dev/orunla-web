<template>
  <header
    class="flex justify-between items-center fixed top-0 right-0 left-0 bg-secondary bg-opacity-0 px-20 py-6"
  >
    <router-link to="/" title="Go back home">
      <img src="@/assets/Logo.png" class="w-24" />
    </router-link>
    <div class="hidden">
      <a
        href="#notification"
        @click.prevent="notification = true"
        class="relative"
      >
        <i class="el-icon-bell text-primary text-3xl font-bold"></i>
        <span
          class="absolute -top-3 left-4 bg-red-500 text-white px-1 rounded-full text-xs"
          >5</span
        >
      </a>
    </div>
  </header>
</template>

<script>
export default {
  name: "DesktopHeader",
  data() {
    return {
      notification: false,
    };
  },
};
</script>

<style></style>
