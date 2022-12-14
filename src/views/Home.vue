<template>
  <div>
    <div class="mb-5 border-b" v-if="reading.length > 0">
      <h1 class="font-bold text-primary">Continue reading</h1>
      <div class="flex gap-5 overflow-x-auto py-5">
        <router-link
          :to="`/read/${book.books.isbn}`"
          class="relative w-auto h-40 flex-shrink-0 bg-white border rounded-md flex items-start gap-3 overflow-hidden"
          v-for="(book, index) in reading"
          :key="index"
        >
          <img
            :src="book.books.img"
            class="h-full w-auto rounded-md"
            :alt="book.books.title"
          />
          <div class="absolute bottom-0 left-0 right-0">
            <div class="bg-secondary">
              <div
                class="bg-primary p-1"
                :style="`width: ${readProgress(
                  book.page,
                  book.books.totalPages
                )}`"
              ></div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="mb-5" v-if="!loading">
      <template v-for="item in books">
        <div
          class="mb-5 border-b"
          :key="item.genre"
          v-if="item.books.length !== 0"
        >
          <h2 class="font-bold text-primary text-xl">
            Suggested books on {{ item.genre }}
          </h2>
          <div class="flex justify-start overflow-x-auto gap-5 md:gap-10 py-5">
            <div
              class="relative w-32 md:w-40 rounded-md flex-shrink-0 overflow-hidden flex flex-col items-center cursor-pointer"
              v-for="book in item.books"
              :key="book.isbn"
              @click="previewBook(book)"
              :title="`${book.title} - ${
                book.authors.fullname ||
                book.authors.profiles.full_name ||
                'Not available'
              }`"
            >
              <img
                :src="book.img"
                class="w-full rounded-md"
                :alt="book.title"
              />
            </div>
            <template v-if="item.books.length <= 3">
              <div
                class="w-32 md:w-40 flex-shrink-0 bg-gray-100 rounded-md"
                v-for="i in Math.abs(3 - item.books.length)"
                :key="i"
              />
            </template>
          </div>
        </div>
      </template>
    </div>
    <div class="flex items-center justify-center h-screen" v-if="loading">
      <loading />
    </div>
    <mobile-book-preview
      v-if="breakpoints.smAndDown && bookPreview.open"
      :book="bookPreview.data"
      @close="closePreviewBook"
    />
    <desktop-book-preview
      v-if="breakpoints.mdAndUp && bookPreview.open"
      :book="bookPreview.data"
      @close="closePreviewBook"
    />
    <mobile-get-started v-if="!user.my_genres || user.my_genres.length === 0" />
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
import { fetchUserReadingList, fetchRelatedBooks } from "@/services/books";
import { UID } from "@/utils/constants";

export default {
  name: "Home",
  components: {
    // StarRating: () => import("@/components/Base/StarRating.vue"),
    Loading: () => import("@/components/Base/Loading.vue"),
    MobileBookPreview: () => import("@/components/Mobile/BookPreview.vue"),
    DesktopBookPreview: () => import("@/components/Desktop/BookPreview.vue"),
    MobileGetStarted: () => import("@/components/Mobile/Get-started.vue"),
  },
  data() {
    return {
      breakpoints,
      books: [],
      loading: true,
      bookPreview: {
        open: false,
        data: {},
      },
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    reading() {
      return this.$store.state.user_reading;
    },
  },
  methods: {
    readProgress(page, totalPages) {
      return (page / totalPages) * 100;
    },
    previewBook(book) {
      this.bookPreview.data = book;
      this.bookPreview.open = true;
    },
    closePreviewBook() {
      this.bookPreview.data = {};
      this.bookPreview.open = false;
    },
    async fetchAllBooks() {
      this.loading = true;
      this.user.my_genres.forEach(async (genre) => {
        await fetchRelatedBooks(genre, 3)
          .then((response) => {
            this.books.push({ genre: genre, books: response });
          })
          .catch((error) => {
            console.log(error);
          });
      });
      this.loading = false;
    },
    async fetchReadingList() {
      await fetchUserReadingList(localStorage.getItem(UID))
        .then((response) => {
          this.$store.commit("SET_READING", response);
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
  },
  mounted() {
    this.fetchAllBooks();
    this.fetchReadingList();
  },
};
</script>
