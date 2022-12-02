<template>
  <div class="h-screen">
    <header
      class="fixed z-20 top-0 right-0 left-0 bg-white border-b p-5 md:p-3 flex items-center justify-between"
    >
      <router-link to="/">
        <img src="@/assets/Logo.png" class="w-32" />
      </router-link>
    </header>
    <section
      class="pt-20 px-10 md:px-40 md:py-5 md:pt-16 overflow-auto"
      style="height: 85%"
    >
      <div
        class="h-full bg-gray-800 rounded-md flex flex-col justify-center items-center shadow-md"
      >
        <loading />
        <p class="text-white text-xs mt-5">Loading ...</p>
        <!-- PDF-reader :url="book.img" / --->
      </div>
    </section>
    <footer
      class="fixed bottom-5 right-5 left-5 md:right-80 md:left-80 md:mx-20 z-20 rounded-lg shadow-md overflow-hidden"
    >
      <div class="bg-gray-700">
        <div class="bg-secondary p-1" :style="`width: 75%`"></div>
      </div>
      <div class="flex justify-between bg-gray-800 text-white p-5">
        <div class="w-1/4 text-center cursor-pointer">
          <i class="icofont-pencil-alt-2 text-xl"></i>
          <p class="text-xs mt-1">Write note</p>
        </div>
        <div class="w-1/4 text-center cursor-pointer">
          <i class="icofont-book-mark text-xl"></i>
          <p class="text-xs mt-1">Bookmarks</p>
        </div>
        <div class="w-1/4 text-center cursor-pointer">
          <i class="icofont-copy text-xl"></i>
          <p class="text-xs mt-1">Chapters</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { fetchBook, fetchReadingInfo, addToReading } from "@/services/books";
import { UID } from "@/utils/constants";

export default {
  name: "ReaderView",
  components: {
    // PDFReader: () => import("@/components/Reader/Reader.vue"),
    Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      loading: true,
      readingInfo: {},
      book: {},
    };
  },
  methods: {
    async fetchTitle() {
      await fetchBook(this.$route.params.isbn)
        .then((response) => {
          this.book = response[0];
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async fetchReading() {
      await fetchReadingInfo(localStorage.getItem(UID), this.$route.params.isbn)
        .then(async (response) => {
          if (response.length === 0) {
            // Add to list
            await this.addToTitleToReading();
          } else {
            // use the list to continue
            this.readingInfo = response[0];
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async addToTitleToReading() {
      const payload = {
        profiles_id: localStorage.getItem(UID),
        books_id: this.$route.params.isbn,
        type: "ebook",
        page: 0,
      };
      await addToReading(payload)
        .then(() => {
          console.log("Added to list");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchTitle();
    this.fetchReading();
  },
};
</script>
