<script setup lang="ts">
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { useThemeStore } from "../model/theme.store";
import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-vue-next";
import Button from "@/shared/ui/button/Button.vue";

const store = useThemeStore();

const isOpen = ref(false);

const options = [
	{ text: "Dark", icon: MoonStarIcon, onClick: store.setThemeDark },
	{ text: "Light", icon: SunIcon, onClick: store.setThemeLight },
	{ text: "Auto", icon: MonitorIcon, onClick: store.setThemeAuto },
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
			<component :is="store.isDark === true ? MoonStarIcon : SunIcon" class="size-4" />
		</Button>

		<div
			v-if="isOpen"
			class="border-border bg-background absolute right-0 mt-2 grid grid-flow-row grid-cols-[1fr] gap-0.5 rounded-md border p-2"
		>
			<Button
				v-for="{ text, icon, onClick } in options"
				:key="text + ':theme-switch-button'"
				size="sm"
				variant="ghost"
				class="items-center justify-start gap-2"
				@click="onClick"
			>
				<component :is="icon" class="size-4" />
				<span>{{ text }}</span>
			</Button>
		</div>
	</div>
</template>
