const storedPeople = (() => {
	try {
		return JSON.parse(localStorage.getItem('people') || '[]');
	} catch {
		return [];
	}
})();

export const appState = $state({
	people: storedPeople,
	peopleToPlay: [...storedPeople],
	avatarSelected: {},
	count: 3,
	startingCounter: false,
});

$effect.root(() => {
	$effect(() => {
		try {
			localStorage.setItem('people', JSON.stringify(appState.people));
		} catch {
			// ignore quota / privacy-mode errors
		}
	});
});
