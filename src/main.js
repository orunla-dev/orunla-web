import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import "./assets/tailwind.css";
import "./assets/icofont.min.css";

import "./plugins/element.js";
import "./plugins/vee-validate.js";
import "./plugins/vue-meta.js";

import moment from "moment";

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
