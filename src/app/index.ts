import "./main.css";

import { createHead } from "@unhead/vue/client";
import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./providers";
import { i18n } from "@/shared/lib/i18n";

const app = createApp(App).use(createPinia()).use(createHead()).use(router).use(i18n);

export { app };
