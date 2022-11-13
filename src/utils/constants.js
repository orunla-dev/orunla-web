export const UID = "uid";

export const USER_ROUTES = [
  {
    title: "Books",
    icon: "icofont-book",
    route: "/books",
  },
  {
    title: "My Lists",
    icon: "icofont-list",
    route: "/lists",
  },
  {
    title: "Settings",
    icon: "icofont-settings",
    route: "/me/settings",
  },
];

export const AUTHOR_ROUTES = [
  ...USER_ROUTES,
  {
    title: "Performance",
    icon: "icofont-chart-bar-graph",
    route: "/performance",
  },
];

export const ADMIN_ROUTES = [
  ...USER_ROUTES,
  {
    // Track author and vendor performance
    title: "Performance",
    icon: "icofont-chart-bar-graph",
    route: "/admin/perfomance",
  },
  {
    title: "Reports",
    icon: "",
    route: "/admin/reports",
  },
  {
    title: "Users",
    icon: "",
    route: "/admin/users",
  },
];

export const SUPER_ADMIN_ROUTES = [
  ...ADMIN_ROUTES,
  {
    title: "Vendors",
    icon: "icofont-people",
    route: "/admin/vendors",
  },
  {
    title: "Authors",
    icon: "",
    route: "/admin/authors",
  },
];
