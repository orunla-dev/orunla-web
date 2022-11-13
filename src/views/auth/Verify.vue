<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-16 md:white flex justify-center items-center flex-col"
  >
    <div
      class="rounded-md shadow-md p-5 w-full md:w-1/4"
      v-if="$route.query.mode === 'verifyEmail'"
    >
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-4/12 text-center" />
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
        <h1 class="text-red-500 font-bold text-3xl mb-5">
          Something doesn't look right
        </h1>
        An Error occured while verifying your email address. Click the link sent
        to your email to try again
        <p class="text-red-500 text-xs mt-5">{{ verify.message }}</p>
      </div>
    </div>
    <div
      class="rounded-md shadow-md p-5 w-full md:w-1/4"
      v-else-if="$route.query.mode === 'resetPassword'"
    >
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-4/12 text-center" />
      </div>
      <p class="mb-3 mt-10">Please provide a new password for your account.</p>
      <ValidationObserver v-slot="{ invalid }">
        <el-form>
          <ValidationProvider
            name="Password"
            v-slot="{ errors }"
            rules="required|alpha_num|min:8"
          >
            <label class="font-semibold text-primary mb-1 block mt-3">
              Password
            </label>
            <el-input
              placeholder="Min. 8 alphanumeric"
              :type="show ? 'password' : 'text'"
              v-model="auth.password"
              class="flex items-center rounded-md"
              :class="errors[0] ? 'border border-red-300' : ''"
            >
              <i
                slot="suffix"
                class="icofont-eye-alt el-input__icon mr-1 text-lg"
                v-if="show"
                @click="show = !show"
              ></i>
              <i
                slot="suffix"
                class="icofont-eye-blocked el-input__icon mr-1 text-lg"
                v-else
                @click="show = !show"
              ></i>
            </el-input>
            <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
          </ValidationProvider>
          <ValidationProvider
            name="Confirm password"
            v-slot="{ errors }"
            :rules="`required|is:${auth.password}`"
          >
            <label class="font-semibold text-primary mb-1 block mt-5">
              Confirm Password
            </label>
            <el-input
              placeholder="Confirm password"
              :type="showConfirm ? 'password' : 'text'"
              v-model="auth.confirm_password"
              class="flex items-center rounded-md"
              :class="errors[0] ? 'border border-red-300' : ''"
            >
              <i
                slot="suffix"
                class="icofont-eye-alt el-input__icon mr-1 text-lg"
                v-if="showConfirm"
                @click="showConfirm = !showConfirm"
              ></i>
              <i
                slot="suffix"
                class="icofont-eye-blocked el-input__icon mr-1 text-lg"
                v-else
                @click="showConfirm = !showConfirm"
              ></i>
            </el-input>
            <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
          </ValidationProvider>
          <div class="my-10"></div>
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="resetPassword"
            :loading="submitting"
          >
            Save Password
          </el-button>
        </el-form>
        <div class="text-center my-5">
          <router-link to="/" class="text-primary underline">
            Cancel
          </router-link>
        </div>
      </ValidationObserver>
    </div>
    <p class="mt-5 text-gray-400 text-xs">
      &copy; Orunla Africa, {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

<script>
// import { applyActionCode, updatePassword } from "@firebase/auth";
// import { auth } from "@/config/firebase";

export default {
  name: "verificationPage",
  data() {
    return {
      mode: "",
      auth: {
        password: "",
        confirm_password: "",
      },
      show: true,
      showConfirm: true,
      submitting: false,
      verify: {
        waiting: true,
        success: false,
        error: false,
        message: "",
      },
    };
  },
  methods: {
    resetPassword() {
      this.submitting = true;
      // const vm = this;
      // updatePassword(auth, this.auth.password)
      //   .then(() => {
      //     vm.$message.success("Password updated successfully, please log in");
      //     vm.$router.push("/auth/login");
      //   })
      //   .catch((error) => {
      //     vm.$message.error(error.message);
      //     vm.submitting = false;
      //   });
    },
    verifyEmail() {
      // const vm = this;
      // applyActionCode(auth, this.$route.query.oobCode)
      //   .then((response) => {
      //     vm.verify.waiting = false;
      //     vm.verify.success = true;
      //     console.log(response);
      //     setTimeout(() => {
      //       vm.$router.push("/auth/login");
      //     }, 5000);
      //   })
      //   .catch((error) => {
      //     vm.verify.waiting = false;
      //     vm.verify.error = true;
      //     vm.verify.message = error.message;
      //   });
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
