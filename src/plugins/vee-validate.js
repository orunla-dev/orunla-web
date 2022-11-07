import Vue from "vue";
import { extend, ValidationObserver, ValidationProvider } from "vee-validate";
import {
  email,
  max,
  min,
  alpha_num,
  numeric,
  required,
  length,
  is,
} from "vee-validate/dist/rules";

extend("email", email);
extend("max", max);
extend("min", min);
extend("alpha_num", alpha_num);
extend("length", length);
extend("numeric", numeric);
extend("required", required);
extend("is", is);

extend("required", {
  message: "{_field_} is required",
});

extend("min", {
  validate(value, { length }) {
    return value.length >= length;
  },
  params: ["length"],
  message: "{_field_} must have {length} characters",
});

extend("alpha_num", {
  validate(value) {
    const reg = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;
    return reg.test(value);
  },
  message: "{_field_} must contain a minimum of two alphabets and two numbers",
});

extend("is", {
  message: "{_field_} is not same",
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
