import { openDB } from 'idb';

const DB_NAME = 'OllamaClient';
const DB_VERSION = 1;
const STORE_NAME = 'chats';

/** @type {Promise<import('idb').IDBPDatabase>} */
let dbPromise;

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

export async function getChats() {
	const db = await initDB();
	return db.getAll(STORE_NAME);
}

/**
 *
 * @param {string} title
 * @param {string} model
 * @returns {Promise<App.Chat>}
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
 *
 * @param {IDBValidKey} id
 */
export async function deleteChat(id) {
	const db = await initDB();
	await db.delete(STORE_NAME, id);
}

/**
 *
 * @param {IDBValidKey} chatId
 * @param {App.Message} message
 * @returns
 */
export async function addMessage(chatId, message) {
	const db = await initDB();
	const chat = await db.get(STORE_NAME, chatId);
	chat.messages.push(message);
	chat.modifiedAt = new Date();
	await db.put(STORE_NAME, chat);
	return chat;
}
