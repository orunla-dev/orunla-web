import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/Index.vue";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { UID } from "../utils/constants";

Vue.use(VueRouter);

function guard(to, from, next) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      localStorage.setItem(UID, user.uid);
      next();
    } else {
      next("/auth/login");
    }
  });
}

const routes = [
  {
    path: "/",
    name: "App",
    component: Index,
    children: [
      {
        path: "/",
        name: "Homepage",
        component: () => import("../views/Home.vue"),
        beforeEnter: guard,
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
    ],
  },
  {
    path: "/auth",
    name: "AuthPage",
    component: () =>
      import(/* webpackChunkName: "auth" */ "../views/auth/Index.vue"),
    children: [
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
});

export default router;
