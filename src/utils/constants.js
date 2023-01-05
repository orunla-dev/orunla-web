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

export const CATEGORIES = [
  {
    title: "Personal Finance",
    icon: "http://res.cloudinary.com/orunla/image/upload/v1671639729/books/RichDad-PoorDad_jrz9eu.jpg",
    color: "#ECB22E",
  },
  {
    title: "Business",
    icon: "http://res.cloudinary.com/orunla/image/upload/v1671881107/books/What_Got_You_Here_Won_t_Get_You_There_ng6t88.jpg",
    color: "#36C5F0",
  },
  {
    title: "Economics",
    icon: "http://res.cloudinary.com/orunla/image/upload/v1671880129/books/how-to-lead_bfmipg.jpg",
    color: "#2EB67D",
  },
  {
    title: "Parenting",
    icon: "http://res.cloudinary.com/orunla/image/upload/v1671639729/books/RichDad-PoorDad_jrz9eu.jpg",
    color: "#E01E5A",
  },
];
