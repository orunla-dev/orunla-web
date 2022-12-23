<template>
  <div class="">
    <div class="flex justify-end mb-10 gap-5">
      <router-link to="?action=add_author">
        <el-button type="secondary" @click="bookModal = true">
          Add New Author
        </el-button>
      </router-link>
      <router-link to="?action=add_book">
        <el-button type="primary" @click="bookModal = true">
          Add New Book
        </el-button>
      </router-link>
    </div>
    <add-new-book-modal
      v-if="$route.query.action === 'add_book'"
      @close="handleClose()"
      @created="getAllBooks()"
    />
    <el-table :data="books" style="width: 100%">
      <el-table-column label="ISBN" width="120">
        <template slot-scope="scope">
          {{ scope.row.isbn }}
        </template>
      </el-table-column>
      <el-table-column label="" width="100">
        <template slot-scope="scope">
          <div class="flex justify-center gap-2">
            <i
              class="icofont-read-book text-2xl"
              :class="scope.row.paperback ? 'text-green-300' : 'text-red-300'"
            ></i>
            <i
              class="icofont-ebook text-2xl"
              :class="scope.row.ebook ? 'text-green-300' : 'text-red-300'"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Title" width="300">
        <template slot-scope="scope">
          {{ scope.row.title }}:
          <small class="line-clamp-1" :title="scope.row.sub_title">
            {{ scope.row.sub_title }}
          </small>
        </template>
      </el-table-column>
      <el-table-column label="Author" width="180">
        <template slot-scope="scope">
          {{ scope.row.authors.fullname }}
        </template>
      </el-table-column>
      <el-table-column label="Restricted to" width="150">
        <template slot-scope="scope">
          {{ scope.row.restricted_to }}
        </template>
      </el-table-column>
      <el-table-column label="">
        <template slot-scope="scope">
          <div class="flex gap-3">
            <i
              class="text-xl icofont-edit text-primary cursor-pointer"
              @click="editBook(scope.row)"
            ></i>
            <i
              class="text-xl icofont-ui-delete text-red-500 cursor-pointer"
              @click="deleteBook(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchBooks, deleteABook } from "@/services/admin";

export default {
  name: "AdminBooksPage",
  components: {
    addNewBookModal: () => import("@/components/Admin/AddNewBook"),
  },
  data() {
    return {
      img: "",
      bookModal: false,
      books: [],
    };
  },
  methods: {
    handleClose() {
      this.$router.push("/admin/books");
    },
    async deleteBook(book) {
      this.$confirm(
        `You want to delete ${book.title} permanently?`,
        "You're about to delete a book",
        {
          confirmButtonText: "Yes, delete.",
          cancelButtonText: "No",
          type: "error",
          beforeClose: async (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Please wait...";
              await deleteABook(book.isbn)
                .then(() => {
                  done();
                })
                .catch((error) => {
                  done();
                  this.$message.error(error);
                });
              instance.confirmButtonLoading = false;
            }
          },
        }
      ).then(() => {
        this.$message.success(`${book.title} deleted`);
        this.getAllBooks();
      });
    },
    async getAllBooks() {
      this.handleClose();
      await fetchBooks()
        .then((response) => {
          this.books = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getAllBooks();
  },
};
</script>
