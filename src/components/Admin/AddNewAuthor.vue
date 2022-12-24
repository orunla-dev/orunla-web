<template>
  <div
    class="fixed top-0 bottom-0 right-0 left-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div
      class="bg-white w-full h-full p-5 md:w-1/3 md:h-5/6 md:rounded-xl overflow-y-scroll"
    >
      <div class="flex justify-between items-center border-b pb-3 text-xl">
        {{ action === "edit" ? `Edit ${author.fullname}` : "Add New Author" }}
        <el-button icon="icofont-close-line" circle @click="$emit('close')" />
      </div>
      <ValidationObserver v-slot="{ invalid }">
        <el-form class="mt-5">
          <div class="flex justify-center">
            <input
              type="file"
              accept="image/png, image/jpeg"
              class="hidden"
              ref="img"
              @change="handleUpload"
            />
            <img :src="author.img" class="rounded-md w-1/2" v-if="author.img" />
            <div
              class="flex justify-center items-center border border-dashed rounded-md cursor-pointer bg-secondary bg-opacity-10 w-2/6 h-40"
              @click="$refs.img.click()"
              v-else
            >
              <i class="icofont-plus text-3xl text-secondary"></i>
            </div>
          </div>
          <ValidationProvider
            name="Author's name"
            v-slot="{ errors }"
            rules="required"
          >
            <el-form-item label="Name">
              <el-input
                placeholder="Author's fullname"
                type="text"
                v-model="author.fullname"
                :disabled="action === 'edit'"
              >
                <i
                  slot="prefix"
                  class="el-input__icon icofont-user-alt-3 text-xl"
                ></i>
              </el-input>
              <p class="text-red-300 text-sm">{{ errors[0] }}</p>
            </el-form-item>
          </ValidationProvider>
          <ValidationProvider
            name="About author"
            v-slot="{ errors }"
            rules="required"
          >
            <el-form-item label="Bio">
              <el-input
                placeholder="About author"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 5 }"
                v-model="author.about"
              />
              <p class="text-red-300 text-sm">{{ errors[0] }}</p>
            </el-form-item>
          </ValidationProvider>
          <ValidationProvider name="Author's website" v-slot="{ errors }">
            <el-form-item label="Website">
              <el-input
                placeholder="Author's website"
                type="url"
                v-model="author.website"
              >
                <i slot="prefix" class="el-input__icon icofont-web text-xl"></i>
              </el-input>
              <p class="text-red-300 text-sm">{{ errors[0] }}</p>
            </el-form-item>
          </ValidationProvider>
          <ValidationProvider name="Author's Twitter" v-slot="{ errors }">
            <el-form-item label="Twitter">
              <el-input
                placeholder="Author's Twitter"
                type="url"
                v-model="author.twitter_url"
              >
                <i
                  slot="prefix"
                  class="el-input__icon icofont-twitter text-xl"
                ></i>
              </el-input>
              <p class="text-red-300 text-sm">{{ errors[0] }}</p>
            </el-form-item>
          </ValidationProvider>
          <ValidationProvider name="Author's Wikipedia" v-slot="{ errors }">
            <el-form-item label="Wikipedia page">
              <el-input
                placeholder="Author's Wikipedia"
                type="url"
                v-model="author.wikipedia_link"
              >
                <i
                  slot="prefix"
                  class="el-input__icon icofont-brand-wikipedia text-xl"
                ></i>
              </el-input>
              <p class="text-red-300 text-sm">{{ errors[0] }}</p>
            </el-form-item>
          </ValidationProvider>
          <div class="mt-10" />
          <el-button
            type="primary"
            native-type="submit"
            class="w-full"
            :loading="submitting"
            :disabled="action === 'add' ? invalid : false"
            @click="action === 'add' ? addAuthor() : editAuthor()"
          >
            {{
              action === "add" ? "Add New Author" : `Save ${author.fullname}`
            }}
          </el-button>
        </el-form>
      </ValidationObserver>
    </div>
  </div>
</template>
<script>
import { uploadToCloudinary } from "@/services/profile.js";
import { addAnAuthor } from "@/services/admin.js";

import imageCompression from "browser-image-compression";

export default {
  name: "AddAuthorModal",
  props: {
    action: {
      required: true,
      type: String,
      default: () => {
        return "add";
      },
    },
    data: {
      required: true,
      type: Object,
      default: () => {
        return {
          fullname: "",
          profile_id: "",
          about: "",
          img: "",
          website: "",
          twitter_url: "",
          wikipedia_link: "",
        };
      },
    },
  },
  computed: {
    author: {
      get() {
        return this.data;
      },
      set(newValue) {
        this.data = newValue;
      },
    },
  },
  data() {
    return {
      submitting: false,
    };
  },
  methods: {
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
      formData.append("folder", "authors");
      await uploadToCloudinary(formData)
        .then((response) => {
          this.author.img = response.data.url;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async addAuthor() {
      this.submitting = true;
      await addAnAuthor(this.author)
        .then(() => {
          this.$message.success(`${this.author.fullname} added`);
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
  },
};
</script>
