<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-16 md:white flex justify-center items-center flex-col"
  >
    <div class="rounded-md shadow-md p-5 w-full md:w-1/4">
      <div class="flex items-end justify-start mb-5">
        <img src="@/assets/Logo.png" class="w-3/6 md:w-5/12 text-center" />
      </div>
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
          <div class="mt-10" />
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="signUp"
            :loading="submitting"
          >
            Register account
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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "@firebase/auth";
import { auth } from "@/config/firebase";

export default {
  name: "RegisterView",
  data() {
    return {
      auth: {
        email: "",
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
        content: "Register a free account with Orunla Africa.",
      },
    ],
    title: "Register",
  },
  methods: {
    signUp() {
      this.submitting = true;
      const vm = this;

      createUserWithEmailAndPassword(auth, this.auth.email, this.auth.password)
        .then((userCredential) => {
          const user = userCredential.user;
          sendEmailVerification(user).then(() => {
            this.$message.info(
              `A verification link has been sent to ${vm.auth.email}`
            );
          });
          if (this.$route.query.continue) {
            vm.$router.push(
              `/auth/login?continue=${this.$route.query.continue}`
            );
          } else {
            vm.$router.push("/");
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
      this.submitting = false;
    },
  },
};
</script>
