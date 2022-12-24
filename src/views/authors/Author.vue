<template>
  <div>
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
    <div class="" v-else>
      <div class="flex items-center gap-1 text-gray-600 mb-5">
        <router-link to="/">Home</router-link>
        <i class="icofont-thin-right mt-1 text-xl"></i>
        <router-link to="/authors">Authors</router-link>
        <i class="icofont-thin-right mt-1 text-xl"></i>
        <p class="font-semibold line-clamp-1">
          {{ author.fullname || author.profiles.full_name || "Not available" }}
        </p>
      </div>
      <div class="md:flex md:items-start">
        <div class="flex items-center justify-center md:justify-start md:w-2/6">
          <img
            v-if="author.img"
            :src="author.img"
            class="h-auto w-52 md:w-72 rounded-xl border"
          />
          <i
            v-else
            class="icofont-user-alt-3 text-8xl text-gray-500 border p-5 rounded-xl bg-gray-200"
          ></i>
        </div>
        <div class="text-center md:text-left mt-3 md:w-4/6">
          <h1 class="text-2xl text-primary font-semibold">
            {{
              author.fullname || author.profiles.full_name || "Not available"
            }}
          </h1>
          <div
            class="mt-2 md:mt-5 flex gap-5 items-center justify-center md:justify-start"
          >
            <a
              v-if="author.twitter_url"
              :href="author.twitter_url"
              target="_blank"
              :title="`${
                author.fullname || author.profiles.full_name
              } on Twitter`"
              ><i class="icofont-twitter text-xl md:text-3xl text-blue-600"></i
            ></a>
            <a
              v-if="author.wikipedia_link"
              :href="author.wikipedia_link"
              target="_blank"
              :title="`${
                author.fullname || author.profiles.full_name
              } Wikipedia page`"
              ><i
                class="icofont-brand-wikipedia text-xl md:text-3xl text-gray-600"
              ></i
            ></a>
            <a
              v-if="author.website"
              :href="author.website"
              target="_blank"
              :title="`${author.fullname || author.profiles.full_name} website`"
              ><i class="icofont-web text-xl md:text-3xl text-primary"></i
            ></a>
          </div>
          <div class="border-b mt-5 pb-5 text-left">
            <h2 class="text-xl mb-2">
              About
              {{
                getFirstWord(author.fullname) ||
                getFirstWord(author.profiles.full_name) ||
                "Not Available"
              }}
            </h2>
            <p class="text-justify">
              {{
                author.about ||
                "This is yet to be filled, Please check back later"
              }}
            </p>
          </div>
          <div class="border-b pb-5 text-left mt-5">
            <h2 class="text-xl mb-2">
              Books By
              {{
                getFirstWord(author.fullname) ||
                getFirstWord(author.profiles.full_name) ||
                "Not Available"
              }}
            </h2>
            <div class="flex justify-start gap-10 md:gap-3 flex-wrap mt-5">
              <router-link
                :to="
                  `/books/${book.isbn}/` +
                  book.title.toLowerCase().replace(/ /g, '-')
                "
                class="w-32 md:w-38 rounded-md text-center hover:bg-gray-100"
                :title="
                  book.title + ' by ' + book.authors.fullname ||
                  book.authors.profiles.full_name
                "
                v-for="book in books"
                :key="book.isbn"
              >
                <img :src="book.img" class="w-full rounded-md inline" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchAuthorDetails, fetchAuthorBooks } from "@/services/authors";
import { firstWord } from "@/utils/helpers";

export default {
  name: "AuthorPage",
  components: {
    Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      loading: true,
      error: false,
      author: {},
      books: [],
    };
  },
  methods: {
    async fetchAuthor() {
      await fetchAuthorDetails(this.$route.params.authors_id)
        .then((response) => {
          this.author = response[0];
          this.fetchBooks();
        })
        .catch((error) => {
          this.error = true;
          console.log(error);
        });
      this.loading = false;
    },
    async fetchBooks() {
      await fetchAuthorBooks(this.$route.params.authors_id)
        .then((response) => {
          this.books = response;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    getFirstWord(word) {
      return firstWord(word);
    },
  },
  mounted() {
    this.fetchAuthor();
  },
  metaInfo() {
    return {
      title: `${
        this.author.fullname ||
        this.author.profiles.full_name ||
        "Not available"
      }`,
    };
  },
};
</script>
