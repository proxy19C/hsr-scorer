<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
import { LanguagesIcon } from "lucide-vue-next";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { setLocale, supportedLocales, getCurrentLocale } from "@/shared/lib/i18n";
import Button from "@/shared/ui/button/Button.vue";

const { t } = useI18n();
const isLanguageSwitcherOpen = ref(false);

function closeSwitcher() {
  isLanguageSwitcherOpen.value = false;
}

function switchLanguage(locale: string) {
  setLocale(locale);
  closeSwitcher();
}

function getCurrentLanguageName(): string {
  const currentLocale = getCurrentLocale();
  const language = supportedLocales.find(lang => lang.code === currentLocale);
  return language?.name || 'English';
}
</script>

<template>
  <div v-on-click-outside="closeSwitcher" class="relative">
    <Button 
      variant="outline" 
      size="icon" 
      @click="isLanguageSwitcherOpen = !isLanguageSwitcherOpen"
      :title="t('language.select')"
    >
      <LanguagesIcon class="size-4" />
    </Button>

    <div
      v-if="isLanguageSwitcherOpen"
      class="border-border bg-background absolute right-0 mt-2 grid grid-flow-row grid-cols-[1fr] gap-0.5 rounded-md border p-2 min-w-32"
    >
      <Button
        v-for="language in supportedLocales"
        :key="language.code"
        size="sm"
        variant="ghost"
        class="items-center justify-start gap-2"
        @click="switchLanguage(language.code)"
        :class="{
          'bg-accent': getCurrentLocale() === language.code
        }"
      >
        <span>{{ language.name }}</span>
      </Button>
    </div>
  </div>
</template>