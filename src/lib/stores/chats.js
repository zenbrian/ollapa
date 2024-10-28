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

export const availableModels = writable([]);

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

export async function fetchAvailableModels() {
	try {
		// TODO: allow user to configure URL
		const response = await fetch('http://localhost:11434/api/tags');
		if (!response.ok) {
			throw new Error('Failed to fetch available models');
		}
		const data = await response.json();
		availableModels.set(data.models.map((/** @type {Ollama.Model} */ model) => model.name));
	} catch (error) {
		console.error('Error fetching available models:', error);
		availableModels.set([]);
	}
}

/**
 *
 * @param {string} title
 * @param {string} model
 * @returns {Promise<App.Chat>}
 */
export async function addChat(title, model) {
	try {
		const newChat = await dbAddChat(title, model);
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
