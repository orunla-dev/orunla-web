<template>
  <div class="bg-gray-50 min-h-screen">
    <Header />
    <div
      class="mt-20 -mb-16 px-5 border-b border-t py-10 bg-white"
      v-if="trialModal"
    >
      <h3 class="font-bold mb-5 text-primary text-xl">Try Orunla</h3>
      <p class="mb-5">
        Get started to Orunla with a free trial. Free trial includes access to
        all premuim features.
      </p>
      <el-button
        @click="startTrial()"
        type="primary"
        class="bg-primary font-bold w-full"
        :loading="submitting"
      >
        Start 30 days trial
      </el-button>
      <p class="mt-2 text-sm">
        Premium cost only <b>&#8358;1,500</b> monthly. Cancel anytime.
      </p>
    </div>
    <div
      class="pt-3"
      v-else-if="user.username === null && $route.path != '/profile/edit'"
    >
      <div
        class="mt-20 -mb-16 mx-5 border-green-500 border p-3 rounded-md bg-green-500 bg-opacity-5"
      >
        <div class="text-sm mb-5">
          <h1 class="font-bold text-xl">Complete your profile</h1>
          <p class="">Orunla is best experienced with a complete profile.</p>
        </div>
        <router-link to="/profile/edit">
          <el-button type="success">Tell us more about you</el-button>
        </router-link>
      </div>
    </div>
    <router-view class="my-16 p-5" />
    <Footer />
  </div>
</template>

<script>
import { updateProfile } from "@/services/profile";
import { UID } from "@/utils/constants";

export default {
  name: "MobileWrapper",
  components: {
    Footer: () => import("@/components/Mobile/Footer.vue"),
    Header: () => import("@/components/Mobile/Header.vue"),
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
    async startTrial() {
      this.submitting = true;
      const payload = {
        next_sub_date: this.moment().add(1, "months").format(),
        plan: "trial", // trial, freenium, premium,
      };
      await updateProfile(localStorage.getItem(UID), payload)
        .then((response) => {
          this.trialModal = false;
          this.$message.success(
            `Trial activated, subscription would begin ${this.moment(
              payload.next_sub_date
            ).format("DD-MMMM-YYY")}`
          );
          this.$store.commit("SET_USER", response[0]);
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = true;
    },
  },
};
</script>
