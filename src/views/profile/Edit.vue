<template>
  <div class="h-full">
    <div class="md:w-1/3 my-0 mx-auto">
      <div class="flex justify-center">
        <input
          type="file"
          accept="image/png, image/jpeg"
          class="hidden"
          ref="img"
          @change="uploadImg"
        />
        <div
          class="p-7 rounded-md bg-gray-200 overflow-hidden cursor-pointer"
          @click="openFile()"
          v-if="!img"
        >
          <i class="icofont-user-alt-3 text-8xl text-primary"></i>
        </div>
        <div class="bg-gray-200 rounded-xl overflow-hidden" v-else>
          <img :src="img" class="w-40 h-auto" />
        </div>
      </div>
      <ValidationObserver v-slot="{ invalid }">
        <el-form>
          <ValidationProvider
            name="Fullname"
            v-slot="{ errors }"
            rules="required"
          >
            <el-form-item label="Full Name">
              <el-input
                v-model="user.full_name"
                placeholder="John Doe"
                class="flex items-center rounded-md"
                :class="errors[0] ? 'border border-red-300' : ''"
              >
                <i
                  slot="prefix"
                  class="icofont-user-alt-3 el-input__icon mr-1 text-lg"
                ></i>
              </el-input>
            </el-form-item>
          </ValidationProvider>
          <template v-if="userData.username === null">
            <ValidationProvider
              name="username"
              v-slot="{ errors }"
              rules="required"
            >
              <el-form-item label="Username">
                <el-input
                  :disabled="userData.username !== null"
                  v-model="user.username"
                  placeholder="Some Unique username"
                  class="flex items-center rounded-md"
                  :class="errors[0] ? 'border border-red-300' : ''"
                  @change="verifyUserName"
                >
                  <i
                    slot="prefix"
                    class="icofont-at el-input__icon mr-1 text-lg"
                    :class="`text-${icon}`"
                  ></i>
                </el-input>
              </el-form-item>
            </ValidationProvider>
          </template>
          <ValidationProvider
            name="location"
            v-slot="{ errors }"
            rules="required"
          >
            <el-form-item label="Location">
              <el-input
                v-model="user.location"
                placeholder="Some Unique username"
                class="flex items-center rounded-md"
                :class="errors[0] ? 'border border-red-300' : ''"
              >
                <i
                  slot="prefix"
                  class="icofont-location-pin el-input__icon mr-1 text-lg"
                ></i>
              </el-input>
            </el-form-item>
          </ValidationProvider>
          <ValidationProvider name="zone" v-slot="{ errors }" rules="required">
            <el-form-item label="Zone">
              <el-autocomplete
                v-model="zone"
                class="w-full"
                :fetch-suggestions="querySearch"
                placeholder="Input your state"
                @select="handleSelect"
                :class="errors[0] ? 'border border-red-300' : ''"
              >
                <i
                  slot="prefix"
                  class="icofont-location-arrow el-input__icon mr-1 text-lg"
                ></i>
                <template slot-scope="{ item }">
                  <div class="value">
                    {{ item.zone }} - {{ item.state }}, {{ item.country_code }}
                  </div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </ValidationProvider>
          <div class="mt-10" />
          <el-button
            class="w-full"
            type="primary"
            :disabled="invalid"
            @click="saveProfile"
            :loading="submitting"
          >
            Save Profile
          </el-button>
          <div class="mt-5" />
          <router-link
            to="/profile"
            class="block text-center p-2"
            v-if="userData.username !== null"
          >
            Cancel
          </router-link>
        </el-form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { fetchAllZones } from "@/services/zones";
import {
  updateProfile,
  checkUsername,
  uploadAvatar,
  loadAvatar,
} from "@/services/profile";
import { UID } from "@/utils/constants";

import imageCompression from "browser-image-compression";

export default {
  data() {
    return {
      user: {
        full_name: "",
        username: "",
        avatar_url: "",
        website: "",
        location: "",
        zone_id: "",
      },
      zone: "",
      submitting: false,
      zones: [],
      icon: "gray-400",
      img: "",
    };
  },
  methods: {
    async uploadImg(e) {
      const imageFile = e.target.files[0];

      const options = {
        maxSizeMB: 0.05,
        useWebWorker: true,
        maxWidthOrHeight: 250,
      };

      try {
        const compressedFile = await imageCompression(imageFile, options);
        await uploadAvatar(
          `${this.userData.username}.${compressedFile.type.split("/")[1]}`,
          compressedFile
        )
          .then(async (response) => {
            this.user.avatar_url = response.path;
            await this.saveUserPhoto();
            await this.loadUserAvatar(response.path);
            this.$message.success("Profile picture updated");
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } catch (error) {
        this.$message.error(error);
      }
    },
    async loadUserAvatar(url) {
      await loadAvatar(url)
        .then((response) => {
          this.img = response.signedUrl;
          return response.signedUrl;
        })
        .catch((error) => {
          console.log(error);
          this.$message.error("Cannot get image now. Please try again");
        });
    },
    querySearch(string, cb) {
      var results = string
        ? this.zones.filter(this.createFilter(string))
        : this.zones;
      cb(results);
    },
    createFilter(string) {
      return (link) => {
        return link.state.toLowerCase().indexOf(string.toLowerCase()) === 0;
      };
    },
    handleSelect(item) {
      this.user.zone_id = item.id;
      this.zone = `${item.zone} - ${item.state}`;
    },
    async verifyUserName(value) {
      if (value === "") {
        this.icon = "gray-400";
        return;
      }
      await checkUsername(value)
        .then((response) => {
          if (response.length === 0) {
            this.icon = "green-500";
            this.$message.success(`${value} is available`);
          } else {
            this.icon = "red-500";
            this.$message.warning(`${value} is already taken`);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async getAllZones() {
      await fetchAllZones()
        .then((response) => {
          this.zones = response;
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    async saveProfile() {
      this.submitting = true;
      await updateProfile(localStorage.getItem(UID), this.user)
        .then((response) => {
          this.$message.success("Profile updated successfully");
          this.$store.commit("SET_USER", response[0]);

          this.$router.push("/profile");
        })
        .catch((error) => {
          this.$message.error(error);
        });
      this.submitting = false;
    },
    async saveUserPhoto() {
      await updateProfile(localStorage.getItem(UID), {
        avatar_url: this.user.avatar_url,
      })
        .then((response) => {
          this.$store.commit("SET_USER", response[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openFile() {
      // this.$message.info(
      //   "You catch us here, we're working to make photo upload available. Give us sometime."
      // );
      this.$refs.img.click();
    },
  },
  computed: {
    userData() {
      return this.$store.state.user;
    },
  },
  mounted() {
    if (this.userData.username !== null) {
      this.user = { ...this.userData };
      this.loadUserAvatar(this.user.avatar_url);
    }
    this.getAllZones();
  },
};
</script>
