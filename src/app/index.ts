import "./main.css";

import App from "./App.vue";
import { createHead } from "@unhead/vue/client";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { router } from "./providers/router";
import { i18n } from "./providers/i18n/i18n";

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(createHead());
app.use(router);

export { app };
