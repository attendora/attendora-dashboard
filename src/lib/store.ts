import { writable } from 'svelte/store';

export let signin = writable(false);
export let teacherId = writable(0);
export let loggedIn = writable(false);
export let sideBarSwitch = writable(0);
