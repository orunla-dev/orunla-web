<template>
  <div>
    <div class="my-3 md:my-0 md:mb-10">
      <h1 class="text-2xl font-bold text-primary">Continue reading</h1>
      <div class="flex gap-5 overflow-x-auto py-5">
        <div
          class="w-5/6 h-32 md:w-2/6 p-2 flex-shrink-0 bg-white border rounded-md flex items-start gap-3"
          v-for="(book, index) in books"
          :key="index"
        >
          <img
            :src="book.img"
            class="h-full w-auto rounded-md"
            :alt="book.title"
          />
          <div class="">
            <h3 class="font-bold text-lg text-primary line-clamp-1">
              {{ book.title }}
            </h3>
            <p class="text-sm my-2 line-clamp-2">{{ book.sub_title }}</p>
            <star-rating :grade="book.rating" />
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <h2 class="text-2xl font-bold text-primary">
        Based on what you searched
      </h2>
      <div
        class="flex gap-5 md:gap-10 md:flex-wrap overflow-x-auto md:overflow-hidden py-5"
      >
        <div
          class="w-2/3 md:w-1/6 border rounded-md overflow-hidden flex-shrink-0 p-5 flex flex-col items-center cursor-pointer"
          v-for="(book, index) in books"
          :key="`search-${index}`"
          @click="previewBook(book)"
        >
          <img :src="book.img" class="w-1/2 rounded-md" />
          <div class="mt-3 text-center">
            <h2 class="text-xl font-bold text-primary">{{ book.title }}</h2>
            <h3 class="text-lg my-2">
              {{
                book.authors.fullname ||
                book.authors.profiles.full_name ||
                "Not available"
              }}
            </h3>
            <star-rating :grade="book.rating" class="justify-center" />
          </div>
        </div>
      </div>
    </div>
    <mobile-book-preview
      v-if="breakpoints.smAndDown && bookPreview.open"
      :book="bookPreview.data"
      @close="closePreviewBook"
    />
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
import { fetchBooks } from "@/services/books";

export default {
  name: "Home",
  components: {
    StarRating: () => import("@/components/Base/StarRating.vue"),
    MobileBookPreview: () => import("@/components/Mobile/BookPreview.vue"),
  },
  data() {
    return {
      breakpoints,
      books: [],
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
  },
  methods: {
    previewBook(book) {
      this.bookPreview.data = book;
      this.bookPreview.open = true;
    },
    closePreviewBook() {
      this.bookPreview.data = {};
      this.bookPreview.open = false;
    },
    async fetchAllBooks() {
      this.books = await fetchBooks();
    },
  },
  mounted() {
    this.fetchAllBooks();
  },
};
</script>
