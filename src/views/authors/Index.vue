<template>
  <div>
    <div class="flex items-center gap-1 text-gray-600 mb-5">
      <router-link to="/">Home</router-link>
      <i class="icofont-thin-right mt-1 text-xl"></i>
      <p class="font-semibold">Authors</p>
    </div>
    <div class="h-screen flex items-center justify-center" v-if="loading">
      <loading />
    </div>
    <div
      class="bg-red-200 bg-opacity-20 border border-red-400 text-red-600 p-5 rounded-md"
      v-else-if="error"
    >
      <h1 class="font-bold mb-2">An Error occured</h1>
      <p class="">
        Looks like your network connection is bad. Please try again.
      </p>
    </div>
    <div
      class="h-full flex justify-center py-5 gap-5 md:gap-8 flex-wrap"
      v-else
    >
      <router-link
        :to="
          author.fullname
            ? `/authors/${author.uid}`
            : `/user/${author.profiles.username}`
        "
        class="w-36 md:w-52 border flex-shrink-1 p-5 rounded-md flex flex-col"
        v-for="author in authors"
        :key="author.id"
      >
        <img
          v-if="author.img"
          :src="author.img"
          class="h-auto w-52 md:w-72 rounded-xl border"
        />
        <i
          v-else
          class="icofont-user-alt-3 text-6xl text-gray-500 border p-5 rounded-xl bg-gray-200 flex justify-center"
        />
        <br />
        <p class="font-bold text-center">
          {{ author.fullname || author.profiles.full_name || "Not available" }}
        </p>
      </router-link>
    </div>
  </div>
</template>

<script>
import { fetchAllAuthors } from "@/services/authors";

export default {
  name: "AuthorsIndexPage",
  components: {
    Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      loading: true,
      error: false,
      infiniteScroll: {
        start: 0,
        end: 50,
        rangeError: false, // To handle having an endless loop of calls that returns HTTP RangeError
      },
      authors: [],
    };
  },
  methods: {
    async getAllAuthors() {
      await fetchAllAuthors(this.infiniteScroll)
        .then((response) => {
          if (this.authors.length < 0) {
            this.authors = response;
          } else {
            this.authors = [...this.authors, ...response];
          }
          this.loading = false;
          this.infiniteScroll.start += this.infiniteScroll.end;
          this.infiniteScroll.end += 50;
        })
        .catch((error) => {
          if (this.infiniteScroll.start === 0) {
            this.$message.error(error.message);
          } else {
            if (error.code === "PGRST103") {
              this.infiniteScroll.rangeError = true;
            }
          }
          this.loading = false;
        });
    },
    scroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;

        if (bottomOfWindow) {
          if (!this.infiniteScroll.rangeError) this.getAllAuthors();
        }
      };
    },
  },
  mounted() {
    this.getAllAuthors();
    this.scroll();
  },
  metaInfo: {
    title: "Authors",
  },
};
</script>
