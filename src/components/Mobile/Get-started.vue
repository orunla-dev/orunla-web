<template>
  <div class="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-20 z-50">
    <div class="bg-white p-5 pt-16 h-full">
      <div class="h-1/6">
        <h1 class="text-2xl font-bold text-primary mb-1">
          Select genres you love
        </h1>
        <p class="">
          Orunla is best enjoyed with topics you love to read about.
        </p>
      </div>
      <div
        class="h-4/6 mt-5 flex flex-wrap justify-start gap-5 overflow-y-auto"
      >
        <div
          class="w-36 h-52 p-3 rounded-md bg-gray-100 relative overflow-hidden"
          :style="`background-color: ${category.color}`"
          v-for="(category, index) in categories"
          :key="index"
          @click="
            selected.includes(category.title)
              ? removeCategory(category.title)
              : addCategory(category.title)
          "
        >
          <div
            class="absolute bg-white top-0 right-0 left-0 bottom-0 bg-opacity-50 z-10 flex justify-end items-end p-3"
            v-if="selected.includes(category.title)"
          >
            <i class="icofont-check-circled text-3xl text-primary"></i>
          </div>
          <p class="text-2xl text-white">
            {{ category.title }}
          </p>
          <img
            :src="category.icon"
            class="w-24 absolute -right-5 -bottom-10 rounded-xl"
            :class="
              selected.includes(category.title) ? 'opacity-20 -bottom-14' : ''
            "
          />
        </div>
      </div>
      <div class="mt-10 flex justify-end items-center px-3">
        <p class="mr-5 text-xl">{{ selected.length }}/3</p>
        <el-button
          type="primary"
          :loading="loading"
          size="medium"
          class="w-3/4 flex justify-between items-center"
          @click="saveCategories()"
        >
          Get started
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { CATEGORIES, UID } from "@/utils/constants";
import { updateProfile } from "@/services/profile";

export default {
  name: "GetStartedModal",
  data() {
    return {
      categories: CATEGORIES,
      loading: false,
      selected: [],
    };
  },
  methods: {
    addCategory(category) {
      if (this.selected.length >= 3) {
        return;
      }
      this.selected.push(category);
    },
    removeCategory(category) {
      const index = this.selected.indexOf(category);
      if (index > -1) this.selected.splice(index, 1);
    },
    async saveCategories() {
      if (this.selected.length < 3) {
        this.$message.warning("Please select 3");
        return;
      }
      this.loading = true;
      const payload = {
        my_genres: this.selected,
      };

      await updateProfile(localStorage.getItem(UID), payload)
        .then((response) => {
          this.$store.commit("SET_USER", response[0]);
        })
        .catch((error) => {
          console.log(error);
        });

      this.loading = false;
    },
  },
};
</script>
