<template>
  <div
    class="z-50 fixed h-2/6 top-auto right-0 bottom-0 left-0 bg-gray-100 rounded-t-xl shadow-xl"
  >
    <div class="px-3 pt-3 flex justify-between gap-3 h-3/6">
      <img :src="book.img" class="h-full w-auto rounded-md" />
      <div class="flex justify-between gap-3 w-full">
        <div class="">
          <h2 class="text-2xl font-bold text-primary line-clamp-1">
            {{ book.title }}
          </h2>
          <p class="text-gray-600 text-sm">{{ book.author }}</p>
          <p class="line-clamp-2">{{ book.sub_title }}</p>
        </div>
        <i
          class="icofont-close-circled font-bold text-3xl cursor-pointer"
          @click="$emit('close')"
        ></i>
      </div>
    </div>
    <div class="h-2/6 px-0 py-1 flex gap-3">
      <router-link
        :to="`/read/${book.isbn}`"
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
      >
        <i class="icofont-ebook text-2xl"></i>
        <p class="text-xs mt-1">Read Now</p>
      </router-link>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        :class="{ 'text-red-300 hover:text-red-300': !book.paperback }"
        @click="
          book.paperback
            ? $router.push(
                '/books/' +
                  book.isbn +
                  '/' +
                  book.title.toLowerCase().replace(/ /g, '-') +
                  '?action=get_paperback'
              )
            : $message.info(`${book.title} is not available in paperback`)
        "
      >
        <i class="icofont-read-book text-2xl"></i>
        <p class="text-xs mt-1">Paperback</p>
      </div>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        :class="{ 'text-primary hover:text-primary': listed }"
        @click="listed ? removeFromList() : addToList()"
      >
        <i
          :class="listed ? 'icofont-minus-square' : 'icofont-plus-square'"
          class="text-2xl"
        ></i>
        <p class="text-xs mt-1">{{ listed ? "Remove from" : "Add to" }} list</p>
      </div>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        @click="shareBook()"
      >
        <i class="icofont-share text-2xl"></i>
        <p class="text-xs mt-1">Share</p>
      </div>
    </div>
    <router-link
      :to="`/books/${book.isbn}/` + book.title.toLowerCase().replace(/ /g, '-')"
      class="h-1/6 flex items-center justify-between p-3 border-t bg-gray-50 font-bold"
    >
      Read more
      <i class="icofont-simple-right"></i>
    </router-link>
  </div>
</template>

<script>
import {
  addToList as addList,
  removeFromList as removeList,
  fetchList,
} from "@/services/books";

import { UID } from "@/utils/constants";

export default {
  name: "BookPreview",
  props: {
    book: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      listed: false,
    };
  },
  computed: {
    lists() {
      return this.$store.state.user_list;
    },
  },
  mounted() {
    //Check if this book ISBN is in the user.list_ISBN and toggle list to true
    this.lists.forEach((element) => {
      if (element.books_id === this.book.isbn) {
        this.listed = true;
      }
    });
  },
  methods: {
    async addToList() {
      const payload = {
        profiles_id: localStorage.getItem(UID),
        books_id: this.book.isbn,
      };
      await addList(payload)
        .then((response) => {
          this.$message.info(`${this.book.title} has been added to your list`);
          this.$store.commit("ADD_TO_LIST", response[0]);
          this.listed = true;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async removeFromList() {
      let list_id;
      this.lists.forEach((element) => {
        if (element.books_id === this.book.isbn) {
          list_id = element.id;
        }
      });

      await removeList(list_id)
        .then(() => {
          // fetch the list back
          this.fetchLists();
          this.listed = false;
          this.$message.warning(
            `${this.book.title} has been removed from your list`
          );
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async fetchLists() {
      await fetchList(localStorage.getItem(UID)).then(async (lists) => {
        this.$store.commit("SET_USER_LIST", lists);
      });
    },
    shareBook() {
      const data = {
        title: "Read more books on Orunla",
        text: "We are building the biggest library of African literature. Come see",
        url: `https://twitter.com/orunla-africa`,
      };
      try {
        navigator.share(data);
      } catch (error) {
        this.$message.error(
          "There seems to be an issue, we'll rectify this issue soonest."
        );
        console.log(error);
      }
    },
  },
};
</script>
