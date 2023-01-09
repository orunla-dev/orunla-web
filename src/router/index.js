import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";
import store from "../store";

import { UID } from "../utils/constants";
import { supabase } from "../config/supabase";

Vue.use(VueRouter);

async function guard(to, from, next) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    localStorage.setItem(UID, user.id);
    next();
  } else {
    if (to.query.continue) {
      next(`/auth/login?continue=${to.query.continue}`);
    } else {
      next(`/auth/login?continue=${to.fullPath}`);
    }
  }
}

async function adminGuard(to, from, next) {
  const user = store.state.user;
  if (user.admin) {
    next();
  } else {
    next(from);
  }
}

const routes = [
  {
    path: "/",
    component: Index,
    children: [
      {
        path: "/",
        name: "Homepage",
        beforeEnter: guard,
        component: () => import("../views/Home.vue"),
      },
      {
        path: "/lists",
        name: "UserListPage",
        beforeEnter: guard,
        component: () => import("../views/Lists.vue"),
      },
      {
        path: "/profile",
        beforeEnter: guard,
        name: "ProfileHome",
        component: () => import("../views/profile/Index.vue"),
      },
      {
        path: "/profile/edit",
        beforeEnter: guard,
        name: "EditProfilePage",
        component: () => import("../views/profile/Edit.vue"),
      },
      {
        path: "/authors",
        name: "AuthorsPageIndex",
        component: () => import("../views/authors/Index.vue"),
      },
      {
        path: "/authors/:authors_id",
        name: "AuthorsPage",
        component: () => import("../views/authors/Author.vue"),
      },
      {
        path: "/books",
        name: "BooksPageIndex",
        component: () => import("../views/books/Index.vue"),
      },
      {
        // /books/{isbn - must be a number}/{book_title - optional}
        path: "/books/:isbn(\\d+)/:title?",
        name: "BookPage",
        component: () => import("../views/books/Book.vue"),
      },
      {
        // Query is optional
        path: "/search/:query?",
        name: "SearchPage",
        component: () => import("../views/Search/Index.vue"),
      },
      {
        path: "/categories/:query?",
        name: "SearchResultPage",
        component: () => import("../views/Search/Category.vue"),
      },
    ],
  },
  {
    path: "/read/:isbn(\\d+)",
    name: "ReaderPage",
    component: () => import("../views/ReaderPage.vue"),
    beforeEnter: guard,
  },
  {
    path: "/auth",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/Index.vue"),
    children: [
      {
        path: "/",
        name: "AuthPage",
        component: () => import("../views/auth/Auth.vue"),
      },
      {
        path: "register",
        name: "RegisterPage",
        component: () =>
          import(/* webpackChunkName: "auth" */ "../views/auth/Register.vue"),
      },
      {
        path: "login",
        name: "LogInPage",
        component: () =>
          import(/* webpackChunkName: "auth" */ "../views/auth/Login.vue"),
      },
      {
        path: "save-password",
        name: "SavePassword",
        component: () =>
          import(
            /* webpackChunkName: "auth" */ "../views/auth/SendVerification.vue"
          ),
      },
      {
        path: "reset-password",
        name: "ResetPassword",
        component: () =>
          import(
            /* webpackChunkName: "auth"
             */ "../views/auth/ResetPassword.vue"
          ),
      },
    ],
  },
  {
    path: "/get-started",
    name: "GetStartedPage",
    component: () => import("../views/GetStarted.vue"),
    beforeEnter: guard,
  },
  {
    path: "/admin",
    component: Index,
    children: [
      {
        path: "/admin/books",
        name: "AdminBooksPage",
        component: () => import("../views/Admin/Books.vue"),
        beforeEnter: adminGuard,
      },
      {
        path: "/admin/authors",
        name: "AdminAuthorsPage",
        component: () => import("../views/Admin/Authors.vue"),
        beforeEnter: adminGuard,
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    window.scrollTo(0, 5);
  },
});

export default router;
