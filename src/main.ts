import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/tailwind.css';
import router from './router';

const app = createApp(App);
app.directive('click-outside', {
  mounted(el, binding) {
    el.clickOutsideEvent = (event: Event): void => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

app.use(router).mount('#app');
