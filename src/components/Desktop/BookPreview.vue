<template>
  <div
    class="fixed bottom-0 right-0 top-0 left-0 pt-20 pb-10 flex items-end justify-center bg-black bg-opacity-25 z-30"
  >
    <div
      class="bg-white w-3/6 h-full border rounded-md shadow-md overflow-hidden relative"
    >
      <div
        class="h-1/2"
        :style="`background-image:  linear-gradient(rgba(255, 255, 255, 0.5), rgba(0,0,0,1)), url(${book.img}); background-repeat: no-repeat; background-size: cover; background-position: center top;`"
      ></div>
      <i
        class="icofont-close-circled font-bold text-3xl cursor-pointer absolute top-5 right-5"
        @click="$emit('close')"
      ></i>
      <div class="p-5 flex justify-between -mt-24">
        <div class="w-full flex gap-5">
          <img :src="book.img" class="w-auto h-1/3 rounded-md" />
          <div class="-mt-2">
            <h2 class="text-3xl text-white font-bold line-clamp-1">
              {{ book.title }}
            </h2>
            <p class="text-gray-100 line-clamp-2">{{ book.sub_title }}</p>
            <div class="mt-8">
              <h3 class="font-bold">About</h3>
              {{ book.description }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="px-5 py-3 bg-white border-t flex justify-between absolute bottom-0 right-0 left-0"
      >
        <router-link
          :to="
            `/books/${book.isbn}/` + book.title.toLowerCase().replace(/ /g, '-')
          "
          class="text-center py-1 px-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <i class="icofont-info-circle text-2xl"></i>
          <p class="text-xs mt-1">More Info</p>
        </router-link>
        <router-link
          :to="`/read/${book.isbn}`"
          class="text-center py-1 px-3 text-gray-500 hover:text-black cursor-pointer"
        >
          <i class="icofont-ebook text-2xl"></i>
          <p class="text-xs mt-1">Read Now</p>
        </router-link>
        <div
          class="text-center py-1 px-3 text-gray-500 hover:text-black cursor-pointer"
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
          class="text-center py-1 px-3 text-gray-500 hover:text-black cursor-pointer"
          :class="{ 'text-primary hover:text-primary': listed }"
          @click="listed ? removeFromList() : addToList()"
        >
          <i
            :class="listed ? 'icofont-minus-square' : 'icofont-plus-square'"
            class="text-2xl"
          ></i>
          <p class="text-xs mt-1">
            {{ listed ? "Remove from" : "Add to" }} list
          </p>
        </div>
        <div
          class="text-center py-1 px-3 text-gray-500 hover:text-black cursor-pointer"
          @click="shareBook()"
        >
          <i class="icofont-share text-2xl"></i>
          <p class="text-xs mt-1">Share</p>
        </div>
      </div>
    </div>
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
  name: "DesktopBookPreview",
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
