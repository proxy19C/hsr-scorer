<script setup lang="ts">
import { PlayIcon } from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import Button from "@/shared/ui/button/Button.vue";
import Dialog from "@/shared/ui/dialog/Dialog.vue";
import H1 from "@/shared/ui/typography/H1.vue";
import H2 from "@/shared/ui/typography/H2.vue";
import P from "@/shared/ui/typography/P.vue";
import { useGame } from "@/features/game/model/store";

const { t } = useI18n();
const game = useGame();

const showModalSmallPool = ref<boolean>(false);

const start = () => {
	try {
		game.start();
	} catch (err) {
		if (err instanceof Error && err.message.includes("too character pool")) {
			showModalSmallPool.value = true;
		} else {
			console.error("Game start error:", err);
		}
	}
};
</script>

<template>
	<div v-if="game.stage === 'START_SCREEN'" class="flex max-w-[800px] flex-col">
		<H1 class="text-center">{{ t('game.start.title') }}</H1>
		<P class="text-center">
			{{ t('game.start.description') }}
		</P>

		<Button class="mt-4 w-fit gap-2 self-center" @click="start">
			<PlayIcon class="w-4" />
			<span>{{ t('game.start.startGame') }}</span>
		</Button>

		<P class="text-center">
			{{ t('game.start.progressNote') }}
		</P>
	</div>

	<Dialog v-model="showModalSmallPool">
		<H2 class="font-bold">{{ t('game.start.smallPoolWarning.title') }}</H2>
		<P>
			{{ t('game.start.smallPoolWarning.description') }}
		</P>
		<div class="flwx-row mt-4 flex gap-2 self-end">
			<Button size="sm" @click="showModalSmallPool = false">{{ t('common.confirm') }}</Button>
		</div>
	</Dialog>
</template>
