import { useI18n } from 'vue-i18n';
import charactersData from '@/shared/locales/characters.json';

/**
 * 获取角色的本地化名称
 * @param characterName 角色的英文名称
 * @returns 本地化的角色名称
 */
export function useCharacterName(characterName: string): string {
  const { locale } = useI18n();
  const currentLocale = locale.value;
  
  // 获取当前语言的角色名称映射
  const localeData = charactersData[currentLocale as keyof typeof charactersData];
  
  // 如果找到对应的翻译，返回翻译；否则返回原名
  return localeData?.[characterName as keyof typeof localeData] || characterName;
}

/**
 * 获取指定语言的角色名称
 * @param characterName 角色的英文名称
 * @param targetLocale 目标语言
 * @returns 指定语言的角色名称
 */
export function getCharacterNameByLocale(characterName: string, targetLocale: string): string {
  const localeData = charactersData[targetLocale as keyof typeof charactersData];
  return localeData?.[characterName as keyof typeof localeData] || characterName;
}

/**
 * 获取所有支持的语言列表
 * @returns 支持的语言代码数组
 */
export function getSupportedLocales(): string[] {
  return Object.keys(charactersData);
}

/**
 * 检查角色名称是否有翻译
 * @param characterName 角色的英文名称
 * @param locale 语言代码
 * @returns 是否有翻译
 */
export function hasCharacterTranslation(characterName: string, locale: string): boolean {
  const localeData = charactersData[locale as keyof typeof charactersData];
  return Boolean(localeData?.[characterName as keyof typeof localeData]);
}