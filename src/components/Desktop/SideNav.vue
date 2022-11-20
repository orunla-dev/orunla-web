<template>
  <div class="flex flex-col items-start gap-5 py-10">
    <router-link
      to="/"
      :class="
        $route.path === '/'
          ? 'border border-primary bg-primary bg-opacity-20 text-primary'
          : 'bg-gray-300 bg-opacity-30 text-gray-700'
      "
      class="py-3 pl-8 pr-12 font-semibold rounded-full flex gap-3 items-center"
    >
      <i class="icofont-ui-home"></i>
      Home
    </router-link>
    <router-link
      to="/books"
      :class="
        $route.path.includes('/books')
          ? 'border border-primary bg-primary bg-opacity-20 text-primary'
          : 'bg-gray-300 bg-opacity-30 text-gray-700'
      "
      class="py-3 pl-8 pr-16 font-semibold rounded-full flex gap-3 items-center"
    >
      <i class="icofont-book"></i>
      Books
    </router-link>
    <router-link
      to="/lists"
      :class="
        $route.path.includes('/lists')
          ? 'border border-primary bg-primary bg-opacity-20 text-primary'
          : 'bg-gray-300 bg-opacity-30 text-gray-700'
      "
      class="py-3 pl-8 pr-16 font-semibold rounded-full flex gap-3 items-center"
    >
      <i class="icofont-list"></i>
      My Lists
    </router-link>
    <router-link
      to="/me/settings"
      :class="
        $route.path.includes('/me/settings')
          ? 'border border-primary bg-primary bg-opacity-20 text-primary'
          : 'bg-gray-300 bg-opacity-30 text-gray-700'
      "
      class="py-3 pl-8 pr-16 font-semibold rounded-full flex gap-3 items-center"
    >
      <i class="icofont-settings"></i>
      Settings
    </router-link>
    <a
      href="#logout"
      @click.prevent="logUserOut()"
      class="absolute bottom-10 py-3 pl-8 pr-10 font-semibold rounded-full bg-red-300 bg-opacity-30 text-red-700 justify-self-end flex gap-3 items-center"
    >
      <i class="icofont-logout"></i>
      Log Out
    </a>
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";

export default {
  name: "DesktopSideNav",
  methods: {
    async logUserOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        this.$message.error(error);
      } else {
        this.$message.info("You've been logged out.");
        this.$router.push("/auth");
      }
    },
  },
};
</script>
