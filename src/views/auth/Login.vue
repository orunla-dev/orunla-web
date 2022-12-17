<template>
  <div
    class="h-screen bg-white overflow-hidden px-10 py-24 md:white flex justify-center items-center flex-col"
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
            rules="required|min:8"
          >
            <div class="mb-1 mt-5 flex justify-between">
              <label class="font-semibold text-primary block">Password</label>
              <router-link
                v-if="$route.query.continue !== undefined"
                :to="`/auth/reset-password?continue=${$route.query.continue}`"
                class="text-xs underline"
              >
                Reset Password
              </router-link>
              <router-link
                v-else
                to="/auth/reset-password"
                class="text-xs underline"
              >
                Reset Password
              </router-link>
            </div>
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
          <div class="mt-10" />
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="signIn"
            :loading="submitting"
          >
            Log In
          </el-button>
          <p class="mt-5 text-center">
            New to Orunla?
            <router-link
              v-if="$route.query.continue !== undefined"
              :to="`/auth/register?continue=${$route.query.continue}`"
              class="text-primary font-semibold underline"
            >
              Register account
            </router-link>
            <router-link
              v-else
              to="/auth/register"
              class="text-primary font-semibold underline"
            >
              Register account
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
import { UID } from "@/utils/constants";
import { supabase } from "@/config/supabase";
import { fetchProfile, fetchNotification } from "@/services/profile";
import { fetchList } from "@/services/books";

export default {
  name: "LoginView",
  data() {
    return {
      auth: {
        email: "",
        password: "",
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
    async signIn() {
      this.submitting = true;
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          ...this.auth,
        });
        if (error) throw Error(error);
        if (data.user) {
          localStorage.setItem(UID, data.session.user.id);
          await fetchProfile(data.session.user.id)
            .then(async (response) => {
              this.$store.commit("SET_USER", response[0]);
              // fetch reading, then list, then notifications
              await fetchList(data.session.user.id).then(async (lists) => {
                this.$store.commit("SET_USER_LIST", lists);
                await fetchNotification(data.session.user.id).then(
                  (response) => {
                    this.$store.commit("SET_NOTIFICATION", response);
                    setTimeout(() => {
                      if (this.$route.query.continue) {
                        this.$router.replace(this.$route.query.continue);
                      } else {
                        this.$router.replace("/");
                      }
                      this.$message.success("Welcome back, champ!");
                      this.submitting = false;
                    }, 1000);
                  }
                );
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        this.$message.error(error);
        this.submitting = false;
      }
    },
  },
};
</script>
