<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-24 md:white flex justify-center items-center flex-col"
  >
    <div class="rounded-md shadow-md p-5 w-full md:w-1/4">
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-5/12 text-center" />
      </div>
      <p class="mb-3 mt-10">
        Please provide your valid email for a password reset link.
      </p>
      <ValidationObserver v-slot="{ invalid }">
        <el-form>
          <ValidationProvider
            name="Email"
            v-slot="{ errors }"
            rules="required|email"
          >
            <label class="font-semibold text-primary mb-1 block"> Email </label>
            <el-input
              placeholder="jack@doe.com"
              type="email"
              v-model="auth.email"
              class="flex items-center rounded-md"
              :class="errors[0] ? 'border border-red-300' : ''"
            >
              <i
                slot="suffix"
                class="icofont-email el-input__icon mr-1 text-lg"
              ></i>
            </el-input>
            <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
          </ValidationProvider>
          <div class="mt-10" />
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="resetPassword"
            :loading="submitting"
          >
            Request Password Reset
          </el-button>
          <p class="mt-5 text-center">
            Already have an account?
            <router-link
              v-if="$route.query.continue !== undefined"
              :to="`/auth/login?continue=${$route.query.continue}`"
              class="text-primary font-semibold underline"
            >
              log in
            </router-link>
            <router-link
              v-else
              to="/auth/login"
              class="text-primary font-semibold underline"
            >
              log in
            </router-link>
          </p>
        </el-form>
      </ValidationObserver>
    </div>
    <p class="mt-5 text-gray-400 text-xs">
      &copy; Orunla Africa, {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

<script>
// import { sendPasswordResetEmail } from "@firebase/auth";
// import { auth } from "@/config/firebase";

export default {
  name: "ResetPasswordView",
  data() {
    return {
      auth: {
        email: "",
      },
      show: true,
      showConfirm: true,
      submitting: false,
    };
  },
  metaInfo: {
    meta: [
      {
        vmid: "description",
        name: "description",
        content: "Log In to Orunla Africa.",
      },
    ],
    title: "Log In",
  },
  methods: {
    resetPassword() {
      this.submitting = true;
      // const vm = this;

      //   sendPasswordResetEmail(auth, this.auth.email)
      //     .then(() => {
      //       vm.$message.success("Password reset email sent");
      //       if (this.$route.query.continue) {
      //         vm.$router.push(
      //           `/auth/login?continue=${this.$route.query.continue}`
      //         );
      //       } else {
      //         vm.$router.push("/auth/login");
      //       }
      //     })
      //     .catch((error) => {
      //       this.$message.error(error.message);
      //     });
      //   this.submitting = false;
    },
  },
};
</script>
