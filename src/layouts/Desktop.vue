<template>
  <div class="min-h-screen bg-white overflow-hidden">
    <Header />
    <div class="flex gap-5 mt-16 py-2 px-20 overflow-hidden">
      <side-nav class="w-2/12" />
      <div class="overflow-auto w-10/12 mt-10">
        <div
          class="border rounded-lg p-5 bg-white flex items-end mb-5"
          v-if="trialModal"
        >
          <div class="w-1/2">
            <div class="">
              <h3 class="font-bold mb-5 text-primary text-xl">Try Orunla</h3>
              <p class="mb-5">
                Get started to Orunla with a free trial. Free trial includes
                access to all premuim features.
              </p>
            </div>
            <el-button
              @click="startTrial()"
              type="primary"
              class="bg-primary font-bold w-1/2"
              :loading="submitting"
            >
              Start 30 days trial
            </el-button>
            <p class="mt-2 text-xs">
              Premium cost only <b>&#8358;1,500</b> monthly. Cancel anytime.
            </p>
          </div>
        </div>
        <div class="pt-3" v-else-if="user.username === null">
          <div
            class="mb-5 border-green-500 border p-5 rounded-md bg-green-500 bg-opacity-5"
          >
            <div class="text-sm mb-5">
              <h1 class="font-bold text-xl">Complete your profile</h1>
              <p class="">
                Orunla is best experienced with a complete profile.
              </p>
            </div>
            <router-link to="/profile/edit">
              <el-button type="success">Tell us more about you</el-button>
            </router-link>
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { updateProfile, fetchProfile } from "@/services/profile";
import { UID } from "@/utils/constants";

export default {
  name: "DesktopWrapper",
  components: {
    Header: () => import("@/components/Desktop/Header.vue"),
    SideNav: () => import("@/components/Desktop/SideNav.vue"),
  },
  data() {
    return {
      trialModal: false,
      submitting: false,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    $route() {
      this.alertModal();
    },
  },
  async mounted() {
    this.alertModal();
  },
  methods: {
    alertModal() {
      if (this.user.next_sub_date === null) {
        this.trialModal = true;
      }
    },
    async fetchUserProfile() {
      await fetchProfile(localStorage.getItem(UID))
        .then(async (response) => {
          this.$store.commit("SET_USER", response[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async startTrial() {
      this.submitting = true;
      const payload = {
        next_sub_date: this.moment().add(1, "months").format(),
        plan: "trial", // trial, freenium, premium,
      };
      await updateProfile(localStorage.getItem(UID), payload)
        .then(() => {
          this.trialModal = false;
          this.$message.success(
            `Trial activated, subscription would begin ${this.moment(
              payload.next_sub_date
            ).format("DD-MMMM-YYY")}`
          );
          this.fetchUserProfile();
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = true;
    },
  },
};
</script>
