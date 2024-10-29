import { writable } from 'svelte/store';

/**
 * A writable store containing an app-wide error.
 * @type {import('svelte/store').Writable<string|null>}
 */
export const errorStore = writable(null);

/**
 * Set an error message to be displayed app-wide.
 *
 * @param {string} message
 */
export function setError(message) {
	errorStore.set(message);
}

/**
 * Clear the existing error message.
 */
export function clearError() {
	errorStore.set(null);
}
