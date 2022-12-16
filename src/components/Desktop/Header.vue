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
          <i
            class="icofont-notification text-gray-700 text-3xl"
            :class="notification === true ? 'text-secondary' : ''"
          ></i>
          <span
            v-if="notifications.length > 0"
            class="absolute -top-3 left-5 bg-red-500 text-white px-1 rounded-full text-xs"
          >
            {{ notifications.length }}
          </span>
        </a>
      </div>
      <router-link to="/profile">
        <img src="@/assets/user.jpg" class="w-9 rounded-full shadow-lg" />
      </router-link>
    </div>
    <div
      class="shadow rounded-lg w-1/4 h-96 overflow-hidden absolute top-20 right-32 p-5 bg-white"
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
            class="bg-gray-100 p-3 rounded-md mb-2 mr-2"
            v-for="items in notifications"
            :key="items.id"
          >
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-sm">{{ items.heading }}</h3>
              <i class="text-xs text-gray-400">{{
                moment(items.time).format("DD-MMMM-YYYY")
              }}</i>
            </div>
            <p class="">{{ items.message }}</p>
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
export default {
  name: "DesktopHeader",
  data() {
    return {
      notification: false,
    };
  },
  computed: {
    notifications() {
      return this.$store.state.user_notification;
    },
  },
};
</script>

<style></style>
