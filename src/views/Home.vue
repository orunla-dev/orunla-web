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
    <div class="mb-5 border-b" v-if="!loading">
      <h2 class="font-bold text-primary">Books you might like</h2>
      <div class="flex justify-between overflow-x-auto gap-3 md:gap-10 py-5">
        <div
          class="relative w-36 md:w-40 border rounded-md flex-shrink-0 overflow-hidden flex flex-col items-center cursor-pointer"
          v-for="book in books"
          :key="book.isbn"
          @click="previewBook(book)"
          :title="`${book.title} - ${
            book.authors.fullname ||
            book.authors.profiles.full_name ||
            'Not available'
          }`"
        >
          <img :src="book.img" class="w-full rounded-md" :alt="book.title" />
        </div>
      </div>
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
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
import { fetchBooks, fetchUserReadingList } from "@/services/books";
import { UID } from "@/utils/constants";

export default {
  name: "Home",
  components: {
    // StarRating: () => import("@/components/Base/StarRating.vue"),
    Loading: () => import("@/components/Base/Loading.vue"),
    MobileBookPreview: () => import("@/components/Mobile/BookPreview.vue"),
    DesktopBookPreview: () => import("@/components/Desktop/BookPreview.vue"),
  },
  data() {
    return {
      breakpoints,
      books: [],
      infiniteScroll: {
        start: 0,
        end: 50,
        rangeError: false, // To handle having an endless loop of calls that returns HTTP RangeError
      },
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
      await fetchBooks(this.infiniteScroll)
        .then((response) => {
          if (this.books.length < 0) {
            this.books = response;
          } else {
            this.books = [...this.books, ...response];
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
    // Initially load some items.
    this.fetchAllBooks();
    this.fetchReadingList();
  },
};
</script>
