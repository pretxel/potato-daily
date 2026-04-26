import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render } from '@testing-library/svelte';
import Counter from '../components/Counter.svelte';
import { appState } from '../state.svelte.js';

describe('Counter', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		appState.count = 3;
		appState.startingCounter = false;
	});

	afterEach(() => {
		vi.useRealTimers();
		appState.count = 3;
		appState.startingCounter = false;
	});

	it('renders the current count value from state', () => {
		const { container } = render(Counter, { onDone: vi.fn() });
		expect(container.querySelector('span')?.textContent?.trim()).toBe('3');
	});

	it('reflects updates to the count state', async () => {
		const { container } = render(Counter, { onDone: vi.fn() });
		await act(() => {
			appState.count = 7;
		});
		expect(container.querySelector('span')?.textContent?.trim()).toBe('7');
	});

	it('decrements count by 1 each second', async () => {
		render(Counter, { onDone: vi.fn() });
		expect(appState.count).toBe(3);

		await act(() => vi.advanceTimersByTime(1000));
		expect(appState.count).toBe(2);

		await act(() => vi.advanceTimersByTime(1000));
		expect(appState.count).toBe(1);

		await act(() => vi.advanceTimersByTime(1000));
		expect(appState.count).toBe(0);
	});

	it('calls onDone when count hits zero', async () => {
		const onDone = vi.fn();
		render(Counter, { onDone });

		await act(() => vi.advanceTimersByTime(3000));
		expect(onDone).toHaveBeenCalled();
	});

	it("continues to tick past zero (cleanup is parent's responsibility)", async () => {
		appState.count = 1;
		render(Counter, { onDone: vi.fn() });

		await act(() => vi.advanceTimersByTime(2000));
		expect(appState.count).toBe(-1);
	});
});
