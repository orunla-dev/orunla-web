<template>
  <div
    class="fixed top-0 bottom-0 right-0 left-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div
      class="bg-white w-full h-full p-5 pb-20 md:w-1/2 md:h-5/6 md:rounded-xl overflow-y-scroll"
    >
      <div class="flex justify-between items-center border-b pb-3 text-xl">
        {{ action === "edit" ? `Edit ${book.title}` : "Add New Book" }}
        <el-button icon="icofont-close-line" circle @click="$emit('close')" />
      </div>
      <div
        @click="routeToAdmins()"
        class="bg-red-100 p-3 rounded-md cursor-pointer mt-5"
        v-if="action === 'add'"
      >
        If you can't find an author, please create a new one by clicking here.
      </div>
      <ValidationObserver v-slot="{ invalid }">
        <el-form class="mt-5">
          <div class="md:flex gap-5">
            <ValidationProvider
              name="Book ISBN"
              v-slot="{ errors }"
              rules="required|numeric|min:10|max:13"
              class="md:w-1/2"
            >
              <el-form-item label="ISBN">
                <el-input
                  placeholder="International Standard Book Number"
                  type="number"
                  v-model="book.isbn"
                  :disabled="action === 'edit'"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon icofont-barcode text-xl"
                  ></i>
                </el-input>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
            <ValidationProvider
              name="Book Author"
              v-slot="{ errors }"
              class="md:w-1/2"
            >
              <el-form-item label="Book Author">
                <div
                  class="flex gap-3 items-center justify-start border px-2 h-10 mt-10 rounded-md relative"
                  v-if="book.authors_id"
                >
                  <i class="icofont-user-alt-3 text-xl text-gray-400"></i>
                  <span class="text-md" v-if="action === 'add'">
                    {{ author.fullname }}
                  </span>
                  <span class="text-md" v-else>
                    {{ book.authors.fullname }}
                  </span>
                  <i
                    v-if="action === 'add'"
                    class="icofont-close-line-circled text-xl cursor-pointer hover:text-red-500 absolute right-3"
                    @click="
                      book.authors_id = '';
                      author = '';
                    "
                  ></i>
                </div>
                <el-autocomplete
                  v-else
                  placeholder="Search Author"
                  type="text"
                  class="w-full"
                  :fetch-suggestions="searchAdmin"
                  v-model="author"
                  @select="handleSelect"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon icofont-search-user text-xl"
                  ></i>
                  <template slot-scope="{ item }">
                    <div class="value">
                      {{ item.fullname }}
                    </div>
                  </template>
                </el-autocomplete>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
          </div>
          <div class="md:flex gap-5">
            <div class="md:w-1/2">
              <ValidationProvider
                name="Book Title"
                v-slot="{ errors }"
                rules="required"
              >
                <el-form-item label="Book Title">
                  <el-input
                    placeholder="Title"
                    type="text"
                    v-model="book.title"
                  >
                    <i
                      slot="prefix"
                      class="el-input__icon icofont-info-circle text-xl"
                    ></i>
                  </el-input>
                  <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
                </el-form-item>
              </ValidationProvider>
              <ValidationProvider
                name="Book Subtitle"
                v-slot="{ errors }"
                rules="required"
              >
                <el-form-item label="Book Subtitle">
                  <el-input
                    placeholder="Book Subtitle"
                    type="text"
                    v-model="book.sub_title"
                  >
                    <i
                      slot="prefix"
                      class="el-input__icon icofont-paragraph text-xl"
                    ></i>
                  </el-input>
                  <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
                </el-form-item>
              </ValidationProvider>
            </div>
            <ValidationProvider
              name="About Book"
              v-slot="{ errors }"
              rules="required"
              class="md:w-1/2"
            >
              <el-form-item label="About Book">
                <el-input
                  placeholder="About Book"
                  type="textarea"
                  v-model="book.description"
                  :autosize="{ minRows: 7, maxRows: 7 }"
                />
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
          </div>
          <div class="md:flex gap-5">
            <div class="md:w-1/2">
              <ValidationProvider
                name="Restricted To"
                v-slot="{ errors }"
                rules="required"
                class="md:w-1/2"
              >
                <el-form-item label="Restricted To">
                  <el-select
                    v-model="book.restricted_to"
                    placeholder="Please Select"
                    class="w-full"
                  >
                    <el-option
                      v-for="item in ['Freenium', 'Premium']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </ValidationProvider>
              <div class="md:w-1/2">
                <el-form-item label="Rating">
                  <br />
                  <star-rater
                    @rated="rate"
                    class="text-xl"
                    v-if="action === 'add'"
                  />
                  <star-rating :grade="book.rating" class="text-xl" v-else />
                </el-form-item>
              </div>
            </div>
            <div class="md:w-1/2">
              <el-form-item label="Book Cover Image">
                <br />
                <div class="flex">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    class="hidden"
                    ref="img"
                    @change="handleUpload"
                  />
                  <img :src="book.img" class="rounded-md" v-if="book.img" />
                  <div
                    class="flex justify-center items-center border border-dashed rounded-md cursor-pointer bg-secondary bg-opacity-10 w-1/2 h-36"
                    @click="$refs.img.click()"
                    v-else
                  >
                    <i class="icofont-plus text-3xl text-secondary"></i>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="md:flex gap-5">
            <ValidationProvider
              name="Publisher"
              v-slot="{ errors }"
              rules="required"
              class="md:w-1/2"
            >
              <el-form-item label="Publisher">
                <el-input
                  placeholder="Publisher"
                  type="text"
                  v-model="book.publisher"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon icofont-bag-alt text-xl"
                  ></i>
                </el-input>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
            <ValidationProvider
              name="Publication date"
              v-slot="{ errors }"
              rules="required"
              class="md:w-1/2"
            >
              <el-form-item label="Publication date">
                <el-date-picker
                  placeholder="Publication date"
                  class="block w-full"
                  type="date"
                  v-model="book.publish_date"
                >
                </el-date-picker>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
          </div>
          <div class="md:flex gap-5">
            <ValidationProvider
              name="Book Categories"
              v-slot="{ errors }"
              rules="required"
              class="md:w-1/2"
            >
              <el-form-item label="Book Category">
                <el-input
                  placeholder="Comma seperated"
                  type="text"
                  v-model="book.categories"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon icofont-folder text-xl"
                  ></i>
                </el-input>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
            <ValidationProvider
              name="Number of pages"
              v-slot="{ errors }"
              rules="required"
              class="md:w-1/2"
            >
              <el-form-item label="Number of Pages">
                <el-input
                  placeholder="Number of pages"
                  type="number"
                  v-model="book.totalPages"
                >
                  <i
                    slot="prefix"
                    class="el-input__icon icofont-numbered text-xl"
                  ></i>
                </el-input>
                <p class="text-red-300 text-sm mt-2">{{ errors[0] }}</p>
              </el-form-item>
            </ValidationProvider>
          </div>
          <div class="md:flex gap-5">
            <div class="md:w-1/2">
              <el-form-item label="Paperback Available">
                <br />
                <el-radio v-model="book.paperback" :label="true" border>
                  Yes
                </el-radio>
                <el-radio v-model="book.paperback" :label="false" border>
                  No
                </el-radio>
              </el-form-item>
            </div>
          </div>
          <el-button
            type="primary"
            native-type="submit"
            class="w-full"
            :loading="submitting"
            :disabled="action === 'add' ? invalid : false"
            @click="action === 'add' ? addBook() : editBook()"
          >
            {{ action === "add" ? "Add New Book" : `Save ${book.title}` }}
          </el-button>
        </el-form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { fetchAllAuthors } from "@/services/authors.js";
import { uploadToCloudinary } from "@/services/profile.js";
import { addABook, saveABook } from "@/services/admin.js";

import imageCompression from "browser-image-compression";

export default {
  name: "AddNewBookModal",
  components: {
    StarRater: () => import("@/components/Base/StarRate.vue"),
    StarRating: () => import("@/components/Base/StarRating.vue"),
  },
  props: {
    action: {
      required: false,
      default: () => {
        return "add";
      },
    },
    data: {
      required: false,
      default: () => {
        return {
          isbn: 0,
          authors_id: "",
          title: "",
          description: "",
          restricted_to: "",
          img: "",
          sub_title: "",
          rating: 0.0,
          paperback: false,
          categories: [],
          ebook: "",
          totalPages: 0,
          publisher: "",
          publish_date: "",
        };
      },
    },
  },
  computed: {
    book: {
      get() {
        return this.data;
      },
      set(newValue) {
        this.data = newValue;
      },
    },
  },
  methods: {
    routeToAdmins() {
      this.$router.push("?action=add_admin");
    },
    rate(star) {
      this.book.rating = star;
    },
    handleSelect(item) {
      this.book.authors_id = item.uid;
      this.author = item;
    },
    searchAdmin(queryString, cb) {
      var results = queryString
        ? this.authors.filter(this.createFilter(queryString))
        : this.authors;
      cb(results);
    },
    createFilter(queryString) {
      return (link) => {
        return (
          link.fullname.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    async getAllAuthors() {
      await fetchAllAuthors({ start: 0, end: 10000 })
        .then((response) => {
          this.authors = response;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async handleUpload(e) {
      const imageFile = e.target.files[0];
      let formData = new FormData();

      const options = {
        maxSizeMB: 0.5,
        useWebWorker: true,
        maxWidthOrHeight: 1000,
      };

      await imageCompression(imageFile, options)
        .then((compressedFile) => {
          const file = new File([compressedFile], compressedFile.name, {
            type: compressedFile.type,
          });
          formData.append("file", file);
        })
        .catch((error) => {
          console.error(error);
        });

      formData.append("upload_preset", "book_cover");
      formData.append("folder", "books");
      await uploadToCloudinary(formData)
        .then((response) => {
          this.book.img = response.data.url;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async addBook() {
      this.submitting = true;
      this.book.categories = this.book.categories.split(",");
      await addABook(this.book)
        .then(() => {
          this.$emit("created");
          this.$message.success("Book added");
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
    async editBook() {
      this.submitting = true;
      if (this.book.categories instanceof Array) {
        console.log("Hello");
      } else {
        this.book.categories = this.book.categories.split(",");
      }
      delete this.book.authors;
      await saveABook(this.book)
        .then(() => {
          this.$emit("created");
          this.$message.success(`${this.book.title} updated`);
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
  },
  data() {
    return {
      author: "",
      authors: [],
      submitting: false,
    };
  },
  mounted() {
    this.getAllAuthors();
  },
};
</script>

<style scoped>
>>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
