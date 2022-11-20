<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 z-50 flex">
    <div class="w-3/4 z-50 bg-white relative shadow-md">
      <div class="bg-gray-200 p-4 py-5">
        <img src="@/assets/Logo.png" class="w-28" />
      </div>
      <div
        class="p-5 flex justify-between items-center"
        :class="tab === 'categories' ? 'font-bold bg-gray-400' : 'bg-gray-300'"
        @click="changeTab('categories')"
      >
        <div class="flex items-center gap-3">
          <i class="icofont-library text-2xl text-black"></i>
          Categories
        </div>
        <i
          :class="
            tab === 'categories' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          "
        ></i>
      </div>
      <div class="bg-gray-300 px-5 py-2 h-52" v-if="tab === 'categories'">
        Categories
      </div>
      <div
        class="p-5 flex justify-between items-center border-t-4"
        :class="
          tab === 'recommendations' ? 'font-bold bg-gray-400' : 'bg-gray-300'
        "
        @click="changeTab('recommendations')"
      >
        <div class="flex items-center gap-3">
          <i class="icofont-heart text-2xl text-black"></i>
          Recommendations
        </div>
        <i
          :class="
            tab === 'recommendations'
              ? 'el-icon-arrow-up'
              : 'el-icon-arrow-down'
          "
        ></i>
      </div>
      <div class="bg-gray-300 px-5 py-2 h-52" v-if="tab === 'recommendations'">
        Recommendations
      </div>
      <div
        class="p-5 flex justify-between items-center border-t-4"
        :class="tab === 'list' ? 'font-bold bg-gray-400' : 'bg-gray-300'"
        @click="changeTab('list')"
      >
        <div class="flex items-center gap-3">
          <i class="icofont-list text-2xl text-black"></i>
          List
        </div>
        <i
          :class="tab === 'list' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i>
      </div>
      <div class="bg-gray-200 px-5 py-2 h-52" v-if="tab === 'list'">
        <h3 class="text-xl mb-3" v-if="lists.length > 0">
          Titles you've saved
        </h3>
        <div class="flex gap-5 overflow-x-auto" v-if="lists.length > 0">
          <router-link
            :to="`/read/${list.books.isbn}`"
            class="flex gap-3 w-48 h-32 flex-shrink-0 border-r border-gray-300 pr-3"
            v-for="list in lists"
            :key="list.id"
          >
            <img :src="list.books.img" class="h-1/2 rounded-md" />
            <div class="">
              <p class="font-semibold line-clamp-3">{{ list.books.title }}</p>
              <p class="text-sm">
                {{
                  list.books.authors.fullname ||
                  list.books.authors.profiles.full_name
                }}
              </p>
            </div>
          </router-link>
        </div>
        <div class="my-5" v-else>
          <div class="text-center text-sm">
            <i class="icofont-list text-4xl"></i>
            <h3 class="text-xl my-3">Nothing here</h3>
            Adding books to your list is a nice way to remind yourself of books
            you want to read later.
          </div>
        </div>
      </div>
      <router-link
        to="/me/notification"
        class="p-5 flex justify-between items-center border-t-4 bg-gray-300"
      >
        <div class="flex items-center gap-3">
          <i class="icofont-notification text-2xl text-black"></i>
          Notifications
        </div>
        <i class="el-icon-arrow-right"></i>
      </router-link>
      <div
        class="absolute bottom-0 left-0 right-0 p-5 bg-red-500 text-white flex items-center gap-3 text-xl"
        @click="logUserOut()"
      >
        <i class="icofont-logout text-2xl"></i>
        Log Out
      </div>
    </div>
    <div class="w-1/4 bg-black bg-opacity-0" @click="$emit('close')"></div>
  </div>
</template>

<script>
import { supabase } from "@/config/supabase";

export default {
  name: "SideNav",
  data() {
    return {
      tab: "",
    };
  },
  computed: {
    lists() {
      return this.$store.state.user_list;
    },
  },
  methods: {
    changeTab(tab) {
      if (this.tab === tab) {
        this.tab = false;
      } else {
        this.tab = tab;
      }
    },
    async logUserOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        this.$message.error(error);
      } else {
        this.$message.info("You've been logged out.");
        this.$router.push("/auth");
      }
    },
  },
};
</script>
