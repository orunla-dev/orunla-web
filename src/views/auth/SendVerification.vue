<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-24 md:white flex justify-center items-center flex-col"
  >
    <div class="rounded-md shadow-md p-5 w-full md:w-1/4">
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-5/12 text-center" />
      </div>
      <p class="mb-3 mt-10">Please provide a new password</p>
      <ValidationObserver v-slot="{ invalid }">
        <el-form>
          <ValidationProvider
            name="Password"
            v-slot="{ errors }"
            rules="required|min:8"
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
          <div class="mt-10" />
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="savePassword"
            :loading="submitting"
          >
            Save Password
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
import { saveUserPassword } from "@/services/auth";

export default {
  name: "ResetPasswordView",
  data() {
    return {
      auth: {
        password: "",
        confirm_password: "",
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
    title: "Reset Password",
  },
  methods: {
    async savePassword() {
      this.submitting = true;
      await saveUserPassword(this.auth.email)
        .then((response) => {
          console.log(response);
          this.$message.success("Password reset successfully");
          if (this.$route.query.continue) {
            this.$router.push(
              `/auth/login?continue=${this.$route.query.continue}`
            );
          } else {
            this.$router.push("/auth/login");
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
  },
};
</script>
