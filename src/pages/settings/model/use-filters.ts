import { STAR_RAIL_CHARACTERS } from "@/entities/character/data/star-rail";
import type { Character, StarRailCharacter } from "@/entities/character/model/types";
import { refDebounced } from "@vueuse/core";
import { computed, ref } from "vue";

export type Filter = {
	id: string;
	field: keyof StarRailCharacter;
	value: string;
};

export const useFilters = () => {
	const hsrSearchValue = ref<string>("");
	const hsrSearchDebounced = refDebounced(hsrSearchValue, 200);

	const activeFilters = ref<Filter[]>([]);

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
			const matchesSearch = searchActive
				? character.name.toLowerCase().includes(hsrSearchDebounced.value.trim().toLowerCase())
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

	const isFilterActive = (filterId: Filter["id"]) => {
		return activeFilters.value.some((activeFilter) => activeFilter.id === filterId);
	};

	const enableFilter = (filter: Filter) => {
		activeFilters.value.push(filter);
	};

	const disableFilter = (filterId: string) => {
		activeFilters.value = activeFilters.value.filter((filter) => filter.id !== filterId);
	};

	const resetFilters = () => {
		hsrSearchValue.value = "";
		activeFilters.value = [];
	};

	return {
		hsrSearchValue,
		hsrSearchDebounced,
		activeFilters,
		displayedCharacters,
		isFilterActive,
		enableFilter,
		disableFilter,
		resetFilters,
	};
};
