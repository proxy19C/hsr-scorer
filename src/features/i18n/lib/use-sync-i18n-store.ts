import { useI18n } from "vue-i18n";
import { useI18nStore } from "../model/use-i18n-locale";
import { storeToRefs } from "pinia";
import { syncRef } from "@vueuse/core";
import { onUnmounted, type Ref } from "vue";

let used = false;

export const useSyncI18nStore = () => {
	if (used === true) {
		throw Error("syncing i18n refs must be done only once");
	}
	used = true;

	const { locale: i18nLocale } = useI18n({ useScope: "global" });

	const store = useI18nStore();
	const { locale: storeLocale } = storeToRefs(store);

	const stopSync = syncRef(storeLocale as Ref<string, string>, i18nLocale);

	onUnmounted(() => {
		stopSync();
	});
};
