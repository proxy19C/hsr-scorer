<script setup lang="ts">
import { HomeIcon, SettingsIcon } from "lucide-vue-next";
import Button from "@/shared/ui/button/Button.vue";
import ThemeSwitchButton from "@/features/theme-switch/ui/ThemeSwitchButton.vue";
import LanguageSwitchButton from "@/features/i18n/ui/LanguageSwitchButton.vue";

const nav = [
	{
		icon: HomeIcon,
		name: "Home",
		href: "/",
	},
	{
		icon: SettingsIcon,
		name: "Settings",
		href: "/settings",
	},
];
</script>

<template>
	<header class="bg-background h-header border-border sticky top-0 z-50 border-b">
		<div class="container flex h-full flex-row items-center">
			<nav class="flex flex-row gap-2">
				<RouterLink v-for="endpoint in nav" :key="endpoint.href" :to="endpoint.href">
					<Button variant="outline" size="icon">
						<component :is="endpoint.icon" class="size-4" />
					</Button>
				</RouterLink>
			</nav>

			<div class="flex flex-1 justify-end gap-2">
				<ThemeSwitchButton />
				<LanguageSwitchButton />
			</div>
		</div>
	</header>
</template>
