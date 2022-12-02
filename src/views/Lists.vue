<template>
  <div class="">
    <div class="flex items-center gap-1 text-gray-600 mb-5">
      <router-link to="/">Home</router-link>
      <i class="icofont-thin-right mt-1 text-xl"></i>
      <p class="font-semibold line-clamp-1">My Lists</p>
    </div>
    <div class="flex gap-3 flex-wrap py-5" v-if="lists.length > 0">
      <div
        class="w-full h-36 md:w-80 p-2 flex-shrink-0 bg-white border rounded-md flex items-start gap-3"
        v-for="book in lists"
        :key="book.books.isbn"
      >
        <img :src="book.books.img" class="h-full rounded-md" />
        <div class="">
          <router-link
            :to="
              `/books/${book.books.isbn}/` +
              book.books.title.toLowerCase().replace(/ /g, '-')
            "
            class="text-lg font-bold text-primary line-clamp-2 hover:opacity-80"
          >
            {{ book.books.title }}
          </router-link>
          <h3 class="text-sm md:text-md">
            {{
              book.books.authors.fullname ||
              book.books.authors.profiles.full_name ||
              "Not available"
            }}
          </h3>
          <p class="line-clamp-2 text-sm my-2">{{ book.books.description }}</p>
          <div class="flex justify-between mr-2">
            <router-link
              :to="`/read/${book.books.isbn}`"
              class="text-center text-gray-500 hover:text-black cursor-pointer"
            >
              <i class="icofont-ebook text-xl"></i>
            </router-link>
            <div
              class="text-center text-gray-500 hover:text-black cursor-pointer"
              :class="{
                'text-red-300 hover:text-red-300': !book.books.paperback,
              }"
              @click="
                book.books.paperback
                  ? $router.push(
                      '/books/' +
                        book.books.isbn +
                        '/' +
                        book.books.title.toLowerCase().replace(/ /g, '-') +
                        '?action=get_paperback'
                    )
                  : $message.info(
                      `${book.books.title} is not available in paperback`
                    )
              "
            >
              <i class="icofont-read-book text-xl"></i>
            </div>
            <div
              class="text-center text-gray-500 hover:text-black cursor-pointer"
              @click="removeFromList(book)"
            >
              <i class="icofont-minus-square text-xl"></i>
            </div>
            <div
              class="text-center text-gray-500 hover:text-black cursor-pointer"
              @click="shareBook()"
            >
              <i class="icofont-share text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-full flex justify-center items-center" v-else>
      <div class="text-center">
        <img src="@/assets/svgs/Empty-List.svg" class="mx-auto my-0 md:w-1/2" />
        <div class="md:w-1/2 mx-auto my-0">
          <h3 class="text-3xl my-3 font-bold">Nothing here</h3>
          <p class="">
            Adding books to your list is a nice way to remind yourself of books
            you want to read later.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { removeFromList as removeList, fetchList } from "@/services/books";
import { UID } from "@/utils/constants";

export default {
  name: "ListPage",
  computed: {
    lists() {
      return this.$store.state.user_list;
    },
  },
  methods: {
    async removeFromList(book) {
      let list_id;
      this.lists.forEach((element) => {
        if (element.books_id === book.books.isbn) {
          list_id = element.id;
        }
      });

      await removeList(list_id)
        .then(() => {
          // fetch the list back
          this.fetchLists();
          this.listed = false;
          this.$message.warning(
            `${book.books.title} has been removed from your list`
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

<style></style>
