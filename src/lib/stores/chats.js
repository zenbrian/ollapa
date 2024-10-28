import { writable } from 'svelte/store';
import { getChats, addChat, deleteChat } from '$lib/db';

/** @type {import('svelte/store').Writable<App.Chat[]>} */
export const chats = writable([]);

export const isLoading = writable(true);

export async function loadChats() {
	isLoading.set(true);
	try {
		const loadedChats = await getChats();
		chats.set(loadedChats);
	} catch (error) {
		console.error('Failed to load chats:', error);
	} finally {
		isLoading.set(false);
	}
}

/**
 *
 * @param {string} title
 * @returns {Promise<App.Chat>}
 */
export async function createChat(title) {
	try {
		const newChat = await addChat(title);
		chats.update((cs) => [...cs, newChat]);
		return newChat;
	} catch (error) {
		console.error('Failed to create chat:', error);
		throw error;
	}
}

/**
 *
 * @param {IDBValidKey} id
 */
export async function removeChat(id) {
	try {
		await deleteChat(id);
		chats.update((cs) => cs.filter((chat) => chat.id !== id));
	} catch (error) {
		console.error('Failed to delete conversation:', error);
		throw error;
	}
}
