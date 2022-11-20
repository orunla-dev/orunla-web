import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";

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
    next(`/auth/login?continue=${to.fullPath}`);
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
        path: "/profile",
        name: "Profilepage",
        beforeEnter: guard,
        children: [
          {
            path: "edit",
            name: "EditProfilePage",
            component: () => import("../views/profile/Edit.vue"),
          },
        ],
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
        path: "send-verification",
        name: "SendVerificationPage",
        component: () =>
          import(
            /* webpackChunkName: "auth" */ "../views/auth/SendVerification.vue"
          ),
      },
      {
        path: "verify",
        name: "VerificationPage",
        component: () =>
          import(/* webpackChunkName: "auth" */ "../views/auth/Verify.vue"),
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
    document.getElementById("app").scrollIntoView({ behavior: "smooth" });
  },
});

export default router;
