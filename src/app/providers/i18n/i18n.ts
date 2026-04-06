import { createI18n } from "vue-i18n";

import en from "./locales/en.locale.json";
import jaJP from "./locales/ja.locale.json";

export const i18n = createI18n({
	legacy: false,
	availableLocales: ["en", "ja-JP"],
	fallbackLocale: "en",
	messages: {
		en,
		"ja-JP": jaJP,
	},
});
