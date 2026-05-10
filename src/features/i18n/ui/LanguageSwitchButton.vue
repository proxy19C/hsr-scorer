<script setup lang="ts">
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import Button from "@/shared/ui/button/Button.vue";
import { useI18nStore } from "../model/use-i18n-locale";
import { LanguagesIcon } from "lucide-vue-next";

const store = useI18nStore();
const isOpen = ref(false);

const options = [
	{ text: "English", locale: "en" },
	{ text: "日本語", locale: "ja-JP" },
];

function handleClose() {
	isOpen.value = false;
}

function handleOpenOrClose() {
	isOpen.value = !isOpen.value;
}
</script>

<template>
	<div v-on-click-outside="handleClose" class="relative">
		<Button variant="outline" size="icon" @click="handleOpenOrClose">
			<LanguagesIcon class="size-4" />
		</Button>

		<div
			v-if="isOpen"
			class="border-border bg-background absolute right-0 mt-2 grid grid-flow-row grid-cols-[1fr] gap-0.5 rounded-md border p-2"
		>
			<Button
				v-for="{ text, locale } in options"
				:key="`locale-switch:${text}:${locale}`"
				size="sm"
				variant="ghost"
				class="items-center justify-start gap-2"
				@click="() => store.setLocale(locale)"
			>
				<span>{{ text }}</span>
			</Button>
		</div>
	</div>
</template>
