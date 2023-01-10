<template>
  <header
    class="flex justify-between items-center fixed top-0 right-0 left-0 px-20 py-6 bg-white z-30 shadow-sm"
  >
    <router-link to="/" title="Go back home">
      <img src="@/assets/Logo.png" class="w-24" />
    </router-link>
    <div class="flex gap-5 items-center">
      <div>
        <a
          href="#notification"
          @click.prevent="notification = !notification"
          class="relative"
        >
          <el-badge :value="notifications.length" :max="99" class="mr-1">
            <i
              class="icofont-notification text-gray-700 text-3xl"
              :class="notification === true ? 'text-secondary' : ''"
            ></i>
          </el-badge>
        </a>
      </div>
      <router-link to="/profile">
        <img :src="img" class="w-10 h-10 rounded-full shadow-lg" v-if="img" />
        <div
          class="w-10 h-10 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center"
          v-else
        >
          <i class="icofont-user-alt-3 text-2xl text-primary"></i>
        </div>
      </router-link>
    </div>
    <div
      class="shadow rounded-lg w-2/6 h-96 overflow-hidden absolute top-20 right-32 p-5 bg-white"
      v-if="notification"
    >
      <div
        class="h-1/6 text-xl flex items-center justify-between border-b border-grey-50 mb-2"
      >
        Notifications
        <i
          @click="notification = false"
          class="icofont-close-line text-red-600 cursor-pointer bg-red-50 p-2 rounded-full"
        ></i>
      </div>
      <div class="overflow-y-auto h-5/6 py-5">
        <template v-if="notifications.length > 0">
          <div
            class="hover:bg-gray-100 cursor-pointer p-3 border-b mb-2 mr-2 notification"
            v-for="items in notifications"
            :key="items.id"
            @click="markNotification(items)"
          >
            <div class="flex justify-start items-start mb-3 gap-3">
              <i
                class="icofont-flash text-4xl text-secondary"
                v-if="items.type === 'Book'"
              />
              <!-- <h3 class="font-semibold text-sm">{{ items.heading }}</h3> -->
              <div>
                <p class="text-md line-clamp-5 mb-2" v-html="items.message" />
                <i class="text-xs text-gray-400">
                  {{ moment(items.time).fromNow() }}
                </i>
              </div>
            </div>
          </div>
        </template>
        <div class="h-full w-full flex items-center justify-center" v-else>
          <div class="text-center">
            <img
              src="@/assets/svgs/Empty-Notification.svg"
              class="w-1/2 block my-0 mx-auto"
            />
            <h3 class="text-xl mb-2">Nothing to see here</h3>
            <p class="">
              You seem to have everything under control, which is a good thing.
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { loadAvatar, deleteNotification } from "@/services/profile";

export default {
  name: "DesktopHeader",
  data() {
    return {
      notification: false,
      img: "",
    };
  },
  computed: {
    notifications() {
      return this.$store.state.user_notification;
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    async loadUserAvatar(url) {
      await loadAvatar(url)
        .then((response) => {
          this.img = response.signedUrl;
          return response.signedUrl;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("Cannot get image now. Please try again");
        });
    },
    async markNotification(item) {
      await deleteNotification(item.id)
        .then(() => {
          let notifications = this.notifications.filter(function (el) {
            return el.id !== item.id;
          });
          this.$store.commit("SET_NOTIFICATION", notifications);
          this.notification = false;
          this.$router.push(item.url);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    if (this.user.avatar_url) {
      this.loadUserAvatar(this.user.avatar_url);
    }
  },
};
</script>

<style></style>
