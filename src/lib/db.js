import { openDB } from 'idb';

/**
 * The name of the IndexedDB database.
 * @constant {string}
 */
const DB_NAME = 'Ollapa';

/**
 * The version of the IndexedDB database.
 * @constant {number}
 */
const DB_VERSION = 1;

/**
 * The name of the object store in the IndexedDB database.
 * @constant {string}
 */
const STORE_NAME = 'chats';

/**
 * A promise that resolves to the IndexedDB database instance.
 * @type {Promise<import('idb').IDBPDatabase>}
 */
let dbPromise;

/**
 * Initializes the IndexedDB database instance.
 * If the database instance is already initialized, returns the existing promise.
 *
 * @returns {Promise<import('idb').IDBPDatabase>} A promise that resolves to the IndexedDB database instance.
 */
export function initDB() {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			}
		});
	}
	return dbPromise;
}

/**
 * Retrieves all chats from the IndexedDB database.
 *
 * @returns {Promise<Array<App.Chat>>} A promise that resolves to an array of chat objects.
 */
export async function getChats() {
	const db = await initDB();
	return db.getAll(STORE_NAME);
}

/**
 * Adds a new chat to the IndexedDB database.
 *
 * @param {string} title The title of the chat (usually the first user-sent message).
 * @param {string} model The selected model to use for chat completions.
 * @returns {Promise<App.Chat>} A promise that resolves to the newly added chat object.
 */
export async function addChat(title, model) {
	const db = await initDB();
	const now = new Date();
	const newChat = {
		id: crypto.randomUUID(),
		title,
		model,
		createdAt: now,
		modifiedAt: now,
		messages: []
	};
	const id = await db.add(STORE_NAME, newChat);
	return { ...newChat, id };
}

/**
 * Deletes a chat from the IndexedDB database.
 *
 * @param {IDBValidKey} id The ID of the chat to delete.
 * @returns {Promise<void>} A promise that resolves when the chat is deleted.
 */
export async function deleteChat(id) {
	const db = await initDB();
	await db.delete(STORE_NAME, id);
}

/**
 * Adds a new message to a chat in the IndexedDB database.
 *
 * @param {IDBValidKey} chatId The ID of the chat to add the message to.
 * @param {App.Message} message The message to add.
 * @returns {Promise<App.Chat>} A promise that resolves to the updated chat object.
 */
export async function addMessage(chatId, message) {
	const db = await initDB();
	const chat = await db.get(STORE_NAME, chatId);
	chat.messages.push(message);
	chat.modifiedAt = new Date();
	await db.put(STORE_NAME, chat);
	return chat;
}
