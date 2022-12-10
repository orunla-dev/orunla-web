<template>
  <div class="h-screen overflow-y-hidden">
    <header
      class="fixed z-20 top-0 right-0 left-0 bg-white border-b p-5 md:p-3 md:px-10 md:pr-14 flex items-center justify-between"
    >
      <router-link to="/">
        <img src="@/assets/Logo.png" class="w-32" />
      </router-link>
      <div class="flex items-center gap-1">
        <div class="text-xl mr-1 md:mr-10">
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
      class="pt-20 px-2 md:px-10 md:py-5 md:pt-16 overflow-auto flex gap-1"
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
          :page-scale="breakpoints.mdAndUp ? 100 : 55"
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
        <div
          v-if="notes.length !== 0"
          class="py-3 mt-36 ml-3 mr-9 flex justify-between items-center"
        >
          <h1 class="text-xl">Notes:</h1>
          <el-button type="primary" @click="newNoteModal = true">
            <i class="icofont-plus mr-2"></i>
            Add note
          </el-button>
        </div>
        <div class="overflow-y-scroll relative overflow-x-hidden h-3/4">
          <div
            class="absolute top-0 bottom-0 right-0 left-0 z-10 bg-black bg-opacity-50 flex items-center justify-center"
            v-if="newNoteModal"
          >
            <div class="bg-white w-full h-auto -mt-10 mx-5 rounded-lg p-5">
              <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8 }"
                placeholder="Write something inspirational from this page"
                v-model="newNote.text"
              />
              <div class="mt-5" />
              <el-button
                type="primary"
                class="w-full"
                :loading="submitting"
                :disabled="newNote.text === ''"
                @click="saveNote()"
              >
                Save Note
              </el-button>
              <a
                href="#close"
                @click.prevent="newNoteModal = !newNoteModal"
                class="block text-center mt-2 text-xs"
              >
                cancel
              </a>
            </div>
          </div>
          <div
            class="h-full flex justify-center items-center"
            v-if="notesLoading"
          >
            <loading />
          </div>
          <div class="h-full" v-else>
            <div
              class="text-center flex flex-col justify-center items-center h-full"
              v-if="notes.length === 0"
            >
              <img src="@/assets/svgs/Notes.svg" class="w-2/3 inline" />
              <h1 class="text-xl">You haven't jotted on this book, yet.</h1>
              <p class="text-sm my-3">
                Creating notes are easy, click on the button below.
              </p>
              <el-button type="primary" @click="newNoteModal = true">
                <i class="icofont-plus mr-2"></i>
                Add new note
              </el-button>
            </div>
            <div class="p-5 pl-3 relative" v-else>
              <div
                class="border rounded-md p-3 mb-3 text-sm"
                v-for="note in notes"
                :key="note.id"
              >
                {{ note.text }}
                <div
                  class="border-t mt-5 pt-3 flex justify-between items-center"
                >
                  <div class="text-xs text-gray-500">
                    Jotted in page: {{ note.pageNumber }}
                  </div>
                  <div
                    class="cursor-pointer bg-red-50 hover:bg-red-200 py-1 px-2 rounded-sm"
                    @click="deleteNote(note.id)"
                    title="Delete this note"
                  >
                    <i class="icofont-ui-delete text-red-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden">
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
      :class="notesPanel ? 'left-5' : 'left-auto'"
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
        <div class="overflow-y-scroll relative overflow-x-hidden h-full">
          <div
            class="py-3 px-5 bg-white z-10 flex justify-between items-center fixed right-0 left-20"
          >
            <h1 class="text-xl">Notes:</h1>
            <el-button
              v-if="notes.length !== 0"
              type="primary"
              @click="newNoteModal = true"
            >
              <i class="icofont-plus mr-2"></i>
              Add note
            </el-button>
          </div>
          <div
            class="absolute top-0 bottom-0 right-0 left-0 z-20 bg-black bg-opacity-50 flex items-center justify-center"
            v-if="newNoteModal"
          >
            <div class="bg-white w-full h-auto -mt-10 mx-5 rounded-lg p-5">
              <el-input
                type="textarea"
                :autosize="{ minRows: 8, maxRows: 8 }"
                placeholder="Write something inspirational from this page"
                v-model="newNote.text"
              />
              <div class="mt-5" />
              <el-button
                type="primary"
                class="w-full"
                :loading="submitting"
                :disabled="newNote.text === ''"
                @click="saveNote()"
              >
                Save Note
              </el-button>
              <a
                href="#close"
                @click.prevent="newNoteModal = !newNoteModal"
                class="block text-center mt-2 text-xs"
              >
                cancel
              </a>
            </div>
          </div>
          <div
            class="h-full flex justify-center items-center"
            v-if="notesLoading"
          >
            <loading />
          </div>
          <div class="h-full" v-else>
            <div
              class="text-center flex flex-col justify-center items-center h-full"
              v-if="notes.length === 0"
            >
              <img src="@/assets/svgs/Notes.svg" class="w-2/3 inline" />
              <h1 class="text-xl">You haven't jotted on this book, yet.</h1>
              <p class="text-sm my-3">
                Creating notes are easy, click on the button below.
              </p>
              <el-button type="primary" @click="newNoteModal = true">
                <i class="icofont-plus mr-2"></i>
                Add new note
              </el-button>
            </div>
            <div class="p-5 pl-3 mt-16 relative" v-else>
              <div
                class="border rounded-md p-3 mb-3 text-sm"
                v-for="note in notes"
                :key="note.id"
              >
                {{ note.text }}
                <div
                  class="border-t mt-5 pt-3 flex justify-between items-center"
                >
                  <div class="text-xs text-gray-500">
                    Jotted in page: {{ note.pageNumber }}
                  </div>
                  <div
                    class="cursor-pointer bg-red-50 hover:bg-red-200 py-1 px-2 rounded-sm"
                    @click="deleteNote(note.id)"
                    title="Delete this note"
                  >
                    <i class="icofont-ui-delete text-red-600"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="hidden">
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
  fetchNotes,
  addToNote,
  deleteANote,
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
    Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      breakpoints,
      loading: true,
      readingInfo: {},
      book: {},
      notes: [],
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
      notesLoading: true,
      newNoteModal: false,
      newNote: {
        text: "",
      },
      submitting: false,
    };
  },
  methods: {
    pagesRendered(pdfApp) {
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
    async fetchAllNotes() {
      this.notesLoading = true;
      await fetchNotes(localStorage.getItem(UID), this.$route.params.isbn)
        .then((response) => {
          this.notes = response;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.notesLoading = false;
    },
    async saveNote() {
      this.submitting = true;
      const payload = {
        profiles_id: localStorage.getItem(UID),
        books_id: this.$route.params.isbn,
        text: this.newNote.text,
        pageNumber: this.pageInfo.pageNumber,
      };
      await addToNote(payload)
        .then((response) => {
          this.notes = [...this.notes, ...response];
          this.$message.success("New note saved");
          this.newNote.text = "";
          this.newNoteModal = false;
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
    async deleteNote(id) {
      await deleteANote(id)
        .then(() => {
          this.notes = this.notes.filter((note) => note.id != id);
          this.$message.success("Note deleted");
        })
        .catch((error) => {
          this.$message.error(error);
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
    this.fetchAllNotes();
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
