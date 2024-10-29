import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
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
export const apiUrl = writable(
	browser ? localStorage.getItem('apiUrl') || 'http://localhost:11434' : 'http://localhost:11434'
);

if (browser) {
	apiUrl.subscribe((value) => {
		localStorage.setItem('apiUrl', value);
	});
}

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
		const response = await fetch(`${get(apiUrl)}/api/tags`);
		if (!response.ok) {
			throw new Error('Failed to fetch available models');
		}
		const data = await response.json();
		const models = data.models.map((/** @type {Ollama.Model} */ model) => model.name).sort();
		availableModels.set(models);
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

/**
 *
 * @param {string} model
 * @param {App.Message[]} messages
 * @param {function|null|undefined} onChunk
 * @returns
 */
export async function getChatCompletion(model, messages, onChunk) {
	const response = await fetch(`${get(apiUrl)}/api/chat`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ model, messages })
	});

	if (!response.ok) {
		throw new Error('Failed to get chat completion');
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let chatCompletion = '';

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		const chunk = decoder.decode(value);
		const lines = chunk.split('\n');

		for (const line of lines) {
			if (line.trim() === '') continue;

			const data = JSON.parse(line);
			if (!data.done) {
				chatCompletion += data.message?.content || '';

				// Callback to update the UI in real-time
				if (typeof onChunk === 'function') {
					onChunk(chatCompletion);
				}
			}
		}
	}

	return chatCompletion;
}
