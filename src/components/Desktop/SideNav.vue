<template>
  <div class="flex flex-col items-start gap-5 py-10">
    <router-link
      to="/"
      class="py-3 pl-8 pr-20 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      Home
    </router-link>
    <router-link
      to="/books"
      class="py-3 pl-8 pr-20 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      Books
    </router-link>
    <router-link
      to="/lists"
      class="py-3 pl-8 pr-20 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      My Lists
    </router-link>

    <router-link
      to="/me/notifications"
      class="flex items-center gap-2 py-3 pl-8 pr-14 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      <span
        class="rounded-full bg-red-500 border-4 border-red-200 h-4 w-4"
      ></span
      >Notifications
    </router-link>
    <router-link
      to="/me"
      class="py-3 pl-8 pr-20 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      My Profile
    </router-link>
    <router-link
      to="/me/settings"
      class="py-3 pl-8 pr-20 font-semibold rounded-full bg-gray-300 bg-opacity-30 text-gray-700"
      exact-active-class="border border-primary bg-primary bg-opacity-5 text-primary"
    >
      Settings
    </router-link>
    <a
      href="#logout"
      @click.prevent="logout()"
      class="absolute bottom-10 py-3 pl-8 pr-20 font-semibold rounded-full bg-red-300 bg-opacity-30 text-red-700 justify-self-end"
    >
      Log Out
    </a>
  </div>
</template>

<script>
export default {
  name: "DesktopSideNav",
};
</script>
