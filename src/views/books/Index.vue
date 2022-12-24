<template>
  <div>
    <div class="flex items-center gap-1 text-gray-600 mb-5">
      <router-link to="/">Home</router-link>
      <i class="icofont-thin-right mt-1 text-xl"></i>
      <p class="font-semibold line-clamp-1">Books</p>
    </div>
    <router-link
      to="/admin/books"
      v-if="user.admin === 1"
      class="fixed bottom-20 right-5 md:bottom-10 md:right-10 bg-primary text-white p-4 rounded-full shadow-xl"
    >
      <i class="icofont-ssl-security text-3xl"></i>
    </router-link>
    <div>
      <h2 class="text-2xl font-bold text-primary">All titles</h2>
      <div class="flex justify-start gap-5 md:gap-10 flex-wrap py-5">
        <div
          class="w-36 md:w-52 rounded-md border overflow-hidden flex-shrink-1 p-5 flex flex-col cursor-pointer"
          v-for="book in books"
          :key="book.isbn"
          @click="previewBook(book)"
        >
          <img :src="book.img" class="w-full rounded-md" />
          <div class="mt-3 text-left">
            <h2 class="text-lg font-bold text-primary line-clamp-2">
              {{ book.title }}
            </h2>
            <h3 class="text-sm md:text-lg my-2">
              {{
                book.authors.fullname ||
                book.authors.profiles.full_name ||
                "Not available"
              }}
            </h3>
            <star-rating :grade="book.rating" class="justify-left" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="h-screen flex justify-start gap-5 md:gap-10 flex-wrap overflow-hidden"
      v-if="loading"
    >
      <el-skeleton
        class="w-36 md:w-52 border rounded-md p-3"
        animated
        v-for="i in 5"
        :key="i"
      >
        <template slot="template">
          <el-skeleton-item
            variant="image"
            style="width: 100%; height: 210px; border-radius: 0.3rem"
          />
          <div class="py-3">
            <el-skeleton-item variant="h1" />
            <el-skeleton-item
              variant="text"
              style="width: 80%; margin-bottom: 0.4rem"
            />
            <el-skeleton-item variant="text" style="width: 50%" />
          </div>
        </template>
      </el-skeleton>
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
import { fetchBooks } from "@/services/books";
// import { UID } from "@/utils/constants";

export default {
  name: "",
  components: {
    StarRating: () => import("@/components/Base/StarRating.vue"),
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
          if (!this.infiniteScroll.rangeError) this.fetchAllBooks();
        }
      };
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  mounted() {
    // Initially load some items.
    this.fetchAllBooks();
    this.scroll();
  },
};
</script>
