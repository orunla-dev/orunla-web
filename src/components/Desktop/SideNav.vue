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
      v-if="user.uid"
    >
      <i class="icofont-logout"></i>
      Log Out
    </a>
    <router-link
      v-else
      :to="`/auth/login?continue=${$route.path}`"
      class="absolute bottom-10 py-3 pl-8 pr-10 font-semibold rounded-full bg-primary text-white justify-self-end flex gap-3 items-center"
    >
      <i class="icofont-sign-in"></i>
      Log In
    </router-link>
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";
import { UID } from "@/utils/constants";

export default {
  name: "DesktopSideNav",
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async logUserOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        this.$message.error(error);
      } else {
        // delete localStorage and return vuex to default
        localStorage.removeItem(UID);
        this.$store.commit("SET_USER", {});
        this.$store.commit("SET_USER_LIST", []);
        this.$store.commit("SET_NOTIFICATION", []);
        this.$message.info("You've been logged out.");
        this.$router.go();
      }
    },
  },
};
</script>
