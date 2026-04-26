import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { flushSync } from 'svelte';
import NewAvatar from '../components/NewAvatar.svelte';
import { appState } from '../state.svelte.js';

describe('NewAvatar', () => {
	beforeEach(() => {
		appState.people = [];
		flushSync();
		localStorage.clear();
	});

	afterEach(() => {
		appState.people = [];
		flushSync();
		localStorage.clear();
	});

	it('renders the form with input and add button', () => {
		render(NewAvatar);
		expect(screen.getByRole('textbox')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /add/i }))
			.toBeInTheDocument();
	});

	it('rejects submission when name is empty', async () => {
		render(NewAvatar);
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.click(button);

		expect(appState.people).toEqual([]);
	});

	it('rejects submission when input is whitespace only', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: '   ' } });
		await fireEvent.click(button);

		expect(appState.people).toEqual([]);
	});

	it('adds a new person when name is provided', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'Alice' } });
		await fireEvent.click(button);

		expect(appState.people).toHaveLength(1);
		expect(appState.people[0].name).toBe('Alice');
		expect(appState.people[0].image).toBe(
			'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
		);
	});

	it('persists the new person to localStorage', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'Bob' } });
		await fireEvent.click(button);
		flushSync();

		const stored = JSON.parse(localStorage.getItem('people') ?? '[]');
		expect(stored).toHaveLength(1);
		expect(stored[0].name).toBe('Bob');
	});

	it('clears the input after successful submission', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'Carol' } });
		await fireEvent.click(button);

		expect(input.value).toBe('');
	});

	it('appends multiple submissions to the existing list', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'Alice' } });
		await fireEvent.click(button);

		await fireEvent.input(input, { target: { value: 'Bob' } });
		await fireEvent.click(button);

		expect(appState.people.map((p) => p.name)).toEqual(['Alice', 'Bob']);
	});

	it('rejects duplicate name (case-insensitive)', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'Alice' } });
		await fireEvent.click(button);

		await fireEvent.input(input, { target: { value: 'alice' } });
		await fireEvent.click(button);

		expect(appState.people).toHaveLength(1);
	});

	it('trims input before adding', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: '  Dan  ' } });
		await fireEvent.click(button);

		expect(appState.people).toHaveLength(1);
		expect(appState.people[0].name).toBe('Dan');
	});

	it('encodes special characters in the avatar URL', async () => {
		render(NewAvatar);
		const input = screen.getByRole('textbox');
		const button = screen.getByRole('button', { name: /add/i });

		await fireEvent.input(input, { target: { value: 'A & B' } });
		await fireEvent.click(button);

		expect(appState.people[0].image).toContain('seed=A%20%26%20B');
	});
});
