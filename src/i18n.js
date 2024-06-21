import { getLocaleFromNavigator, init, register } from 'svelte-i18n';

register('en', () => import('../locales/en.json'));
register('es', () => import('../locales/es.json'));
register('fr', () => import('../locales/fr.json'));
// en, en-US and pt are not available yet

init({
	fallbackLocale: 'en',
	initialLocale: getLocaleFromNavigator(),
});
