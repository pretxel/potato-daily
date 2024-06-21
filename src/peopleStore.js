import { writable } from 'svelte/store';

const storedPeople = localStorage.getItem('people') || '[]';
export const people = writable(JSON.parse(storedPeople));
export const peopleToPlay = writable([]);
export const avatarSelected = writable({});
export const editable = writable(true);
export const count = writable(3);
export const startingCounter = writable(false);
export const intervalId = writable(null);
