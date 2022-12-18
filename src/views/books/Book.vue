<template>
  <div class="min-h-screen">
    <div class="flex items-center justify-center h-screen" v-if="loading">
      <loading />
    </div>
    <div class="md:flex md:gap-10" v-else>
      <div class="md:w-2/3">
        <div class="flex items-center gap-1 text-gray-600 mb-5">
          <router-link to="/">Home</router-link>
          <i class="icofont-thin-right mt-1 text-xl"></i>
          <router-link to="/books">Books</router-link>
          <i class="icofont-thin-right mt-1 text-xl"></i>
          <p class="font-semibold line-clamp-1">{{ book.title }}</p>
        </div>
        <div class="flex items-start gap-5 pb-5 border-b">
          <div class="w-6/12 md:w-11/12">
            <img :src="book.img" class="w-full rounded-md" />
            <div class="rounded-md shadow-md bg-white mt-5 hidden md:block">
              <div
                class="flex text-center p-2 gap-2 font-bold text-gray-500 hover:text-black border-b-2 cursor-pointer"
                :class="{ 'text-primary hover:text-primary': listed }"
                @click="listed ? removeFromList() : addToList()"
              >
                <i
                  :class="
                    listed ? 'icofont-minus-square' : 'icofont-plus-square'
                  "
                  class="text-2xl"
                ></i>
                <p class="text-xs mt-1">
                  {{ listed ? "Remove from" : "Add to" }} list
                </p>
              </div>
              <div
                class="flex text-center p-2 gap-2 font-bold text-gray-500 hover:text-black cursor-pointer"
                @click="shareBook()"
              >
                <i class="icofont-share text-2xl"></i>
                <p class="text-xs mt-1">Share</p>
              </div>
            </div>
          </div>
          <div class="">
            <div class="flex items-start gap-2 relative">
              <h1 class="text-3xl font-bold">{{ book.title }}</h1>
              <div
                class="w-1 md:hidden"
                :class="menu ? 'text-secondary' : ''"
                @click="menu = !menu"
              >
                <i class="el-icon-more transform rotate-90"></i>
              </div>
              <div
                v-if="menu"
                class="absolute top-8 right-0 w-40 overflow-hidden rounded-md shadow-md bg-white"
              >
                <div
                  class="flex text-center p-3 gap-2 font-bold text-gray-500 hover:text-black border-b-2"
                  :class="{ 'text-primary hover:text-primary': listed }"
                  @click="listed ? removeFromList() : addToList()"
                >
                  <i
                    :class="
                      listed ? 'icofont-minus-square' : 'icofont-plus-square'
                    "
                    class="text-2xl"
                  ></i>
                  <p class="text-xs mt-1">
                    {{ listed ? "Remove from" : "Add to" }} list
                  </p>
                </div>
                <div
                  class="flex text-center p-3 gap-2 font-bold text-gray-500 hover:text-black"
                  @click="shareBook()"
                >
                  <i class="icofont-share text-2xl"></i>
                  <p class="text-xs mt-1">Share</p>
                </div>
              </div>
            </div>
            <router-link
              :to="
                book.authors.fullname
                  ? `/authors/${book.authors.uid}`
                  : `/user/${book.authors.profiles.username}`
              "
              class="font-bold text-secondary hidden md:block"
              >{{
                book.authors.fullname || book.authors.profiles.full_name
              }}</router-link
            >
            <p class="my-2 text-sm">{{ book.sub_title }}</p>
            <router-link
              :to="
                book.authors.fullname
                  ? `/authors/${book.authors.uid}`
                  : `/user/${book.authors.profiles.full_name}`
              "
              class="font-bold text-secondary md:hidden"
              >{{
                book.authors.fullname || book.authors.profiles.full_name
              }}</router-link
            >
            <div class="hidden md:block mt-5">
              <h2 class="font-bold text-lg">About Book</h2>
              <p class="">{{ book.description }}</p>
              <div class="flex justify-start gap-4 overflow-x-auto pt-3">
                <div
                  class="py-1 px-3 border rounded-md text-gray-700 capitalize flex-shrink-0"
                  v-for="category in book.categories"
                  :key="category"
                >
                  {{ category }}
                </div>
              </div>
            </div>
            <div class="my-5 hidden md:flex gap-5">
              <div class="w-1/2">
                <router-link :to="`/read/${book.isbn}`">
                  <el-button type="primary" class="w-full font-bold">
                    Read Online
                  </el-button>
                </router-link>
              </div>
              <div class="w-1/2" v-if="book.paperback">
                <el-button
                  class="w-full font-bold"
                  :type="
                    $route.query.action === 'get_paperback'
                      ? 'primary'
                      : 'secondary'
                  "
                  :plain="
                    $route.query.action === 'get_paperback' ? true : false
                  "
                  @click="
                    $router.push({
                      path: $route.fullPath,
                      query: {
                        action: 'get_paperback',
                        t: new Date().getTime(),
                      },
                    })
                  "
                >
                  Get Paperback
                </el-button>
              </div>
              <p class="w-1/2 text-red-500" v-else>Paperback not available</p>
            </div>
          </div>
        </div>
        <div class="my-5 flex gap-5 md:hidden">
          <div class="w-1/2">
            <router-link :to="`/read/${book.isbn}`">
              <el-button type="primary" class="w-full font-bold">
                Read Online
              </el-button>
            </router-link>
          </div>
          <div class="w-1/2" v-if="book.paperback">
            <el-button
              class="w-full font-bold"
              :type="
                $route.query.action === 'get_paperback'
                  ? 'primary'
                  : 'secondary'
              "
              :plain="$route.query.action === 'get_paperback' ? true : false"
              @click="
                $router.push({
                  path: $route.fullPath,
                  query: { action: 'get_paperback', t: new Date().getTime() },
                })
              "
            >
              Get Paperback
            </el-button>
          </div>
          <p class="w-1/2 text-red-500" v-else>Paperback not available</p>
        </div>
        <div class="my-5 border-b pb-5 md:hidden">
          <h2 class="font-bold text-xl">About Book</h2>
          <p class="">{{ book.description }}</p>
          <div class="flex justify-start gap-4 overflow-x-auto pt-3">
            <div
              class="py-1 px-3 border rounded-md text-gray-700 capitalize flex-shrink-0"
              v-for="category in book.categories"
              :key="category"
            >
              {{ category }}
            </div>
          </div>
        </div>
        <!--- If user has not completed the book, can't review -->
        <div
          class="my-5 pb-5 border-b"
          v-if="userHasNotReviewed && userCanReview"
        >
          <h2 class="font-bold text-xl">Review this book</h2>
          <p class="text-sm mb-3">Tell others what you think about this book</p>
          <star-rater @rated="openRatingModal" />
        </div>
        <div class="md:flex gap-3 md:mt-5 flex-wrap pb-5 border-b">
          <p class="">
            <abbr title="International Standard Book Number" class="font-bold"
              >ISBN:</abbr
            >
            {{ book.isbn }}
          </p>
          <p class=""><b>PUBLISHED:</b> {{ book.publish_date }}</p>
          <p class=""><b>PUBLISHER:</b> {{ book.publisher }}</p>
          <p class=""><b>PAGES:</b> {{ book.pages }}</p>
        </div>
        <div class="my-5 border-b pb-10">
          <h2 class="font-bold text-xl">Readers review</h2>
          <div class="mt-5" v-if="reviews.length === 0">
            <p class="text-sm">
              Reviews are from people who have completed a particular book
            </p>
            <p class="text-md mt-1">No reviews yet</p>
          </div>
          <div class="flex gap-3 mt-3 overflow-x-auto" v-else>
            <div
              class="p-5 bg-gray-50 border rounded-lg w-4/6"
              v-for="review in reviews"
              :key="review.id"
            >
              <p>{{ review.profiles.full_name }}</p>
              <div class="flex gap-3 my-3">
                <star-rating :grade="review.rating" />
                <p class="text-xs">
                  {{ moment(review.created_at).format("DD/MM/YYYY") }}
                </p>
              </div>
              <p class="text-md text-gray-600">{{ review.message }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="md:w-1/3 mt-5 md:mt-0 md:bg-gray-50 md:p-5 rounded-lg">
        <h2 class="text-xl font-bold">Related titles</h2>
        <div class="flex gap-10 md:gap-3 flex-wrap mt-5">
          <router-link
            :to="
              `/books/${book.isbn}/` +
              book.title.toLowerCase().replace(/ /g, '-')
            "
            class="w-32 md:w-32 border rounded-md text-center p-3 hover:bg-gray-100"
            :title="
              book.title + ' by ' + book.authors.fullname ||
              book.authors.profiles.full_name
            "
            v-for="book in related"
            :key="book.isbn"
          >
            <img :src="book.img" class="w-3/4 rounded-md inline" />
            <div class="py-2">
              <h1 class="text-primary font-bold line-clamp-2">
                {{ book.title }}
              </h1>
              <h3 class="text-sm mt-1">
                {{
                  book.authors.fullname ||
                  book.authors.profiles.full_name ||
                  "Not available"
                }}
              </h3>
            </div>
          </router-link>
        </div>
      </div>
      <div
        class="fixed bottom-0 right-0 left-0 top-0 bg-black bg-opacity-10 md:bg-opacity-50 md:top-0 md:flex md:items-center md:justify-center"
        style="z-index: 99"
        v-if="$route.query.action === 'get_paperback'"
      >
        <div class="h-1/3 md:hidden" @click="handleClick()"></div>
        <div
          class="h-2/3 md:h-auto md:w-1/3 md:rounded-xl bg-white rounded-t-3xl pt-5 md:relative md:py-5"
        >
          <div
            class="my-0 mx-auto w-2/3 bg-gray-200 p-1 rounded-full md:hidden"
            @click="handleClick()"
          ></div>
          <i
            class="icofont-close-circled font-bold text-3xl cursor-pointer hidden md:block absolute right-5 text-red-500"
            @click="handleClick()"
          ></i>
          <div class="p-5">
            <h2 class="text-lg text-primary">Get Paperback</h2>
            <h1 class="text-3xl font-bold">{{ book.title }}</h1>
            <h2 class="text-xl mt-3 mb-5">
              {{ book.authors.fullname || book.authors.profiles.full_name }}
            </h2>
            <p class="">
              Paperback copies are available in locations below, please select a
              desirable location for drop off.
            </p>
          </div>
          <div class="px-5" v-if="user.uid">
            <el-button type="primary" class="w-full">Get paperback</el-button>
          </div>
          <router-link
            v-else
            :to="`/auth/login?continue=${$route.fullPath}`"
            class="bg-primary text-white rounded-md block mx-5 py-3 text-center"
          >
            Log in to continue
          </router-link>
        </div>
      </div>
      <div
        class="fixed bottom-0 right-0 left-0 top-0 bg-black bg-opacity-10 md:bg-opacity-50 md:top-0 md:flex md:items-center md:justify-center"
        style="z-index: 99"
        v-if="ratingModal"
      >
        <div
          class="h-full md:h-auto md:w-1/3 md:rounded-xl bg-white pt-5 md:relative md:py-5"
        >
          <i
            class="icofont-close-circled font-bold text-3xl cursor-pointer absolute right-5 text-red-500"
            @click="ratingModal = false"
          ></i>
          <div class="p-5">
            <h1 class="text-3xl font-bold">{{ book.title }}</h1>
            <p class="">Rate this book</p>
          </div>
          <div class="px-5">
            <ValidationObserver v-slot="{ invalid }">
              <el-form>
                <ValidationProvider
                  name="Review"
                  v-slot="{ errors }"
                  rules="required"
                >
                  <el-input
                    type="textarea"
                    v-model="ratingMessage"
                    placeholder="Describe how you feel about this book"
                    class="rounded-md"
                    :autosize="{ minRows: 7, maxRows: 14 }"
                    :class="errors[0] ? 'border border-red-300' : ''"
                  />
                </ValidationProvider>
                <p class="mt-1 mb-10 text-sm">Reviews are displayed publicly</p>
                <el-button
                  :disabled="invalid"
                  :loading="submitting"
                  type="primary"
                  class="w-full"
                  @click="addToReview()"
                >
                  Post review
                </el-button>
              </el-form>
            </ValidationObserver>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import breakpoints from "@/utils/breakpoints.js";
import {
  fetchBook,
  addToList as addList,
  removeFromList as removeList,
  fetchList,
  fetchBookReview,
  addReview,
  fetchRelatedBooks,
} from "@/services/books";

import { loadFromUserHistory } from "@/services/profile";

import { UID } from "@/utils/constants";

export default {
  name: "BookPage",
  components: {
    StarRating: () => import("@/components/Base/StarRating.vue"),
    StarRater: () => import("@/components/Base/StarRate.vue"),
    Loading: () => import("@/components/Base/Loading.vue"),
  },
  data() {
    return {
      loading: true,
      breakpoints,
      book: {},
      reviews: [],
      related: [],
      menu: false,
      listed: false,
      myRating: 0,
      ratingModal: false,
      ratingMessage: "",
      submitting: false,
      userCanReview: false,
    };
  },
  computed: {
    lists() {
      return this.$store.state.user_list;
    },
    user() {
      return this.$store.state.user;
    },
    userHasNotReviewed() {
      if (localStorage.getItem(UID) === null) return false;
      if (this.reviews.length === 0) return true;
      if (
        this.reviews.filter(
          (review) => review.profile_id === localStorage.getItem(UID)
        )
      ) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    async fetchTitle() {
      this.related = [];
      await fetchBook(this.$route.params.isbn)
        .then((response) => {
          this.book = response[0];
          this.loading = false;
          this.fetchTitleReview();
          this.book.categories.forEach((category) => {
            this.fetchRelatedTitles(category);
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async fetchRelatedTitles(category) {
      await fetchRelatedBooks(category)
        .then((response) => {
          response.forEach((book) => {
            if (book.isbn !== this.book.isbn) {
              this.related.push(book);
            }
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async addToList() {
      if (!localStorage.getItem(UID)) {
        this.$message.warning("Please log in to continue");
        return;
      }
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
    async fetchTitleReview() {
      await fetchBookReview(this.$route.params.isbn)
        .then((response) => {
          this.reviews = response;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("Failed to load book reviews");
        });
    },
    shareBook() {
      const data = {
        title: `${this.book.title} - ${
          this.book.authors.fullname || this.book.authors.profiles.full_name
        }`,
        text: this.book.description,
        url: window.location.href,
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
    handleClick() {
      this.$router.push(`/books/${this.$route.params.isbn}`);
    },
    openRatingModal(star) {
      this.myRating = star;
      this.ratingModal = true;
    },
    async addToReview() {
      this.submitting = true;
      if (!localStorage.getItem(UID)) {
        this.$message.warning("Please log in to continue");
        return;
      }

      const payload = {
        profile_id: localStorage.getItem(UID),
        book_id: this.book.isbn,
        isbn: this.book.isbn,
        message: this.ratingMessage,
        rating: this.myRating,
      };

      await addReview(payload)
        .then((response) => {
          this.reviews = [...this.reviews, ...response];
          this.ratingModal = false;
          this.$message.success("Review posted, thank you.");
        })
        .catch((error) => {
          this.$message.error(error);
        });

      this.submitting = false;
    },
    async fetchUserRead() {
      if (!localStorage.getItem(UID)) {
        return;
      }
      await loadFromUserHistory(
        localStorage.getItem(UID),
        this.$route.params.isbn
      )
        .then((response) => {
          if (response[0].completed) {
            this.userCanReview = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    $route() {
      if (!this.$route.query.action) {
        this.loading = true;
        this.fetchTitle();
        this.fetchUserRead();
      }
    },
  },
  mounted() {
    this.fetchTitle();
    this.lists.forEach((element) => {
      if (element.books_id === Number(this.$route.params.isbn)) {
        this.listed = true;
      }
    });
    this.fetchUserRead();
  },
  metaInfo() {
    return {
      title: this.book.title,
    };
  },
};
</script>
