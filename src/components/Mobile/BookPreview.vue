<template>
  <div
    class="z-50 fixed h-1/3 top-auto right-0 bottom-0 left-0 bg-gray-100 rounded-t-3xl shadow-xl"
  >
    <div class="px-5 pt-5 flex justify-between gap-3 h-3/6">
      <img :src="book.img" class="h-full w-auto rounded-md" />
      <div class="flex justify-between gap-3 w-full">
        <div class="">
          <h2 class="text-2xl font-bold text-primary">{{ book.title }}</h2>
          <p class="text-gray-600 text-sm">{{ book.author }}</p>
          <p class="line-clamp-2">{{ book.sub_title }}</p>
        </div>
        <i
          class="icofont-close-circled font-bold text-3xl"
          @click="$emit('close')"
        ></i>
      </div>
    </div>
    <div class="h-2/6 px-5 py-3 flex justify-between">
      <div class="text-center py-1 px-3 text-gray-500 hover:text-black">
        <i class="icofont-ebook text-2xl"></i>
        <p class="text-sm mt-1">Read Now</p>
      </div>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        :class="{ 'text-red-300 hover:text-red-300': !book.paperback }"
        @click="
          book.paperback
            ? ''
            : $message.info(`${book.title} is not available in paperback`)
        "
      >
        <i class="icofont-read-book text-2xl"></i>
        <p class="text-sm mt-1">Paperback</p>
      </div>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        :class="{ 'text-primary hover:text-primary': listed }"
        @click="listed ? removeFromList() : addToList()"
      >
        <i class="icofont-list text-2xl"></i>
        <p class="text-sm mt-1">{{ listed ? "Remove from" : "Add to" }} list</p>
      </div>
      <div
        class="text-center py-1 px-3 text-gray-500 hover:text-black"
        @click="shareBook()"
      >
        <i class="icofont-share text-2xl"></i>
        <p class="text-sm mt-1">Share</p>
      </div>
    </div>
    <router-link
      to="/books"
      class="h-1/6 flex items-center justify-between px-5 border-t bg-gray-50 font-bold"
    >
      Read more
      <i class="icofont-simple-right"></i>
    </router-link>
  </div>
</template>

<script>
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
  mounted() {
    //Check if this book ISBN is in the user.list_ISBN and toggle list to true
  },
  methods: {
    addToList() {
      this.listed = true;
      this.$message.info(`${this.book.title} has been added to your list`);
    },
    removeFromList() {
      this.listed = false;
      this.$message.warning(
        `${this.book.title} has been removed from your list`
      );
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
        this.$message.error(error);
        console.log(error);
      }
    },
  },
};
</script>
