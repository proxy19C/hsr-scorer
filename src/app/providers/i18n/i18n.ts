import en from "./locales/en.locale.json";
import jaJP from "./locales/ja.locale.json";

import { createI18n } from "vue-i18n";
import { SUPPORTED_LOCALES } from "@/features/i18n/config/constants";

const getLocale = () => {
	const savedLocale = localStorage.getItem("i18n:locale");
	const browserLocale = navigator.language;

	return savedLocale ?? browserLocale ?? "en";
};

export const i18n = createI18n({
	legacy: false,
	availableLocales: SUPPORTED_LOCALES,
	fallbackLocale: "en",
	locale: getLocale(),
	messages: {
		en,
		"ja-JP": jaJP,
	},
});
