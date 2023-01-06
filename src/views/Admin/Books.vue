<template>
  <div class="">
    <div class="flex justify-end mb-10 mt-5 gap-5">
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
      :data="book"
      :action="action"
    />
    <add-new-author-modal
      v-if="$route.query.action === 'add_author'"
      @close="handleClose()"
      @created="getAllBooks()"
      :data="author"
      :action="authorAction"
    />
    <el-table :data="books" style="width: 100%" v-loading="loading">
      <el-table-column label="ISBN" width="120">
        <template slot-scope="scope">
          {{ scope.row.isbn }}
        </template>
      </el-table-column>
      <el-table-column label="" width="100">
        <template slot-scope="scope">
          <div class="flex justify-center gap-2">
            <i
              class="icofont-read-book text-xl"
              :class="scope.row.paperback ? 'text-green-500' : 'text-red-500'"
              :title="
                scope.row.paperback
                  ? 'Paperback available'
                  : 'Paperback not available'
              "
            ></i>
            <i
              class="icofont-ebook text-xl"
              :class="scope.row.ebook ? 'text-green-500' : 'text-red-500'"
              :title="
                scope.row.paperback ? 'Ebook available' : 'Ebook not available'
              "
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
              class="text-xl icofont-edit hover:text-primary cursor-pointer"
              @click="editBook(scope.row)"
            ></i>
            <i
              class="text-xl icofont-ui-delete hover:text-red-500 cursor-pointer"
              @click="deleteBook(scope.row)"
            ></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end items-center gap-4 mt-10">
      <div class="">Total: {{ count }}</div>
      <el-pagination
        background
        layout="prev,  next"
        :total="count / 50"
        @current-change="
          range.start += 50;
          range.end += 50;
          getAllBooks();
        "
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchBooks, deleteABook } from "@/services/admin";

export default {
  name: "AdminBooksPage",
  components: {
    addNewBookModal: () => import("@/components/Admin/AddNewBook"),
    addNewAuthorModal: () => import("@/components/Admin/AddNewAuthor"),
  },
  data() {
    return {
      img: "",
      bookModal: false,
      books: [],
      book: {},
      action: "add",
      loading: true,
      authors: [],
      author: {},
      authorAction: "add",
      range: {
        start: 0,
        end: 50,
      },
      count: 0,
    };
  },
  methods: {
    handleClose() {
      this.book = {};
      this.author = {};
      this.action = "add";
      this.authorAction = "add";
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
            } else {
              done();
            }
          },
        }
      ).then(() => {
        this.$message.success(`${book.title} deleted`);
        this.getAllBooks();
      });
    },
    editBook(book) {
      this.action = "edit";
      this.book = book;
      this.$router.push("?action=add_book");
    },
    async getAllBooks() {
      this.handleClose();
      this.loading = true;
      this.action = "add";
      this.book = {};
      await fetchBooks(this.range)
        .then((response) => {
          this.books = response.data;
          this.count = response.count;
        })
        .catch((error) => {
          this.$meaasge.error(error);
        });
      this.loading = false;
    },
  },
  mounted() {
    this.getAllBooks();
  },
  metaInfo: {
    title: "Admin",
  },
};
</script>
