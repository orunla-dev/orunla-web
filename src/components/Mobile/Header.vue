<template>
  <header
    class="bg-white flex justify-between items-center p-5 fixed top-0 right-0 left-0 z-40"
  >
    <router-link to="/">
      <img src="@/assets/Logo.png" class="w-28" />
    </router-link>
    <div class="flex gap-5">
      <router-link to="/search">
        <i class="icofont-search text-2xl text-primary"></i>
      </router-link>
      <el-badge :value="notifications.length" :max="99" class="mr-1">
        <i
          class="icofont-notification text-2xl"
          :class="notification ? 'text-secondary' : 'text-primary'"
          @click="notification = true"
        ></i>
      </el-badge>
      <!-- <button @click="showSideNav = true">
        <hamburger-icon />
      </button> -->
    </div>
    <side-nav v-if="showSideNav" @close="showSideNav = false" />
    <div
      class="fixed top-0 right-0 bottom-0 left-0 px-5 bg-black bg-opacity-5 flex justify-center items-center"
      v-if="notification"
    >
      <div class="bg-white h-5/6 w-full rounded-md shadow-2xl">
        <div class="flex justify-between items-center p-3 border-b">
          Notifications
          <i
            @click="notification = false"
            class="icofont-close-line text-red-600 cursor-pointer bg-red-50 p-2 rounded-full"
          ></i>
        </div>
        <div class="h-5/6 -mb-2 overflow-y-auto">
          <template v-if="notifications.length > 0">
            <div
              class="hover:bg-gray-100 cursor-pointer p-3 border-b mb-2 mr-3"
              v-for="notification in notifications"
              :key="notification.id"
              @click="markNotification(notification)"
            >
              <div class="flex justify-start items-start mb-3 gap-3">
                <i
                  class="icofont-flash text-4xl text-secondary"
                  v-if="notification.type === 'Book'"
                ></i>
                <div class="">
                  <p
                    class="text-md line-clamp-5 mb-2"
                    v-html="notification.message"
                  />
                  <i class="text-xs text-gray-400">
                    {{ moment(notification.time).fromNow() }}
                  </i>
                </div>
              </div>
            </div>
          </template>
          <div
            class="h-full w-full flex items-center justify-center px-5"
            v-else
          >
            <div class="text-center">
              <img
                src="@/assets/svgs/Empty-Notification.svg"
                class="w-full block my-0 mx-auto"
              />
              <h3 class="text-xl mb-2">Nothing to see here</h3>
              <p class="">
                You seem to have everything under control, which is a good
                thing.
              </p>
            </div>
          </div>
        </div>
        <div
          class="h-auto flex justify-end items-center p-3"
          v-if="notifications.length > 0"
        >
          <el-button @click="markAllAsRead()">Mark all as read</el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { deleteNotification } from "@/services/profile";

export default {
  name: "Header",
  components: {
    // HamburgerIcon: () => import("@/assets/icons/HamburgerIcon.vue"),
    SideNav: () => import("@/components/Mobile/SideNav.vue"),
  },
  computed: {
    notifications() {
      return this.$store.state.user_notification;
    },
  },
  data() {
    return {
      showSideNav: false,
      notification: false,
    };
  },
  methods: {
    markAllAsRead() {
      console.log("Mark As Read");
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
  watch: {
    $route() {
      this.showSideNav = false;
    },
  },
};
</script>
