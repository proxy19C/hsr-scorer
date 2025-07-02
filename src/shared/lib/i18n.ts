import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';

const messages = {
  en,
  zh,
  ja
};

// 获取浏览器语言设置
function getBrowserLocale(): string {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('zh')) {
    return 'zh';
  } else if (browserLang.startsWith('ja')) {
    return 'ja';
  } else {
    return 'en';
  }
}

// 从localStorage获取保存的语言设置，如果没有则使用浏览器语言
const savedLocale = localStorage.getItem('locale') || getBrowserLocale();

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages,
  globalInjection: true
});

// 切换语言的函数
export function setLocale(locale: string) {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
}

// 获取当前语言
export function getCurrentLocale(): string {
  return i18n.global.locale.value;
}

// 获取支持的语言列表
export const supportedLocales = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' }
];