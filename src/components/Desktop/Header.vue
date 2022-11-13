<template>
  <header
    class="flex justify-between items-center fixed top-0 right-0 left-0 px-20 py-6 bg-white"
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
            :class="notification === true ? 'text-primary' : ''"
          ></i>
          <span
            class="absolute -top-3 left-5 bg-red-500 text-white px-1 rounded-full text-xs"
          >
            5
          </span>
        </a>
      </div>
      <router-link to="/me">
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
        <div
          class="bg-gray-100 p-3 rounded-md mb-2 mr-2"
          v-for="i in 5"
          :key="i"
        >
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-sm">Hello World</h3>
            <i class="text-xs text-gray-400">3 minutes ago</i>
          </div>
          <p class="">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
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
};
</script>

<style></style>
