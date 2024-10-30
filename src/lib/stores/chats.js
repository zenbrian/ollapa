import { browser } from '$app/environment';
import { writable, get } from 'svelte/store';
import { setError } from './errors';
import {
	getChats as dbGetChats,
	addChat as dbAddChat,
	deleteChat as dbDeleteChat,
	addMessage as dbAddMessage
} from '$lib/db';

/**
 * A writable store containing the list of chats.
 * @type {import('svelte/store').Writable<App.Chat[]>}
 */
export const chats = writable([]);

/**
 * A writable store indicating whether the chats are currently loading.
 * @type {import('svelte/store').Writable<boolean>}
 */
export const isLoading = writable(true);

/**
 * A writable store containing the list of available models.
 * @type {import('svelte/store').Writable<string[]>}
 */
export const availableModels = writable([]);

const defaultApiUrl = 'http://localhost:11434';
const storedApiUrl = browser ? localStorage.getItem('apiUrl') : null;

/**
 * A writable store containing the API URL.
 * @type {import('svelte/store').Writable<string>}
 */
export const apiUrl = writable(storedApiUrl || defaultApiUrl);

if (browser) {
	apiUrl.subscribe((value) => {
		localStorage.setItem('apiUrl', value);
	});
}

/**
 * Retrieves the list of chats from the database and updates the store.
 * @returns {Promise<void>}
 */
export async function getChats() {
	isLoading.set(true);
	try {
		chats.set(await dbGetChats());
	} catch (error) {
		console.error('Failed to load chats:', error);
		setError('Failed to load chats.');
	} finally {
		isLoading.set(false);
	}
}

/**
 * Fetches the list of available models from the API and updates the store.
 * @returns {Promise<void>}
 */
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
		console.error('Failed to fetch available models:', error);
		setError(
			'Failed to fetch available models. Make sure your Ollama server is configured correctly.'
		);
		availableModels.set([]);
	}
}

/**
 * Adds a new chat to the database and updates the store.
 *
 * @param {string} title - The title of the chat.
 * @param {string} model - The model associated with the chat.
 * @returns {Promise<App.Chat>}
 */
export async function addChat(title, model) {
	try {
		const newChat = await dbAddChat(title, model);
		chats.update((cs) => [...cs, newChat]);
		return newChat;
	} catch (error) {
		console.error('Failed to create chat:', error);
		setError('Failed to create chat.');
		throw error;
	}
}

/**
 * Deletes a chat from the database and updates the store.
 *
 * @param {IDBValidKey} id - The ID of the chat to delete.
 * @returns {Promise<void>}
 */
export async function deleteChat(id) {
	try {
		await dbDeleteChat(id);
		chats.update((cs) => cs.filter((chat) => chat.id !== id));
	} catch (error) {
		console.error('Failed to delete chat:', error);
		setError('Failed to delete chat.');
		throw error;
	}
}

/**
 * Adds a new message to a chat in the database and updates the store.
 *
 * @param {IDBValidKey} chatId - The ID of the chat to add the message to.
 * @param {App.Message} message - The message to add.
 * @returns {Promise<App.Chat>}
 */
export async function addMessage(chatId, message) {
	try {
		const updatedChat = await dbAddMessage(chatId, message);
		chats.update((cs) => cs.map((chat) => (chat.id === chatId ? updatedChat : chat)));
		return updatedChat;
	} catch (error) {
		console.error('Failed to add message:', error);
		setError('Failed to add message.');
		throw error;
	}
}

/**
 * Retrieves a chat completion from the API.
 *
 * @param {string} model - The model to use for the chat completion.
 * @param {App.Message[]} messages - The messages to use as input for the chat completion.
 * @param {function|null|undefined} onChunk - A callback function to update the UI in real-time.
 * @returns {Promise<string>}
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
