import Vue from "vue";

const screens = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const sm = (val) => val >= screens.sm && val <= screens.md;
const md = (val) => val >= screens.md && val <= screens.lg;
const lg = (val) => val >= screens.lg && val <= screens.xl;
const xl = (val) => val >= screens.xl;

const getBreakpoint = (w) => {
  if (sm(w)) return "sm";
  else if (md(w)) return "md";
  else if (lg(w)) return "lg";
  else if (xl(w)) return "xl";
  else return "all";
};

const debounce = function (func, wait) {
  var timeout;
  return () => {
    const later = function () {
      timeout = null;
    };
    const callNow = !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func();
  };
};

const breakpoints = Vue.observable({
  w: window.innerWidth,
  h: window.innerHeight,
  is: getBreakpoint(window.innerWidth),
  smAndDown: window.innerWidth <= screens.sm,
  smAndUp: window.innerWidth >= screens.sm,
  mdAndDown: window.innerWidth <= screens.md,
  mdAndUp: window.innerWidth >= screens.md,
  lgAndDown: window.innerWidth <= screens.lg,
  lgAndUp: window.innerWidth >= screens.lg,
});
window.addEventListener(
  "resize",
  debounce(() => {
    breakpoints.w = window.innerWidth;
    breakpoints.h = window.innerHeight;
    breakpoints.is = getBreakpoint(window.innerWidth);
    breakpoints.smAndDown = window.innerWidth <= screens.sm;
    breakpoints.smAndUp = window.innerWidth >= screens.sm;
    breakpoints.mdAndDown = window.innerWidth <= screens.md;
    breakpoints.mdAndUp = window.innerWidth >= screens.md;
    breakpoints.lgAndDown = window.innerWidth <= screens.lg;
    breakpoints.lgAndUp = window.innerWidth >= screens.lg;
  }, 0),
  false
);
export default breakpoints;
