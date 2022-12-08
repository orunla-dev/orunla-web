<template>
  <div class="h-screen overflow-y-hidden">
    <header
      class="fixed z-20 top-0 right-0 left-0 bg-white border-b p-5 md:p-3 md:px-10 md:pr-14 flex items-center justify-between"
    >
      <router-link to="/">
        <img src="@/assets/Logo.png" class="w-32" />
      </router-link>
      <div class="flex items-center gap-3">
        <div class="text-2xl mr-3 md:mr-10">
          {{ pageInfo.pageNumber }} / {{ pageInfo.totalPages }}
        </div>
        <div class="hidden md:block">
          <el-button
            :type="readingInfo.completed ? 'success' : ''"
            :disabled="readingInfo.completed"
            :loading="markAsDoneLoading"
            @click="markAsDone()"
          >
            Mark{{ readingInfo.completed ? "ed" : "" }} as completed
          </el-button>
        </div>
        <div class="hidden md:block">
          <el-button :id="config.presentationMode" title="Presentation mode">
            <i class="icofont-expand"></i>
          </el-button>
        </div>
        <el-button
          :id="config.previousPage"
          :disabled="pageInfo.pageNumber === 1"
          title="Previous page"
        >
          <i class="icofont-ui-previous md:hidden"></i>
          <span class="hidden md:inline">Previous Page</span>
        </el-button>
        <el-button
          :id="config.nextPage"
          :disabled="pageInfo.pageNumber === pageInfo.totalPages"
        >
          <i class="icofont-ui-next md:hidden"></i>
          <span class="hidden md:inline">Next Page</span>
        </el-button>
      </div>
    </header>
    <section
      class="pt-20 px-10 md:py-5 md:pt-16 overflow-auto flex gap-5"
      style="height: 100%"
    >
      <div class="w-full mb-10 md:w-3/4">
        <div class="bg-primary bg-opacity-70 my-2">
          <div
            class="md:text-xs bg-secondary py-1 px-2 font-bold text-primary"
            :style="`width: ${readProgress}%; font-size: 0px;`"
            :title="`Read progress: ${readProgress}%`"
          ></div>
        </div>
        <vue-pdf-app
          :pdf="
            book.ebook || 'https://arkokoley.github.io/pdfvuer/nationStates.pdf'
          "
          theme="light"
          :page-scale="100"
          :config="{ toolbar: false, sidebar: false, secondaryToolbar: false }"
          :id-config="config"
          @pages-rendered="pagesRendered"
          :page-number="readingInfo.page"
        >
        </vue-pdf-app>
      </div>
      <div class="hidden md:block w-1/4 py-5 px-5 overflow-hidden relative">
        <div class="fixed top-16 bg-white flex gap-3 pr-16 p-3">
          <img :src="book.img" class="rounded-md w-2/6 h-auto" />
          <div class="">
            <p class="text-xs">You're reading</p>
            <h1 class="font-bold">{{ book.title }}</h1>
            <p class="text-sm mt-2">
              {{ book.authors.fullname || book.authors.profiles.full_name }}
            </p>
          </div>
        </div>
        <div class="overflow-y-scroll overflow-x-hidden mt-36 h-3/4">
          {{ book }}
          <input
            :id="config.pageNumber"
            type="number"
            name="pageNumber"
            style="width: 40px"
          />
          <span class="divider"></span>
          <span :id="config.numPages"></span>
          <span> pages</span>
        </div>
      </div>
    </section>
    <section
      class="fixed top-0 right-0 bottom-0 left-0 z-30 bg-black bg-opacity-50 flex items-center justify-center"
      v-if="markAdDoneModal"
    >
      <div class="rounded-xl bg-white h-auto md:w-1/3 mx-10 md:mx-0 shadow-md">
        <img
          src="@/assets/svgs/Happy-Face.svg"
          class="w-1/2 h-auto block my-5 mx-auto"
        />
        <div class="py-5 px-10">
          Hello, {{ userName }}
          <p class="my-2">
            We noticed that you've reached the end of the book:
            <b>{{ book.title }}.</b>
            <br />
            Would you want to mark this as completed?
          </p>
        </div>
        <div class="px-5 mb-10 flex flex-col justify-center items-center">
          <el-button
            :loading="markAsDoneLoading"
            type="success"
            @click="markAsDone()"
          >
            Yes, mark as completed
          </el-button>
          <a
            href="#cancel"
            @click.prevent="markAdDoneModal = false"
            class="text-sm mt-3"
          >
            No, I am not done just yet.
          </a>
        </div>
      </div>
    </section>
    <div
      class="fixed top-20 mt-1 bottom-0 right-0 flex items-end md:hidden"
      :class="notesPanel ? 'left-1' : 'left-auto'"
    >
      <div class="bg-secondary mb-10 ml-2 h-20 rounded-l-xl">
        <div
          class="transform -rotate-90 mt-7 font-bold text-white"
          @click="notesPanel = !notesPanel"
        >
          Notes
        </div>
      </div>
      <div
        class="bg-white border-l-2 border-secondary rounded-l w-full h-full overflow-y-auto p-5"
        :class="notesPanel ? 'block' : 'hidden'"
      >
        {{ book }}
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchBook,
  fetchReadingInfo,
  addToReading,
  editReading,
  markBookAsDone,
} from "@/services/books";

import { firstWord } from "@/utils/helpers";
import { UID } from "@/utils/constants";
import breakpoints from "@/utils/breakpoints";

import VuePdfApp from "vue-pdf-app";
import "vue-pdf-app/dist/icons/main.css";

export default {
  name: "ReaderView",
  components: {
    VuePdfApp,
    // Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      breakpoints,
      loading: true,
      readingInfo: {},
      book: {},
      info: [],
      config: {
        nextPage: "NextPage",
        presentationMode: "PresentationMode",
        previousPage: "PreviousPage",
      },
      pageInfo: {
        pageNumber: null,
        totalPages: null,
      },
      markAsDoneLoading: false,
      markAdDoneModal: false,
      notesPanel: false,
    };
  },
  methods: {
    pagesRendered(pdfApp) {
      console.log(pdfApp);
      // If on mobile
      pdfApp.pdfSidebar.isOpen = false;
      this.pageInfo.pageNumber = pdfApp.page;
      this.pageInfo.totalPages = pdfApp.pagesCount;
      pdfApp.pdfViewer.eventBus.on("pagechanging", ({ pageNumber }) => {
        this.pageInfo.pageNumber = pageNumber;
        this.savePageUpdate();
      });
    },
    async savePageUpdate() {
      const payload = {
        profiles_id: localStorage.getItem(UID),
        books_id: this.$route.params.isbn,
        type: "ebook",
        page: this.pageInfo.pageNumber,
      };

      await editReading(payload)
        .then(() => {
          console.log("Page progress updated");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async markAsDone() {
      this.markAsDoneLoading = true;
      const payload = {
        profiles_id: localStorage.getItem(UID),
        books_id: this.$route.params.isbn,
      };

      await markBookAsDone(payload)
        .then((response) => {
          this.markAdDoneModal = false;
          this.markAsDoneLoading = false;
          this.$message.success("Book marked as completed");
          this.readingInfo.completed = response[0].completed;
        })
        .catch((error) => {
          this.$message.error(error);
          this.markAsDoneLoading = false;
        });
    },
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
  watch: {
    isCompleted() {
      if (!this.readingInfo.completed) {
        if (this.isCompleted) this.markAdDoneModal = true;
      }
    },
  },
  computed: {
    readProgress() {
      return (this.pageInfo.pageNumber / this.pageInfo.totalPages) * 100;
    },
    userName() {
      return firstWord(this.$store.state.user.full_name);
    },
    isCompleted() {
      return this.pageInfo.pageNumber === this.pageInfo.totalPages;
    },
  },
  mounted() {
    this.fetchTitle();
    this.fetchReading();
  },
};
</script>

<style>
.pdf-app.light {
  --pdf-app-background-color: white;
}
.pdf-app .pdfViewer .page {
  border: none !important;
  overflow-x: hidden !important;
}
</style>
