<template>
  <div
    class="fixed z-20 bottom-0 right-0 left-0 flex justify-between gap-3 bg-white px-5 shadow-2xl"
  >
    <router-link
      to="/"
      :class="
        $route.path === '/'
          ? 'border-primary text-primary'
          : 'border-white text-gray-700'
      "
      class="font-semibold px-3 py-2 flex flex-col items-center justify-center border-t hover:bg-primary hover:bg-opacity-20"
    >
      <i class="icofont-ui-home text-xl"></i>
      Home
    </router-link>
    <router-link
      to="/books"
      :class="
        $route.path.includes('/books')
          ? 'border-primary text-primary'
          : 'border-white text-gray-700'
      "
      class="font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4 hover:bg-primary hover:bg-opacity-20"
    >
      <i class="icofont-book text-xl"></i>
      Books
    </router-link>
    <router-link
      to="/lists"
      :class="
        $route.path.includes('/lists')
          ? 'border-primary text-primary'
          : 'border-white text-gray-700'
      "
      class="font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4 hover:bg-primary hover:bg-opacity-20"
    >
      <i class="icofont-list text-xl"></i>
      Lists
    </router-link>
    <router-link
      to="/me"
      :class="
        $route.path.includes('/me')
          ? 'border-primary text-primary'
          : 'border-white text-gray-700'
      "
      class="font-semibold px-3 py-2 flex flex-col items-center justify-center border-t-4 hover:bg-primary hover:bg-opacity-20"
    >
      <i class="icofont-ui-user text-xl"></i>
      Profile
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MobileFooter",
  components: {},
};
</script>
