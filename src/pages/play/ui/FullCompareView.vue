<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "@/shared/ui/button/Button.vue";
import Dialog from "@/shared/ui/dialog/Dialog.vue";
import H2 from "@/shared/ui/typography/H2.vue";
import P from "@/shared/ui/typography/P.vue";
import ScreenProgress from "./ScreenProgress.vue";
import ScreenResults from "./ScreenResults.vue";
import ScreenStart from "./ScreenStart.vue";
import { useGame } from "@/features/game/model/store";
import { IN_PROGRESS } from "@/features/game/config";

const { t } = useI18n();
const game = useGame();
const showModalReset = ref<boolean>(false);

const confirmReset = () => {
	showModalReset.value = true;
};

const reset = () => {
	showModalReset.value = false;
	game.reset();
};
</script>

<template>
	<main class="bg-background text-foreground h-svh-main flex items-center justify-center p-4">
		<ScreenStart v-if="game.stage === 'START_SCREEN'" />
		<ScreenProgress v-if="game.stage === IN_PROGRESS" @confirm-reset="confirmReset" />
		<ScreenResults v-if="game.stage === 'FINISHED'" @confirm-reset="confirmReset" />
	</main>

	<Dialog v-model="showModalReset">
		<H2 class="font-bold">{{ t('game.progress.confirmReset.title') }}</H2>
		<P>
			{{ t('game.progress.confirmReset.description') }}
		</P>
		<div class="mt-4 flex flex-row gap-2 self-end">
			<Button size="sm" @click="showModalReset = false">{{ t('game.progress.confirmReset.cancel') }}</Button>
			<Button size="sm" variant="destructive" @click="reset">{{ t('game.progress.confirmReset.confirm') }}</Button>
		</div>
	</Dialog>
</template>
