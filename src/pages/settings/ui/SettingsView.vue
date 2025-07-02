<script setup lang="ts">
import { useHead } from "@unhead/vue";
import { refDebounced } from "@vueuse/core";
import {
	AlertTriangleIcon,
	Checkbox,
	RefreshCwIcon,
	SearchIcon,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { FILTERS } from "../config/filters";
import { STAR_RAIL_CHARACTERS } from "@/entities/character/data/star-rail";
import { useCharacterCardsOptions, useExcludedCharacters } from "@/entities/character/model/stores";
import type { Character } from "@/entities/character/model/types";
import CharacterCard from "@/entities/character/ui/CharacterCard.vue";
import { cn } from "@/shared/lib/cn";
import Alert from "@/shared/ui/alert/Alert.vue";
import AlertDescription from "@/shared/ui/alert/AlertDescription.vue";
import AlertTitle from "@/shared/ui/alert/AlertTitle.vue";
import Button from "@/shared/ui/button/Button.vue";
import Card from "@/shared/ui/card/Card.vue";
import CardContent from "@/shared/ui/card/CardContent.vue";
import CardHeader from "@/shared/ui/card/CardHeader.vue";
import CardTitle from "@/shared/ui/card/CardTitle.vue";
import H1 from "@/shared/ui/typography/H1.vue";
import Input from "@/shared/ui/input/Input.vue";
import Label from "@/shared/ui/label/Label.vue";
import P from "@/shared/ui/typography/P.vue";
import Switch from "@/shared/ui/switch/Switch.vue";
import { useGame } from "@/features/game/model/store";
import type { Filter } from "../model/types";
import { storeToRefs } from "pinia";
import { getCharacterNameByLocale } from "@/shared/lib/character-localization";
import { EDITING_QUEUE, IN_PROGRESS } from "@/features/game/config";

const { t, locale } = useI18n();

const game = useGame();
const cardOptions = useCharacterCardsOptions();

const settings = useExcludedCharacters();
const { excludedIds } = storeToRefs(settings);

const characterClickHandler = (id: Character["id"]) => {
	if (!settings.isExcludedId(id)) {
		settings.excludeIds(id);
	} else {
		settings.includeIds(id);
	}
};

function selectAllCharacters() {
	excludedIds.value = [];
}

function deselectAllCharacters() {
	excludedIds.value = STAR_RAIL_CHARACTERS.map((character) => character.id);
}

const hsrSearchValue = ref<string>("");
const hsrSearchDebounced = refDebounced(hsrSearchValue, 200);

const activeFilters = ref<Filter[]>([]);

function isFilterActive(filterId: Filter["id"]) {
	return activeFilters.value.some((activeFilter) => activeFilter.id === filterId);
}

function enableFilter(filter: Filter) {
	activeFilters.value.push(filter);
}

function disableFilter(filterId: string) {
	activeFilters.value = activeFilters.value.filter((filter) => filter.id !== filterId);
}

function resetFilters() {
	hsrSearchValue.value = "";
	activeFilters.value = [];
}

function handleFilterClick(filter: Filter) {
	if (isFilterActive(filter.id)) {
		disableFilter(filter.id);
	} else {
		enableFilter(filter);
	}
}

const displayedCharacters = computed(() => {
	const fieldGroups = activeFilters.value.reduce((groups, { field, value }) => {
		if (!groups.has(field)) {
			groups.set(field, new Set<string>());
		}

		groups.get(field)!.add(value);

		return groups;
	}, new Map<Filter["field"], Set<string>>());

	return STAR_RAIL_CHARACTERS.filter((character) => {
		const searchActive = hsrSearchDebounced.value.trim().length > 0;
		const searchTerm = hsrSearchDebounced.value.trim().toLowerCase();
		
		// 搜索英文名和本地化名称
		const englishName = character.name.toLowerCase();
		const localizedName = getCharacterNameByLocale(character.name, locale.value).toLowerCase();
		
		const matchesSearch = searchActive
			? englishName.includes(searchTerm) || localizedName.includes(searchTerm)
			: true;

		const filtersActive = fieldGroups.size > 0;

		const matchesFieldFilters =
			!filtersActive ||
			Array.from(fieldGroups.entries()).some(([field, allowedValues]) => {
				const charValue = character[field as keyof Character];
				return allowedValues.has(charValue as string);
			});

		return matchesSearch && matchesFieldFilters;
	});
});

useHead({
	title: "Honkai Scorer | Settings",
});
</script>

<template>
	<main class="bg-background text-foreground min-h-svh-main p-4 space-y-6">
		<H1>{{ t('settings.title') }}</H1>

		<Card>
			<CardHeader>
				<CardTitle>{{ t('settings.characterCard.title') }}</CardTitle>
			</CardHeader>
			<CardContent class="flex flex-col items-start space-y-6">
				<Label class="flex items-center justify-center gap-4">
					<Switch v-model="cardOptions.showTypes" />
					<div>
						<span class="font-medium">{{ t('settings.characterCard.showType') }}</span>
						<p class="text-muted-foreground text-sm">{{ t('settings.characterCard.showTypeDesc') }}</p>
					</div>
				</Label>
				<Label class="flex items-center justify-center gap-4">
					<Switch v-model="cardOptions.showPaths" />
					<div>
						<span class="font-medium">{{ t('settings.characterCard.showPaths') }}</span>
						<p class="text-muted-foreground text-sm">{{ t('settings.characterCard.showPathsDesc') }}</p>
					</div>
				</Label>
			</CardContent>
		</Card>

		<Alert
			v-if="game.stage === EDITING_QUEUE || game.stage === IN_PROGRESS"
			variant="destructive"
			class="mb-6"
		>
			<AlertTitle>You are currently in game!</AlertTitle>
			<AlertDescription>
				While a game is in progress changes to the character pool are not going to affect your
				current game.
			</AlertDescription>
		</Alert>

		<div v-if="game.stage === 'progress'" class="mb-4 flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
			<AlertTriangleIcon class="h-5 w-5" />
			<P class="text-sm">
				{{ t('settings.warnings.progressReset') }}
			</P>
		</div>

		<div v-if="game.stage === 'results'" class="mb-4 flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
			<AlertTriangleIcon class="h-5 w-5" />
			<P class="text-sm">
				{{ t('settings.warnings.resultsReset') }}
			</P>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>{{ t('settings.characterSelection.title') }}</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="character-search">{{ t('settings.characterSelection.search') }}</Label>
					<Input
						id="character-search"
						v-model="hsrSearchValue"
						:placeholder="t('settings.characterSelection.placeholder')"
						class="w-full"
					/>
				</div>

				<div class="flex gap-2">
					<Button @click="selectAllCharacters" variant="outline" size="sm">
						<RefreshCwIcon class="mr-2 h-4 w-4" />
						{{ t('settings.characterSelection.selectAll') }}
					</Button>
					<Button @click="deselectAllCharacters" variant="outline" size="sm">
						<RefreshCwIcon class="mr-2 h-4 w-4" />
						{{ t('settings.characterSelection.deselectAll') }}
					</Button>
					<Button variant="secondary" @click="resetFilters">
						<RefreshCwIcon class="mr-2 h-4 w-4" />
						{{ t('common.reset') }}
					</Button>
				</div>

				<div class="mb-6 flex flex-wrap gap-2">

					<Button
						v-for="filter in FILTERS"
						:key="filter.id"
						:variant="!isFilterActive(filter.id) ? 'outline' : 'secondary'"
						@click="handleFilterClick(filter)"
						size="icon"
					>
						<img :src="`/img/hsr/ui/${filter.value.toLowerCase()}.webp`" class="h-5.5" />
					</Button>
				</div>

				<div class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
					<button
						v-for="character in displayedCharacters"
						:key="character.id"
						@click="characterClickHandler(character.id)"
						:class="
							cn(
								'cursor-pointer transition-transform',
								settings.isExcludedId(character.id) && 'scale-95 opacity-60',
							)
						"
					>
						<CharacterCard
							:character="character"
							:show-type="cardOptions.showTypes"
							:show-path="cardOptions.showPaths"
						/>
					</button>
				</div>
			</CardContent>
		</Card>
	</main>
</template>
