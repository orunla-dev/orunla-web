<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-16 md:white flex justify-center items-center flex-col"
  >
    <div
      class="rounded-md shadow-md p-5 w-full h-full md:w-1/4"
      v-if="$route.query.mode === 'verifyEmail'"
    >
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-5/12 text-center" />
      </div>
      <div class="" v-if="verify.waiting">
        <h1 class="text-gray-500 font-bold text-2xl mb-5">
          Please wait, while we verify
        </h1>
        We are trying to verify your email. You should not see this unless your
        have a poor internet connection.
      </div>
      <div class="" v-else-if="verify.success">
        <h1 class="text-green-500 font-bold text-2xl mb-5">
          Welcome onboard, champ!
        </h1>
        We are happy to have you onboard. You'll be redirected to log in
        shortly.
      </div>
      <div class="" v-else-if="verify.error">
        <h1 class="text-red-500 font-bold text-2xl mb-5">
          Something doesn't look right
        </h1>
        An Error occured while verifying your email address. Click the link sent
        to your email again.
        <p class="text-red-500 text-xs mt-5">{{ verify.message }}</p>
      </div>
    </div>
    <p class="mt-5 text-gray-400 text-xs">
      &copy; Orunla Africa, {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

<script>
import { applyActionCode } from "@firebase/auth";
import { auth } from "@/config/firebase";

export default {
  name: "verificationPage",
  data() {
    return {
      mode: "",
      verify: {
        waiting: true,
        success: false,
        error: false,
        message: "",
      },
    };
  },
  methods: {
    verifyEmail() {
      const vm = this;
      applyActionCode(auth, this.$route.query.oobCode)
        .then((response) => {
          vm.verify.waiting = false;
          vm.verify.success = true;
          console.log(response);
          setTimeout(() => {
            vm.$router.push("/auth/login");
          }, 5000);
        })
        .catch((error) => {
          vm.verify.waiting = false;
          vm.verify.error = true;
          vm.verify.message = error.message;
        });
    },
  },
  mounted() {
    switch (this.$route.query.mode) {
      case "resetPassword":
        // Display reset password handler and UI.
        this.mode = "reset";
        break;
      case "recoverEmail":
        // Display email recovery handler and UI.
        this.mode = "recover";
        break;
      case "verifyEmail":
        // Display email verification handler and UI.
        this.mode = "verify";
        this.verifyEmail();
        break;
      default:
      // Error: invalid mode.
    }
  },
};
</script>
