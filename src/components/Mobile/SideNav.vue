<template>
  <div class="fixed top-0 bottom-0 left-0 right-0 z-50 flex">
    <div class="w-3/4 z-50 bg-white">
      <div class="bg-gray-200 p-4 py-5">
        <img src="@/assets/Logo.png" class="w-28" />
      </div>
      <div
        class="px-5 py-3 flex justify-between"
        :class="tab === 'categories' ? 'font-bold bg-gray-400' : 'bg-gray-300'"
        @click="changeTab('categories')"
      >
        Categories
        <i
          :class="
            tab === 'categories' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
          "
        ></i>
      </div>
      <div class="bg-gray-300 px-5 py-2 h-52" v-if="tab === 'categories'">
        Categories
      </div>
      <div
        class="px-5 py-3 flex justify-between border-t-4"
        :class="
          tab === 'recommendations' ? 'font-bold bg-gray-400' : 'bg-gray-300'
        "
        @click="changeTab('recommendations')"
      >
        Recommendations
        <i
          :class="
            tab === 'recommendations'
              ? 'el-icon-arrow-up'
              : 'el-icon-arrow-down'
          "
        ></i>
      </div>
      <div class="bg-gray-300 px-5 py-2 h-52" v-if="tab === 'recommendations'">
        Recommendations
      </div>
      <div
        class="px-5 py-3 flex justify-between border-t-4"
        :class="tab === 'list' ? 'font-bold bg-gray-400' : 'bg-gray-300'"
        @click="changeTab('list')"
      >
        List
        <i
          :class="tab === 'list' ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        ></i>
      </div>
      <div class="bg-gray-300 px-5 py-2 h-52" v-if="tab === 'list'">List</div>
      <router-link
        to="/me/notification"
        class="px-5 py-3 flex justify-between border-t-4 bg-gray-300"
      >
        Notifications
        <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>
    <div class="w-1/4 bg-black bg-opacity-10" @click="$emit('close')"></div>
  </div>
</template>

<script>
export default {
  name: "SideNav",
  data() {
    return {
      tab: "",
    };
  },
  methods: {
    changeTab(tab) {
      if (this.tab === tab) {
        this.tab = false;
      } else {
        this.tab = tab;
      }
    },
  },
};
</script>
