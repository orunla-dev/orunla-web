<template>
  <div class="h-full md:overflow-hidden">
    <div class="flex flex-col justify-center items-center mt-5">
      <div class="p-7 rounded-md bg-gray-200 overflow-hidden" v-if="!img">
        <i class="icofont-user-alt-3 text-8xl text-primary"></i>
      </div>
      <div class="bg-gray-200 rounded-xl overflow-hidden" v-else>
        <img :src="img" class="w-40 h-auto" />
      </div>
      <div class="mt-5 flex gap-3 items-end">
        <p class="text-3xl">{{ user.full_name || "null" }}</p>
        <router-link
          to="/profile/edit"
          class="border rounded-md py-1 px-2 bg-gray-200"
        >
          <i class="icofont-edit text-md text-gray-500"></i>
        </router-link>
      </div>
      <p class="italic text-gray-800">@{{ user.username || "null" }}</p>
    </div>
    <div class="mt-10 pb-5 border-b">
      <h2 class="text-xl mb-2">Your reading history</h2>
      <div
        class="flex flex-col justify-center items-center"
        v-if="history.length === 0"
      >
        <img src="@/assets/svgs/Sad-Face.svg" class="w-2/3 md:w-1/4" />
        <h2 class="text-2xl font-bold">Oh No!</h2>
        <p class="text-center mt-2 mb-5 w-full md:w-2/4">
          You haven't completed any book yet. Completing books unlocks badges
          and gives an healthy brain.
        </p>
      </div>
      <div
        class="flex md:justify-between mb-5 h-96 py-5 md:py-0 overflow-scroll md:h-auto md:overflow-hidden flex-wrap gap-5 md:gap-10 mt-5"
        v-else
      >
        <div
          class="w-full h-32 md:w-72 p-5 flex-shrink-0 md:flex-shrink bg-white border rounded-md flex items-start gap-3"
          v-for="book in history"
          :key="book.id"
        >
          <img
            :src="book.books.img"
            class="h-full w-auto rounded-md"
            :alt="book.books.title"
          />
          <div class="">
            <h3 class="font-bold text-lg text-primary line-clamp-1">
              {{ book.books.title }}
            </h3>
            <p class="text-sm my-2 line-clamp-2">{{ book.books.sub_title }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-red-50 p-2 border border-red-200 rounded-md flex justify-between items-center mt-3"
      v-if="!user.isEmailVerified"
    >
      {{ user.email }} isn't verified
      <div class="text-sm bg-red-500 text-white px-3 py-2 rounded-md">
        Send confirmation
      </div>
    </div>
  </div>
</template>

<script>
import { loadUserReadHistory, loadAvatar } from "@/services/profile";
import { UID } from "@/utils/constants";

export default {
  name: "ProfilePage",
  data() {
    return {
      history: [],
      img: "",
    };
  },
  methods: {
    async getUserHistory() {
      await loadUserReadHistory(localStorage.getItem(UID))
        .then((response) => {
          this.history = response;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("Error loading your read history");
        });
    },
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
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    this.getUserHistory();
    if (this.user.avatar_url) {
      this.loadUserAvatar(this.user.avatar_url);
    }
  },
  metaInfo: {
    title: "My profile",
  },
};
</script>
