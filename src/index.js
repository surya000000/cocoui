import Input from "./components/input";
import FullCalendar from "./components/full-calendar";

const components = [
    Input,
    FullCalendar,
];

const install = function(Vue) {
  components.forEach(component => {
      Vue.component(component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

const cocouiVersion = { version: process.env.VERSION };

export {
    install,
    Input,
    FullCalendar,
};
