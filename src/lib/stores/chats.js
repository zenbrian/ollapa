import { writable } from 'svelte/store';
import {
	getChats as dbGetChats,
	addChat as dbAddChat,
	deleteChat as dbDeleteChat,
	addMessage as dbAddMessage
} from '$lib/db';

/** @type {import('svelte/store').Writable<App.Chat[]>} */
export const chats = writable([]);

export const isLoading = writable(true);

export async function getChats() {
	isLoading.set(true);
	try {
		chats.set(await dbGetChats());
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
export async function addChat(title) {
	try {
		const newChat = await dbAddChat(title);
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
export async function deleteChat(id) {
	try {
		await dbDeleteChat(id);
		chats.update((cs) => cs.filter((chat) => chat.id !== id));
	} catch (error) {
		console.error('Failed to delete conversation:', error);
		throw error;
	}
}

/**
 *
 * @param {IDBValidKey} chatId
 * @param {App.Message} message
 * @returns {Promise<App.Chat>}
 */
export async function addMessage(chatId, message) {
	try {
		const updatedChat = await dbAddMessage(chatId, message);
		chats.update((cs) => cs.map((chat) => (chat.id === chatId ? updatedChat : chat)));
		return updatedChat;
	} catch (error) {
		console.error('Failed to add message:', error);
		throw error;
	}
}
