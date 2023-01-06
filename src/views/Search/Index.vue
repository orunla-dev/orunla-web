<template>
  <div>
    <div class="flex items-center gap-1 text-gray-600 mb-5">
      <router-link to="/">Home</router-link>
      <i class="icofont-thin-right mt-1 text-xl"></i>
      <template v-if="$route.query.q || $route.params.query">
        <p class="font-semibold line-clamp-1">Search</p>
        <i class="icofont-thin-right mt-1 text-xl"></i>
        <p class="font-semibold line-clamp-1">
          {{ $route.query.q || $route.params.query }}
        </p>
      </template>
      <template v-else>
        <p class="font-semibold line-clamp-1">Search</p>
      </template>
    </div>
    <el-form class="md:w-2/3">
      <p class="text-sm mb-1">Single word search</p>
      <el-input placeholder="What are you reading today?" v-model="query">
        <el-button
          slot="append"
          icon="icofont-search"
          type="primary"
          @click="getSearchResult()"
        ></el-button>
      </el-input>
    </el-form>
    <template v-if="$route.query.q || $route.params.query">
      <div
        class="mt-5 flex justify-start gap-7 md:gap-10 flex-wrap overflow-hidden"
        v-if="loading"
      >
        <el-skeleton
          class="w-36 md:w-52 h-52 rounded-md"
          animated
          v-for="i in 4"
          :key="i"
        >
          <template slot="template">
            <el-skeleton-item
              variant="image"
              style="width: 100%; height: 210px; border-radius: 0.3rem"
            />
          </template>
        </el-skeleton>
      </div>
      <div v-else class="flex justify-start gap-5 md:gap-10 flex-wrap py-5">
        <router-link
          :to="
            `/books/${book.isbn}/` + book.title.toLowerCase().replace(/ /g, '-')
          "
          class="w-36 md:w-32 rounded-md border overflow-hidden flex-shrink-1 flex flex-col cursor-pointer"
          v-for="book in result"
          :key="book.isbn"
        >
          <img :src="book.img" class="w-full rounded-md" />
        </router-link>
      </div>
    </template>
    <template v-else>
      <div class="my-5">
        <h2 class="font-bold text-primary text-xl">Suggested for you</h2>
        <div class="flex justify-start overflow-x-auto gap-5 md:gap-10 py-5">
          <router-link
            :to="
              `/books/${book.isbn}/` +
              book.title.toLowerCase().replace(/ /g, '-')
            "
            class="relative w-32 md:w-40 rounded-md flex-shrink-0 overflow-hidden flex flex-col items-center cursor-pointer"
            v-for="book in suggestions"
            :key="book.isbn"
            :title="`${book.title} - ${
              book.authors.fullname ||
              book.authors.profiles.full_name ||
              'Not available'
            }`"
          >
            <v-lazy-image
              :src="book.img"
              :src-placeholder="placeholder"
              class="w-full rounded-md"
              :alt="book.title"
            />
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { fetchSearchSuggestions, searchBookTitle } from "@/services/books";
import IMG from "@/assets/Orunla.png";
import VLazyImage from "v-lazy-image/v2";

export default {
  name: "SearchView",
  components: {
    VLazyImage,
  },
  data() {
    return {
      query: "",
      suggestions: [],
      result: [],
      loading: true,
    };
  },
  computed: {
    placeholder() {
      return IMG;
    },
  },
  methods: {
    async getSearchResult() {
      this.loading = true;
      if (this.query === "") {
        this.$message.info("Please input book title to search");
        return;
      }
      this.query = this.query.split(" ")[0];
      this.$router.push({
        path: this.$route.fullPath,
        query: { q: this.query },
      });
      await searchBookTitle(this.query)
        .then((response) => {
          this.result = response;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.loading = false;
    },
    async getSearchSuggestions() {
      await fetchSearchSuggestions()
        .then((response) => {
          this.suggestions = response;
        })
        .catch((error) => {
          this.$message.error("Error fetching search suggestions");
          console.log(error);
        });
    },
  },
  mounted() {
    this.query = this.$route.query.q || this.$route.params.query || "";
    if (this.query === "") {
      this.getSearchSuggestions();
    }
  },
};
</script>
