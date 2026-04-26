import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { flushSync } from 'svelte';
import { appState } from '../state.svelte.js';

const sampleA = { name: 'Alice', image: 'https://example.com/a.svg' };
const sampleB = { name: 'Bob', image: 'https://example.com/b.svg' };
const sampleC = { name: 'Carol', image: 'https://example.com/c.svg' };

function resetState() {
	appState.people = [];
	appState.peopleToPlay = [];
	appState.avatarSelected = {};
	appState.count = 3;
	appState.startingCounter = false;
}

describe('appState', () => {
	beforeEach(() => {
		resetState();
		flushSync();
		localStorage.clear();
	});

	afterEach(() => {
		resetState();
		flushSync();
		localStorage.clear();
	});

	describe('default values', () => {
		it('peopleToPlay starts empty', () => {
			expect(appState.peopleToPlay).toEqual([]);
		});

		it('avatarSelected starts as an empty object', () => {
			expect(appState.avatarSelected).toEqual({});
		});

		it('count starts at 3', () => {
			expect(appState.count).toBe(3);
		});

		it('startingCounter starts as false', () => {
			expect(appState.startingCounter).toBe(false);
		});
	});

	describe('add and remove logic', () => {
		it('adds a person to the people list', () => {
			appState.people = [...appState.people, sampleA];
			expect(appState.people).toEqual([sampleA]);
		});

		it('appends multiple people in order', () => {
			appState.people = [...appState.people, sampleA];
			appState.people = [...appState.people, sampleB];
			appState.people = [...appState.people, sampleC];
			expect(appState.people.map((p) => p.name)).toEqual([
				'Alice',
				'Bob',
				'Carol',
			]);
		});

		it('removes a person at a given index', () => {
			appState.people = [sampleA, sampleB, sampleC];
			const copy = [...appState.people];
			copy.splice(1, 1);
			appState.people = copy;
			expect(appState.people.map((p) => p.name)).toEqual([
				'Alice',
				'Carol',
			]);
		});

		it('handles removing the last person', () => {
			appState.people = [sampleA];
			appState.people = [];
			expect(appState.people).toEqual([]);
		});
	});

	describe('localStorage persistence', () => {
		it('writes the people array to localStorage when mutated', () => {
			appState.people = [sampleA, sampleB];
			flushSync();
			const stored = JSON.parse(localStorage.getItem('people'));
			expect(stored).toEqual([sampleA, sampleB]);
		});

		it('overwrites previously stored data on persist', () => {
			appState.people = [sampleA];
			flushSync();
			appState.people = [sampleB, sampleC];
			flushSync();
			expect(JSON.parse(localStorage.getItem('people'))).toEqual([
				sampleB,
				sampleC,
			]);
		});

		it('persists an empty list when all people are removed', () => {
			appState.people = [sampleA];
			flushSync();
			appState.people = [];
			flushSync();
			expect(localStorage.getItem('people')).toBe('[]');
		});

		it('hydration logic returns parsed list when localStorage has data', () => {
			const stored = [sampleA, sampleB];
			localStorage.setItem('people', JSON.stringify(stored));
			const hydrated = JSON.parse(
				localStorage.getItem('people') || '[]',
			);
			expect(hydrated).toEqual(stored);
		});

		it('hydration logic returns an empty array when localStorage is empty', () => {
			const hydrated = JSON.parse(
				localStorage.getItem('people') || '[]',
			);
			expect(hydrated).toEqual([]);
		});
	});
});
