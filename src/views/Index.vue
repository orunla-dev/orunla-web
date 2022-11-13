<template>
  <div id="app">
    <mobile-wrapper v-if="breakpoints.smAndDown" />
    <desktop-wrapper v-else />
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
import { fetchProfile } from "@/services/profile";
import { UID } from "@/utils/constants";

export default {
  name: "appEntry",
  data() {
    return {
      breakpoints,
      submitting: false,
    };
  },
  methods: {
    async fetchUserProfile() {
      await fetchProfile(localStorage.getItem(UID))
        .then((response) => {
          this.$store.commit("SET_USER", response[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
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
  async mounted() {
    if (JSON.stringify(this.user) === "{}") {
      this.fetchUserProfile();
    }
  },
};
</script>
