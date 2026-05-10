import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";

const getDefaultLocale = () => {
	return navigator.language ?? "en";
};

export const useI18nStore = defineStore("i18n-store", () => {
	const locale = useLocalStorage("i18n:locale", getDefaultLocale());

	const setLocale = (newLocale: string) => {
		locale.value = newLocale;
	};

	return { locale, setLocale };
});
