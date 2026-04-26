import '@testing-library/jest-dom/vitest';
import { afterEach, beforeAll, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';
import { addMessages, init, waitLocale } from 'svelte-i18n';

beforeAll(async () => {
	addMessages('en', {
		page_add_new_avatar: 'Add new avatar',
		page_button_add: 'Add',
		page_button_start: 'Start',
		page_button_next: 'Next',
		page_button_again: 'Again',
		page_avatar_selected: 'Avatar selected',
		page_empty_state: 'Add at least one person to get started.',
		page_counter_picking_in: 'Picking in {count}…',
		error_duplicate_name: 'Name already added',
	});
	init({ fallbackLocale: 'en', initialLocale: 'en' });
	await waitLocale('en');
});

beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	cleanup();
	localStorage.clear();
});
