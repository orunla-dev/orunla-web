<!-- eslint-disable no-unused-vars -->
<template>
  <div id="app" ref="main">
    <router-view />
  </div>
</template>

<script>
import { supabase } from "./config/supabase";

export default {
  name: "app",
  metaInfo: {
    titleTemplate: "%s | Orunla Africa",
  },
  mounted() {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("PASSWORD_RECOVERY", session);
        // send the user to reset password page
        this.$router.push("/auth/save-password");
      }
    });
  },
};
</script>
