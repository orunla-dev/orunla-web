<template>
  <div
    class="z-40 fixed bottom-0 right-0 left-0 flex justify-between gap-3 bg-white px-5 shadow-2xl"
  >
    <router-link
      to="/"
      :class="$route.path === '/' ? 'border-primary' : 'border-white'"
      class="text-primary font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4"
      v-slot="{ isActive, href, navigate }"
    >
      <a :href="href" @click="navigate">
        <home-icon color="#342B8E" :size="30" />
        Home
      </a>
    </router-link>
    <router-link
      to="/books"
      :class="
        $route.path.includes('/books') ? 'border-primary' : 'border-white'
      "
      class="text-primary font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4"
      v-slot="{ isActive, href, navigate }"
    >
      <a :href="href" @click="navigate">
        <book-icon color="#342B8E" :size="30" />
        Books
      </a>
    </router-link>
    <router-link
      to="/lists"
      :class="
        $route.path.includes('/lists') ? 'border-primary' : 'border-white'
      "
      class="text-primary font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4"
      v-slot="{ isActive, href, navigate }"
    >
      <a :href="href" @click="navigate">
        <list-icon color="#342B8E" :size="30" />
        Lists
      </a>
    </router-link>
    <router-link
      to="/me"
      :class="$route.path.includes('/me') ? 'border-primary' : 'border-white'"
      class="text-primary font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4"
      v-slot="{ isActive, href, navigate }"
    >
      <a :href="href" @click="navigate">
        <user-icon color="#342B8E" :size="30" />
        Profile
      </a>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MobileFooter",
  components: {
    HomeIcon: () => import("@/assets/icons/HomeIcon.vue"),
    BookIcon: () => import("@/assets/icons/BookIcon.vue"),
    ListIcon: () => import("@/assets/icons/ListIcon.vue"),
    UserIcon: () => import("@/assets/icons/UserIcon.vue"),
  },
};
</script>
